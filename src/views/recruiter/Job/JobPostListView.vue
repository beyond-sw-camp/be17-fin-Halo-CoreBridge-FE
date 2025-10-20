<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import JobListHeader from './Components/JobList/JobListHeader.vue'
import JobListStats from './Components/JobList/JobListStats.vue'
import JobListFilters from './Components/JobList/JobListFilters.vue'
import JobListTable from './Components/JobList/JobListTable.vue'
import JobListPagination from './Components/JobList/JobListPagination.vue'

interface Job {
  id: number
  title: string
  department: string
  experience: string
  type: string
  status: 'recruiting' | 'screening' | 'interviewing' | 'closed' | 'paused'
  deadline: string
  daysLeft: number
  applicants: number
  progress: number
}

interface Stats {
  total: number
  active: number
  totalApplicants: number
  hired: number
}

const router = useRouter()
const jobs = ref<Job[]>([
    {
    id: 1,
    title: '시니어 백엔드 개발자',
    department: '개발팀',
    experience: '5년 이상',
    type: '정규직',
    status: 'recruiting',
    deadline: '2025-11-15',
    daysLeft: 27,
    applicants: 42,
    progress: 60,
    screening: 42,
    interview1: 12,
    interview2: 5,
    final: 2
  },
  {
    id: 2,
    title: '프론트엔드 개발자 (Vue.js)',
    department: '개발팀',
    experience: '3-5년',
    type: '정규직',
    status: 'screening',
    deadline: '2025-11-10',
    daysLeft: 22,
    applicants: 31,
    progress: 45,
    screening: 31,
    interview1: 9,
    interview2: 3,
    final: 1
  }
])
const stats = ref<Stats>({ total: 24, active: 12, totalApplicants: 400, hired: 28 })

// 필터 / 검색
const searchQuery = ref('')
const selectedStatus = ref('') 
const currentPage = ref(1)
const itemsPerPage = 10

// computed
const filteredJobs = computed(() => {
  let result = jobs.value
  if (searchQuery.value)
    result = result.filter(j => j.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
  if (selectedStatus.value)
    result = result.filter(j => j.status === selectedStatus.value)
  return result
})

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredJobs.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / itemsPerPage))

// methods
const openJobForm = () => router.push({ name: 'jobPostingCreate' })
const viewDetail = (id: number) => router.push({ name: 'jobDetail', params: { id } })
const editJob = (id: number) => alert(`공고 ${id} 수정`)
const shareJob = (id: number) => alert(`공고 ${id} 공유`)
const viewApplicants = (id: number) => {alert(`공고 ${id} 보기`)}
const handlePageChange = (page: number) => (currentPage.value = page)
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <main class="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <JobListHeader @open-job-form="openJobForm" />
      <JobListStats :stats="stats" />
      <JobListFilters
        v-model:searchQuery="searchQuery"
        v-model:selectedStatus="selectedStatus"
      />
      <JobListTable
        :jobs="paginatedJobs"
        @view-detail="viewDetail"
        @edit-job="editJob"
        @share-job="shareJob"
        @view-applicants="viewApplicants"
      />
      <JobListPagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-change="handlePageChange"
      />
    </main>
  </div>
</template>
