import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Schedule, CalendarDate, Filters, NewSchedule, ShareSettings, TeamMember } from '../../../types/schedules/recruitment/recruitment'
import { POSITION_MAP, checkScheduleConflict } from '../../../constants/schedules/recruitment/recruitment'

export const useCalendar = (schedules: any, filters: any, searchQuery: any) => {
  const currentDate = ref(new Date())
  const selectedDate = ref(new Date())
  const viewMode = ref<'month' | 'year'>('month')

  const currentYearMonth = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth() + 1
    return `${year}년 ${month}월`
  })

  const currentYear = computed(() => currentDate.value.getFullYear())

  const applyFilters = (daySchedules: Schedule[], filterValues: Filters, query: string) => {
    let filtered = [...daySchedules]
    if (filterValues.position) filtered = filtered.filter(s => s.position === POSITION_MAP[filterValues.position])
    if (filterValues.type) filtered = filtered.filter(s => s.type === filterValues.type)
    if (filterValues.sharedWith === 'my') filtered = filtered.filter(s => !s.sharedWith || s.sharedWith.length === 0)
    else if (filterValues.sharedWith === 'shared') filtered = filtered.filter(s => s.sharedWith && s.sharedWith.length > 0)
    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(s => (s.candidateName && s.candidateName.toLowerCase().includes(lowerQuery)) || (s.position && s.position.toLowerCase().includes(lowerQuery)) || (s.title && s.title.toLowerCase().includes(lowerQuery)))
    }
    return filtered
  }

  const calendarDates = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()
    const dates: CalendarDate[] = []
    const today = new Date()
    
    for (let i = 0; i < firstDayOfWeek; i++) dates.push({ date: null, isToday: false, hasSchedules: false, schedules: [] })
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      let daySchedules = schedules.value.filter((s: Schedule) => s.date === currentDateStr)
      daySchedules = applyFilters(daySchedules, filters.value, searchQuery.value)
      
      dates.push({
        date: day,
        dateString: currentDateStr,
        isToday: today.getDate() === day && today.getMonth() === month && today.getFullYear() === year,
        hasSchedules: daySchedules.length > 0,
        schedules: daySchedules
      })
    }
    return dates
  })

  const selectedDateLabel = computed(() => {
    const month = selectedDate.value.getMonth() + 1
    const day = selectedDate.value.getDate()
    const today = new Date()
    const diffTime = selectedDate.value.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    let label = `${month}월 ${day}일`
    if (diffDays === 0) label += ' (오늘)'
    else if (diffDays === 1) label += ' (내일)'
    else if (diffDays === -1) label += ' (어제)'
    return label
  })

  const selectedDateSchedules = computed(() => {
    const dateStr = `${selectedDate.value.getFullYear()}-${String(selectedDate.value.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.value.getDate()).padStart(2, '0')}`
    return schedules.value.filter((s: Schedule) => s.date === dateStr)
  })

  const getYearViewDates = (month: number) => {
    const year = currentDate.value.getFullYear()
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const firstDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()
    const dates: Array<{ date: number | null; isToday: boolean; hasSchedules: boolean }> = []
    const today = new Date()
    
    for (let i = 0; i < firstDayOfWeek; i++) dates.push({ date: null, isToday: false, hasSchedules: false })
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      let daySchedules = schedules.value.filter((s: Schedule) => s.date === currentDateStr)
      daySchedules = applyFilters(daySchedules, filters.value, searchQuery.value)
      
      dates.push({
        date: day,
        isToday: today.getDate() === day && today.getMonth() === month - 1 && today.getFullYear() === year,
        hasSchedules: daySchedules.length > 0
      })
    }
    return dates
  }

  return {
    currentDate, selectedDate, viewMode, currentYearMonth, currentYear, calendarDates, selectedDateLabel, selectedDateSchedules, getYearViewDates,
    previousMonth: () => currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1),
    nextMonth: () => currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1),
    goToToday: () => { currentDate.value = new Date(); selectedDate.value = new Date() },
    jumpToDate: (year: number, month: number, day: number) => { currentDate.value = new Date(year, month - 1, day); selectedDate.value = new Date(year, month - 1, day); viewMode.value = 'month' }
  }
}

