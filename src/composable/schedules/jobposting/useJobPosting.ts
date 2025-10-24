import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Job, CalendarDate, Filters, ShareSettings, TeamMember } from '../../../types/schedules/jobposting/jobposting'

export const useJobCalendar = (jobs: any, filters: any, searchQuery: any) => {
  const currentDate = ref(new Date())
  const selectedDate = ref(new Date())

  const currentYearMonth = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth() + 1
    return `${year}년 ${month}월`
  })

  const filteredJobs = computed(() => {
    let result = [...jobs.value]

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter((job: Job) => 
        job.title.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query)
      )
    }

    if (filters.value.position) result = result.filter((job: Job) => job.position === filters.value.position)
    if (filters.value.status) result = result.filter((job: Job) => job.status === filters.value.status)
    if (filters.value.department) result = result.filter((job: Job) => job.department === filters.value.department)
    if (filters.value.experience) result = result.filter((job: Job) => job.experience === filters.value.experience)
    if (filters.value.type) result = result.filter((job: Job) => job.type === filters.value.type)

    return result
  })

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
      dates.push({ date: null, isToday: false, hasJobs: false, jobs: [] })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const postedJobs = filteredJobs.value.filter((j: Job) => j.postedDate === currentDateStr)
      const deadlineJobs = filteredJobs.value.filter((j: Job) => j.deadline === currentDateStr)
      const dayJobs = [...postedJobs, ...deadlineJobs]

      dates.push({
        date: day,
        isToday: today.getDate() === day && today.getMonth() === month && today.getFullYear() === year,
        hasJobs: dayJobs.length > 0,
        jobs: dayJobs
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

  const selectedDateJobs = computed(() => {
    const dateStr = `${selectedDate.value.getFullYear()}-${String(selectedDate.value.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.value.getDate()).padStart(2, '0')}`
    return filteredJobs.value.filter((j: Job) => j.deadline === dateStr || j.postedDate === dateStr)
  })

  return {
    currentDate, selectedDate, currentYearMonth, calendarDates, selectedDateLabel,
    selectedDateJobs, filteredJobs,
    previousMonth: () => currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1),
    nextMonth: () => currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1),
    goToToday: () => { currentDate.value = new Date(); selectedDate.value = new Date() }
  }
}

