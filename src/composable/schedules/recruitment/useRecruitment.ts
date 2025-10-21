import { ref, computed, onMounted, onUnmounted } from 'vue'
import type {
  Schedule,
  CalendarDate,
  Filters,
  NewSchedule,
  ShareSettings,
  TeamMember,
} from '../../../types/schedules/recruitment/recruitment'
import { POSITION_MAP, checkScheduleConflict } from '../../../constants/schedules/recruitment/recruitment'
import { createSchedule, setRecurringRule } from '../../../api/schedules/recruitment/recruitment'

/** 유틸: 문자열(yyyy-MM-dd) → Date */
const toDate = (d?: string | null) => (d ? new Date(d) : undefined)
/** 유틸: 범위 포함 여부 */
const inRange = (cur: Date, start?: Date, end?: Date) => {
  if (!start && !end) return false
  const s = start ?? end!
  const e = end ?? start!
  const cs = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate())
  const ss = new Date(s.getFullYear(), s.getMonth(), s.getDate())
  const ee = new Date(e.getFullYear(), e.getMonth(), e.getDate())
  return cs >= ss && cs <= ee
}

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
      const lower = query.toLowerCase()
      filtered = filtered.filter(
        s =>
          (s.candidateName && s.candidateName.toLowerCase().includes(lower)) ||
          (s.position && s.position.toLowerCase().includes(lower)) ||
          (s.title && s.title.toLowerCase().includes(lower)),
      )
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

    for (let i = 0; i < firstDayOfWeek; i++) {
      dates.push({ date: null, isToday: false, hasSchedules: false, schedules: [] })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const current = new Date(currentDateStr)

      // ✅ 기간 일정 포함 비교
      let daySchedules = schedules.value.filter((s: Schedule) =>
        inRange(current, toDate(s.startDate), toDate(s.endDate)),
      )

      daySchedules = applyFilters(daySchedules, filters.value, searchQuery.value)

      dates.push({
        date: day,
        dateString: currentDateStr,
        isToday:
          today.getDate() === day && today.getMonth() === month && today.getFullYear() === year,
        hasSchedules: daySchedules.length > 0,
        schedules: daySchedules,
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
    const current = new Date(dateStr)
    // ✅ 기간 일정 포함
    return schedules.value.filter((s: Schedule) =>
      inRange(current, toDate(s.startDate), toDate(s.endDate)),
    )
  })

  const getYearViewDates = (month: number) => {
    const year = currentDate.value.getFullYear()
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const firstDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()
    const dates: Array<{ date: number | null; isToday: boolean; hasSchedules: boolean }> = []
    const today = new Date()

    for (let i = 0; i < firstDayOfWeek; i++) {
      dates.push({ date: null, isToday: false, hasSchedules: false })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const current = new Date(currentDateStr)

      // ✅ 기간 일정 포함
      const dayHasSchedules = schedules.value.some((s: Schedule) =>
        inRange(current, toDate(s.startDate), toDate(s.endDate)),
      )

      dates.push({
        date: day,
        isToday:
          today.getDate() === day && today.getMonth() === month - 1 && today.getFullYear() === year,
        hasSchedules: dayHasSchedules,
      })
    }
    return dates
  }

  return {
    currentDate,
    selectedDate,
    viewMode,
    currentYearMonth,
    currentYear,
    calendarDates,
    selectedDateLabel,
    selectedDateSchedules,
    getYearViewDates,
    previousMonth: () =>
      (currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1,
        1,
      )),
    nextMonth: () =>
      (currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        1,
      )),
    goToToday: () => {
      currentDate.value = new Date()
      selectedDate.value = new Date()
    },
    jumpToDate: (year: number, month: number, day: number) => {
      currentDate.value = new Date(year, month - 1, day)
      selectedDate.value = new Date(year, month - 1, day)
      viewMode.value = 'month'
    },
  }
}

export const useDragSelect = (calendarDates: any) => {
  const isDragging = ref(false)
  const dragStartIndex = ref<number | null>(null)
  const dragEndIndex = ref<number | null>(null)
  const selectedDateRange = ref<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  })

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
        if (
          confirm(
            `선택한 기간: ${selectedDateRange.value.start} ~ ${selectedDateRange.value.end}\n\n이 기간으로 채용 일정을 등록하시겠습니까?`,
          )
        ) {
          onConfirm?.()
        } else {
          selectedDateRange.value = { start: null, end: null }
        }
      }, 100)
    }
    dragStartIndex.value = null
    dragEndIndex.value = null
  }

  const handleGlobalMouseUp = () => {
    if (isDragging.value) endDrag()
  }

  const isDateInDragRange = (index: number) => {
    if (!isDragging.value || dragStartIndex.value === null || dragEndIndex.value === null) return false
    const minIndex = Math.min(dragStartIndex.value, dragEndIndex.value)
    const maxIndex = Math.max(dragStartIndex.value, dragEndIndex.value)
    return (
      index >= minIndex &&
      index <= maxIndex &&
      calendarDates.value[index].date !== null
    )
  }

  onMounted(() => document.addEventListener('mouseup', handleGlobalMouseUp))
  onUnmounted(() => document.removeEventListener('mouseup', handleGlobalMouseUp))

  return { isDragging, dragStartIndex, dragEndIndex, selectedDateRange, startDrag, updateDrag, endDrag, isDateInDragRange }
}