export const useDragSelect = (calendarDates: any) => {
  const isDragging = ref(false)
  const dragStartIndex = ref<number | null>(null)
  const dragEndIndex = ref<number | null>(null)
  const selectedDateRange = ref<{ start: string | null; end: string | null }>({ start: null, end: null })

  const startDrag = (index: number, date: CalendarDate) => {
    if (!date.date) return
    isDragging.value = true
    dragStartIndex.value = index
    dragEndIndex.value = index
    selectedDateRange.value.start = date.dateString || null
    selectedDateRange.value.end = date.dateString || null
  }

  const updateDrag = (index: number) => {
    if (!isDragging.value || dragStartIndex.value === null) return
    dragEndIndex.value = index
    const minIndex = Math.min(dragStartIndex.value, index)
    const maxIndex = Math.max(dragStartIndex.value, index)
    const startDate = calendarDates.value[minIndex]
    const endDate = calendarDates.value[maxIndex]
    if (startDate.dateString && endDate.dateString) {
      selectedDateRange.value.start = startDate.dateString
      selectedDateRange.value.end = endDate.dateString
    }
  }

  const endDrag = (onConfirm?: () => void) => {
    if (!isDragging.value) return
    const wasDragging = dragStartIndex.value !== dragEndIndex.value
    isDragging.value = false
    if (wasDragging && selectedDateRange.value.start && selectedDateRange.value.end) {
      setTimeout(() => {
        if (confirm(`선택한 기간: ${selectedDateRange.value.start} ~ ${selectedDateRange.value.end}\n\n이 기간으로 채용 일정을 등록하시겠습니까?`)) {
          onConfirm?.()
        } else {
          selectedDateRange.value = { start: null, end: null }
        }
      }, 100)
    }
    dragStartIndex.value = null
    dragEndIndex.value = null
  }

  const handleGlobalMouseUp = () => { if (isDragging.value) endDrag() }

  const isDateInDragRange = (index: number) => {
    if (!isDragging.value || dragStartIndex.value === null || dragEndIndex.value === null) return false
    const minIndex = Math.min(dragStartIndex.value, dragEndIndex.value)
    const maxIndex = Math.max(dragStartIndex.value, dragEndIndex.value)
    return index >= minIndex && index <= maxIndex && calendarDates.value[index].date !== null
  }

  onMounted(() => document.addEventListener('mouseup', handleGlobalMouseUp))
  onUnmounted(() => document.removeEventListener('mouseup', handleGlobalMouseUp))

  return { isDragging, dragStartIndex, dragEndIndex, selectedDateRange, startDrag, updateDrag, endDrag, isDateInDragRange }
}

export const useSchedule = (schedules: any) => {
  const showAddModal = ref(false)
  const editingScheduleId = ref<number | null>(null)
  const newSchedule = ref<NewSchedule>({
    type: '', candidateName: '', candidateId: null, title: '', position: '',
    startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0],
    startTime: '10:00', endTime: '11:00', location: '', priority: 'medium',
    interviewer: '', stage: 'scheduled', notes: '', isRecurring: false, createdBy: null
  })

  const resetNewSchedule = () => {
    newSchedule.value = {
      type: '', candidateName: '', candidateId: null, title: '', position: '',
      startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0],
      startTime: '10:00', endTime: '11:00', location: '', priority: 'medium',
      interviewer: '', stage: 'scheduled', notes: '', isRecurring: false, createdBy: null
    }
  }

  const openAddModal = () => { editingScheduleId.value = null; resetNewSchedule(); showAddModal.value = true }
  const openAddModalWithDateRange = (startDate: string, endDate: string) => {
    editingScheduleId.value = null; resetNewSchedule()
    newSchedule.value.startDate = startDate; newSchedule.value.endDate = endDate
    showAddModal.value = true
  }
  const closeAddModal = () => { showAddModal.value = false; editingScheduleId.value = null }

  const saveSchedule = () => {
    if (checkScheduleConflict(schedules.value, newSchedule.value.startDate ?? "", newSchedule.value.endDate ?? "")) {
      alert('선택한 기간에 이미 등록된 일정이 있습니다.\n일정을 등록할 수 없습니다.')
      return
    }
    
    const newId = Math.max(...schedules.value.map((s: Schedule) => s.id), 0) + 1
    
    if (newSchedule.value.isRecurring && newSchedule.value.startDate !== newSchedule.value.endDate) {
      const start = new Date(newSchedule.value.startDate ?? "")
      const end = new Date(newSchedule.value.endDate ?? "")
      let currentId = newId
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]
        schedules.value.push({
          id: currentId++, type: newSchedule.value.type, candidateId: newSchedule.value.candidateId,
          candidateName: newSchedule.value.candidateName, title: newSchedule.value.title || `${newSchedule.value.candidateName} ${newSchedule.value.type}`,
          position: newSchedule.value.position || '기타', date: dateStr, time: `${newSchedule.value.startTime} - ${newSchedule.value.endTime}`,
          location: newSchedule.value.location, priority: newSchedule.value.priority, status: newSchedule.value.stage,
          interviewer: newSchedule.value.interviewer, stage: newSchedule.value.stage, notes: newSchedule.value.notes
        })
      }
    } else {
      schedules.value.push({
        id: newId, type: newSchedule.value.type, candidateId: newSchedule.value.candidateId,
        candidateName: newSchedule.value.candidateName, title: newSchedule.value.title || `${newSchedule.value.candidateName} ${newSchedule.value.type}`,
        position: newSchedule.value.position || '기타', date: newSchedule.value.startDate, time: `${newSchedule.value.startTime} - ${newSchedule.value.endTime}`,
        location: newSchedule.value.location, priority: newSchedule.value.priority, status: newSchedule.value.stage,
        interviewer: newSchedule.value.interviewer, stage: newSchedule.value.stage, notes: newSchedule.value.notes
      })
    }
    closeAddModal()
  }

  const editSchedule = (scheduleId: number) => {
    const schedule = schedules.value.find((s: Schedule) => s.id === scheduleId)
    if (!schedule) return
    editingScheduleId.value = scheduleId
    const [startTime, endTime] = schedule.time.split(' - ')
    newSchedule.value = {
      type: schedule.type, candidateName: schedule.candidateName || '', candidateId: schedule.candidateId || null,
      title: schedule.title || '', position: schedule.position, startDate: schedule.date, endDate: schedule.date,
      startTime: startTime || '10:00', endTime: endTime || '11:00', location: schedule.location,
      priority: schedule.priority, interviewer: schedule.interviewer || '', stage: schedule.stage || 'scheduled',
      notes: schedule.notes || '', isRecurring: false, createdBy: null
    }
    showAddModal.value = true
  }

  const viewScheduleDetail = (scheduleId: number) => {
    const schedule = schedules.value.find((s: Schedule) => s.id === scheduleId)
    if (!schedule) return
    alert(`일정 상세 정보\n\n제목: ${schedule.candidateName || schedule.title}\n포지션: ${schedule.position}\n날짜: ${schedule.date}\n시간: ${schedule.time}\n장소: ${schedule.location}`)
  }

  return { showAddModal, editingScheduleId, newSchedule, openAddModal, openAddModalWithDateRange, closeAddModal, saveSchedule, editSchedule, viewScheduleDetail }
}