export const useDragSelect = (calendarDates: any) => {
  const isDragging = ref(false)
  const dragStartIndex = ref<number | null>(null)
  const dragEndIndex = ref<number | null>(null)
  const selectedDateRange = ref<{ start: string | null; end: string | null }>({ start: null, end: null })

  const startDrag = (index: number, date: CalendarDate, currentDate: Date) => {
    if (!date.date) return
    isDragging.value = true
    dragStartIndex.value = index
    dragEndIndex.value = index
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(date.date).padStart(2, '0')}`
    selectedDateRange.value.start = dateStr
    selectedDateRange.value.end = dateStr
  }

  const updateDrag = (index: number, currentDate: Date) => {
    if (!isDragging.value) return
    dragEndIndex.value = index

    if (dragStartIndex.value !== null && dragEndIndex.value !== null) {
      const startIdx = Math.min(dragStartIndex.value, dragEndIndex.value)
      const endIdx = Math.max(dragStartIndex.value, dragEndIndex.value)
      const startDate = calendarDates.value[startIdx]
      const endDate = calendarDates.value[endIdx]

      if (startDate.date && endDate.date) {
        const startDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.date).padStart(2, '0')}`
        const endDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.date).padStart(2, '0')}`
        selectedDateRange.value.start = startDateStr
        selectedDateRange.value.end = endDateStr
      }
    }
  }

  const endDrag = (onConfirm?: () => void) => {
    if (!isDragging.value) return
    const wasDragging = dragStartIndex.value !== dragEndIndex.value

    if (wasDragging && selectedDateRange.value.start && selectedDateRange.value.end) {
      setTimeout(() => {
        onConfirm?.()
        selectedDateRange.value = { start: null, end: null }
      }, 100)
    }

    isDragging.value = false
    dragStartIndex.value = null
    dragEndIndex.value = null
  }

  const handleGlobalMouseUp = () => { if (isDragging.value) endDrag() }

  const isDateInDragRange = (index: number) => {
    if (!isDragging.value || dragStartIndex.value === null || dragEndIndex.value === null) return false
    const start = Math.min(dragStartIndex.value, dragEndIndex.value)
    const end = Math.max(dragStartIndex.value, dragEndIndex.value)
    return index >= start && index <= end
  }

  onMounted(() => document.addEventListener('mouseup', handleGlobalMouseUp))
  onUnmounted(() => document.removeEventListener('mouseup', handleGlobalMouseUp))

  return { isDragging, dragStartIndex, dragEndIndex, selectedDateRange, startDrag, updateDrag, endDrag, isDateInDragRange }
}

export const useJobShare = (jobs: any, teamMembers: any) => {
  const showShareModal = ref(false)
  const selectedMembers = ref<number[]>([])
  const selectedJobs = ref<number[]>([])
  const selectedJobId = ref<number | null>(null)
  const shareSettings = ref<ShareSettings>({ permission: 'view', sendNotification: true, message: '' })

  const openShareModal = () => { showShareModal.value = true; selectedJobId.value = null; selectedMembers.value = []; selectedJobs.value = [] }
  const closeShareModal = () => {
    showShareModal.value = false; selectedMembers.value = []; selectedJobs.value = []; selectedJobId.value = null
    shareSettings.value = { permission: 'view', sendNotification: true, message: '' }
  }

  const shareJob = (jobId: number) => {
    selectedJobId.value = jobId; selectedJobs.value = [jobId]
    const job = jobs.value.find((j: Job) => j.id === jobId)
    if (job?.sharedWith) selectedMembers.value = [...job.sharedWith]
    showShareModal.value = true
  }

  const toggleMember = (memberId: number) => {
    const index = selectedMembers.value.indexOf(memberId)
    if (index > -1) selectedMembers.value.splice(index, 1)
    else selectedMembers.value.push(memberId)
  }

  const toggleJob = (jobId: number) => {
    const index = selectedJobs.value.indexOf(jobId)
    if (index > -1) selectedJobs.value.splice(index, 1)
    else selectedJobs.value.push(jobId)
  }

  const selectAllMembers = () => { selectedMembers.value = teamMembers.value.map((m: TeamMember) => m.id) }
  const clearAllMembers = () => { selectedMembers.value = [] }
  const selectAllJobs = (filteredJobs: any) => { selectedJobs.value = filteredJobs.value.map((j: Job) => j.id) }
  const clearAllJobs = () => { selectedJobs.value = [] }
  const selectUrgentJobs = (filteredJobs: any) => { selectedJobs.value = filteredJobs.value.filter((j: Job) => j.daysLeft <= 7).map((j: Job) => j.id) }

  const getTeamMemberName = (memberId: number) => {
    const member = teamMembers.value.find((m: TeamMember) => m.id === memberId)
    return member ? member.name : ''
  }

  const getJobTitle = (jobId: number) => {
    const job = jobs.value.find((j: Job) => j.id === jobId)
    return job ? job.title : ''
  }

  const confirmShare = () => {
    if (selectedMembers.value.length === 0 || selectedJobs.value.length === 0) return
    selectedJobs.value.forEach(jobId => {
      const job = jobs.value.find((j: Job) => j.id === jobId)
      if (job) job.sharedWith = [...selectedMembers.value]
    })
    const memberNames = selectedMembers.value.map(id => getTeamMemberName(id)).join(', ')
    alert(`${selectedJobs.value.length}건의 공고가 ${memberNames}에게 공유되었습니다.\n\n권한: ${shareSettings.value.permission === 'view' ? '보기 전용' : '편집 가능'}`)
    closeShareModal()
  }

  return {
    showShareModal, selectedMembers, selectedJobs, selectedJobId, shareSettings,
    openShareModal, closeShareModal, shareJob, toggleMember, toggleJob,
    selectAllMembers, clearAllMembers, selectAllJobs, clearAllJobs, selectUrgentJobs,
    getTeamMemberName, getJobTitle, confirmShare
  }
}