export const useSchedule = (schedules: any) => {
  const showAddModal = ref(false)
  const editingScheduleId = ref<number | null>(null)

  const newSchedule = ref<NewSchedule>({
    type: '',
    candidateName: '',
    candidateId: null,
    title: '',
    position: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    location: '',
    priority: 'medium',
    interviewer: '',
    stage: 'scheduled',
    notes: '',
    isRecurring: false,
    // 반복 옵션 기본값 유지
    frequency: 'DAILY',
    interval: 1,
    endRecurringDate: null,
    createdBy: null,
  })

  const resetNewSchedule = () => {
    newSchedule.value = {
      type: '',
      candidateName: '',
      candidateId: null,
      title: '',
      position: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '11:00',
      location: '',
      priority: 'medium',
      interviewer: '',
      stage: 'scheduled',
      notes: '',
      isRecurring: false,
      frequency: 'DAILY',
      interval: 1,
      endRecurringDate: null,
      createdBy: null,
    }
  }

  const openAddModal = () => {
    editingScheduleId.value = null
    resetNewSchedule()
    showAddModal.value = true
  }
  const openAddModalWithDateRange = (startDate: string, endDate: string) => {
    editingScheduleId.value = null
    resetNewSchedule()
    newSchedule.value.startDate = startDate
    newSchedule.value.endDate = endDate
    showAddModal.value = true
  }
  const closeAddModal = () => {
    showAddModal.value = false
    editingScheduleId.value = null
  }

  const saveSchedule = async () => {
    // ✅ 중복 체크: 기간 기준
    if (
      checkScheduleConflict(
        schedules.value,
        newSchedule.value.startDate ?? '',
        newSchedule.value.endDate ?? '',
      )
    ) {
      alert('선택한 기간에 이미 등록된 일정이 있습니다.\n일정을 등록할 수 없습니다.')
      return
    }

    try {
      const createdSchedules: any[] = []

      // ✅ 1) 반복 일정: startDate ~ endDate 사이 매일 생성
      if (
        newSchedule.value.isRecurring &&
        newSchedule.value.startDate !== newSchedule.value.endDate
      ) {
        const start = new Date(newSchedule.value.startDate!)
        const end = new Date(newSchedule.value.endDate!)

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0]
          const response = await createSchedule({
            ...newSchedule.value,
            startDate: dateStr,
            endDate: dateStr,
          })
          createdSchedules.push(response.results)
        }

        // ✅ 반복 규칙 저장 (첫 일정 기준)
        if (createdSchedules.length > 0) {
          await setRecurringRule(
            createdSchedules[0].id,
            newSchedule.value.frequency ?? 'DAILY',
            newSchedule.value.interval ?? 1,
            newSchedule.value.endRecurringDate ?? null,
          )
        }
      } else {
        // ✅ 2) 단일 일정 생성
        const response = await createSchedule(newSchedule.value)
        createdSchedules.push(response.results)
      }

      // ✅ UI 반영 (startDate/endDate로 통일)
      createdSchedules.forEach(saved => {
        schedules.value.push({
          id: saved.id,
          type: saved.type,
          candidateId: saved.candidateId,
          candidateName: saved.candidateName,
          title: saved.title,
          position: saved.position,
          startDate: saved.startDate ?? newSchedule.value.startDate,
          endDate: saved.endDate ?? newSchedule.value.endDate,
          startTime: saved.startTime,
          endTime: saved.endTime,
          time: `${saved.startTime} - ${saved.endTime}`,
          location: saved.location,
          priority: saved.priority,
          status: saved.status,
          interviewer: saved.interviewer,
          stage: saved.stage,
          notes: saved.notes,
          sharedWith: saved.shared?.map((m: any) => m.memberId) ?? [],
        } as Schedule)
      })

      alert('✅ 일정이 저장되었습니다.')
      closeAddModal()
    } catch (error) {
      console.error(error)
      alert('❌ 일정 저장 중 오류가 발생했습니다.')
    }
  }

  const editSchedule = (scheduleId: number) => {
    const schedule = schedules.value.find((s: Schedule) => s.id === scheduleId)
    if (!schedule) return
    editingScheduleId.value = scheduleId

    const fallbackTime = `${schedule.startTime ?? '10:00'} - ${schedule.endTime ?? '11:00'}`
    const [startTime, endTime] = (schedule.time || fallbackTime).split(' - ')

    newSchedule.value = {
      type: schedule.type,
      candidateName: schedule.candidateName || '',
      candidateId: schedule.candidateId || null,
      title: schedule.title || '',
      position: schedule.position,
      startDate: schedule.startDate,
      endDate: schedule.endDate ?? schedule.startDate,
      startTime: startTime || '10:00',
      endTime: endTime || '11:00',
      location: schedule.location,
      priority: schedule.priority,
      interviewer: schedule.interviewer || '',
      stage: schedule.stage || 'scheduled',
      notes: schedule.notes || '',
      isRecurring: false,
      frequency: 'DAILY',
      interval: 1,
      endRecurringDate: null,
      createdBy: null,
    }

    console.log(newSchedule.value)
    showAddModal.value = true
  }

  const viewScheduleDetail = (scheduleId: number) => {
    const schedule = schedules.value.find((s: Schedule) => s.id === scheduleId)
    if (!schedule) return
    const range =
      schedule.endDate && schedule.endDate !== schedule.startDate
        ? `${schedule.startDate} ~ ${schedule.endDate}`
        : schedule.startDate
    alert(
      `일정 상세 정보\n\n제목: ${schedule.candidateName || schedule.title}\n포지션: ${schedule.position}\n기간: ${range}\n시간: ${schedule.time}\n장소: ${schedule.location}`,
    )
  }

  return {
    showAddModal,
    editingScheduleId,
    newSchedule,
    openAddModal,
    openAddModalWithDateRange,
    closeAddModal,
    saveSchedule,
    editSchedule,
    viewScheduleDetail,
  }
}