export const useShare = (schedules: any, teamMembers: any) => {
  const showShareModal = ref(false)
  const selectedMembers = ref<number[]>([])
  const selectedSchedules = ref<number[]>([])
  const shareSettings = ref<ShareSettings>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    permission: 'view', sendNotification: true, message: ''
  })

  const availableSchedules = computed(() => schedules.value)

  const openShareModal = () => { showShareModal.value = true; selectedMembers.value = []; selectedSchedules.value = [] }
  const closeShareModal = () => {
    showShareModal.value = false; selectedMembers.value = []; selectedSchedules.value = []
    shareSettings.value = {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      permission: 'view', sendNotification: true, message: ''
    }
  }

  const shareSchedule = (scheduleId: number) => {
    selectedSchedules.value = [scheduleId]
    const schedule = schedules.value.find((s: Schedule) => s.id === scheduleId)
    if (schedule?.sharedWith) selectedMembers.value = [...schedule.sharedWith]
    showShareModal.value = true
  }

  const toggleMember = (memberId: number) => {
    const index = selectedMembers.value.indexOf(memberId)
    if (index > -1) selectedMembers.value.splice(index, 1)
    else selectedMembers.value.push(memberId)
  }

  const selectAllMembers = () => { selectedMembers.value = teamMembers.value.map((m: TeamMember) => m.id) }
  const clearAllMembers = () => { selectedMembers.value = [] }

  const toggleSchedule = (scheduleId: number) => {
    const index = selectedSchedules.value.indexOf(scheduleId)
    if (index > -1) selectedSchedules.value.splice(index, 1)
    else selectedSchedules.value.push(scheduleId)
  }

  const selectAllSchedules = () => { selectedSchedules.value = availableSchedules.value.map((s: Schedule) => s.id) }
  const clearAllSchedules = () => { selectedSchedules.value = [] }

  const selectSchedulesByDateRange = () => {
    const start = new Date(shareSettings.value.startDate ?? "")
    const end = new Date(shareSettings.value.endDate ?? "")
    selectedSchedules.value = availableSchedules.value.filter((s: Schedule) => {
      const scheduleDate = new Date(s.date)
      return scheduleDate >= start && scheduleDate <= end
    }).map((s: Schedule) => s.id)
  }

  const getTeamMemberName = (memberId: number) => {
    const member = teamMembers.value.find((m: TeamMember) => m.id === memberId)
    return member ? member.name : ''
  }

  const getScheduleTitle = (scheduleId: number) => {
    const schedule = schedules.value.find((s: Schedule) => s.id === scheduleId)
    return schedule ? (schedule.candidateName || schedule.title || '일정') : ''
  }

  const confirmShare = () => {
    if (selectedMembers.value.length === 0 || selectedSchedules.value.length === 0) return
    selectedSchedules.value.forEach(scheduleId => {
      const schedule = schedules.value.find((s: Schedule) => s.id === scheduleId)
      if (schedule) schedule.sharedWith = [...selectedMembers.value]
    })
    const memberNames = selectedMembers.value.map(id => getTeamMemberName(id)).join(', ')
    alert(`${selectedSchedules.value.length}건의 일정이 ${memberNames}에게 공유되었습니다.\n\n권한: ${shareSettings.value.permission === 'view' ? '보기 전용' : '편집 가능'}`)
    closeShareModal()
  }

  return {
    showShareModal, selectedMembers, selectedSchedules, shareSettings, availableSchedules,
    openShareModal, closeShareModal, shareSchedule, toggleMember, selectAllMembers, clearAllMembers,
    toggleSchedule, selectAllSchedules, clearAllSchedules, selectSchedulesByDateRange,
    getTeamMemberName, getScheduleTitle, confirmShare
  }
}