export const useShare = (schedules: any, teamMembers: any) => {
  const showShareModal = ref(false)
  const selectedMembers = ref<number[]>([])
  const selectedSchedules = ref<number[]>([])
  const shareSettings = ref<ShareSettings>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    permission: 'view',
    sendNotification: true,
    message: '',
  })

  const availableSchedules = computed(() => schedules.value)

  const openShareModal = () => {
    showShareModal.value = true
    selectedMembers.value = []
    selectedSchedules.value = []
  }
  const closeShareModal = () => {
    showShareModal.value = false
    selectedMembers.value = []
    selectedSchedules.value = []
    shareSettings.value = {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      permission: 'view',
      sendNotification: true,
      message: '',
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

  const selectAllMembers = () =>
    (selectedMembers.value = teamMembers.value.map((m: TeamMember) => m.id))
  const clearAllMembers = () => (selectedMembers.value = [])

  const toggleSchedule = (scheduleId: number) => {
    const index = selectedSchedules.value.indexOf(scheduleId)
    if (index > -1) selectedSchedules.value.splice(index, 1)
    else selectedSchedules.value.push(scheduleId)
  }

  const selectAllSchedules = () =>
    (selectedSchedules.value = availableSchedules.value.map((s: Schedule) => s.id))
  const clearAllSchedules = () => (selectedSchedules.value = [])

  const selectSchedulesByDateRange = () => {
    const start = toDate(shareSettings.value.startDate ?? '')
    const end = toDate(shareSettings.value.endDate ?? '')
    if (!start || !end) {
      selectedSchedules.value = []
      return
    }
    selectedSchedules.value = availableSchedules.value
      .filter((s: Schedule) =>
        // ✅ 공유 기간과 일정 기간이 겹치면 포함 (교집합)
        inRange(toDate(s.startDate)!, start, end) ||
        inRange(toDate(s.endDate ?? s.startDate)!, start, end) ||
        inRange(start, toDate(s.startDate), toDate(s.endDate)) ||
        inRange(end, toDate(s.startDate), toDate(s.endDate))
      )
      .map((s: Schedule) => s.id)
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
    alert(
      `${selectedSchedules.value.length}건의 일정이 ${memberNames}에게 공유되었습니다.\n\n권한: ${
        shareSettings.value.permission === 'view' ? '보기 전용' : '편집 가능'
      }`,
    )
    closeShareModal()
  }

  return {
    showShareModal,
    selectedMembers,
    selectedSchedules,
    shareSettings,
    availableSchedules,
    openShareModal,
    closeShareModal,
    shareSchedule,
    toggleMember,
    selectAllMembers,
    clearAllMembers,
    toggleSchedule,
    selectAllSchedules,
    clearAllSchedules,
    selectSchedulesByDateRange,
    getTeamMemberName,
    getScheduleTitle,
    confirmShare,
  }
}
