<template>
  <div class="bg-gray-50 min-h-screen">
    <main class="mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- 공통 헤더 -->
      <JobHeader
        :job="jobHeader"
        :tabs="tabs"
        :activeTab="activeTab"
        :showSalary="true"
        @update:activeTab="activeTab = $event"
        @edit="handleEdit"
        @delete="handleDelete"
      />

      <!-- applicants-list 탭 전용 화면 -->
      <section v-if="activeTab === 'applicants-list'">
        <ApplicantStats
          :total="stats.total"
          :pending="stats.pending"
          :passed="stats.passed"
          :interview="stats.interview"
        />

        <ApplicantFilter
          v-model:search="searchQuery"
          v-model:status="statusFilter"
          :status-options="statusOptions"
          @toggleFilter="toggleFilter"
        />

        <ApplicantList
          :applicants="filteredApplicants"
          @select="viewApplicantDetail"
        />
      </section>

      <!-- TODO: 다른 탭 화면들도 동일 패턴으로 추가 -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import JobHeader from '@/views/recruiter/Job/Components/Common/JobHeader.vue'
import ApplicantStats from '@/views/recruiter/Job/Components/Applicants/ApplicantStats.vue'
import ApplicantFilter from '@/views/recruiter/Job/Components/Applicants/ApplicantFilter.vue'
import ApplicantList from '@/views/recruiter/Job/Components/Applicants/ApplicantList.vue'

type TabId = 'info' | 'applicants' | 'applicants-list' | 'post-schedule' | 'proccess-setting'

interface JobPosting {
  id: number
  title: string
  status: string
  department: string
  employmentType: string
  location: string
  experience: string
  position: string
  techStack: string[]
  salary: string
  salaryNegotiable: string
  postedDate: string
  applicationPeriod: string
  deadline: string
}
interface Applicant {
  id: number
  name: string
  email: string
  appliedAt: string
  status: string
  statusColor: string
  careerYears: number
  education: string
  certificates: number
  skills: string[]
}

/* ---- 더미 데이터 ---- */
const jobPosting = ref<JobPosting>({
  id: 1,
  title: '시니어 프론트엔드 개발자',
  status: '채용중',
  department: '개발팀',
  employmentType: '정규직',
  location: '서울시 강남구 테헤란로 123',
  experience: '경력 5년 이상',
  position: '주임, 대리, 과장',
  techStack: ['Vue.js', 'TypeScript', 'Tailwind CSS', 'Nuxt.js', 'Jest', 'Vite', 'Pinia'],
  salary: '6,000만원 ~ 8,000만원',
  salaryNegotiable: '면접 후 결정',
  postedDate: '2025-10-01',
  applicationPeriod: '2025.10.01 ~ 10.31',
  deadline: '2025-10-31'
})

const jobHeader = computed(() => ({
  title: jobPosting.value.title,
  status: jobPosting.value.status,
  department: jobPosting.value.department,
  employmentType: jobPosting.value.employmentType,
  location: jobPosting.value.location,
  experience: jobPosting.value.experience,
  position: jobPosting.value.position,
  techStack: jobPosting.value.techStack,
  salary: jobPosting.value.salary,
  salaryNegotiable: jobPosting.value.salaryNegotiable
}))

const tabs = ref<{ id: TabId; name: string }[]>([
  { id: 'info', name: '공고 정보' },
  { id: 'applicants', name: '지원자 관리' },
  { id: 'applicants-list', name: '지원자 목록' },
  { id: 'post-schedule', name: '공고 일정' },
  { id: 'proccess-setting', name: '프로세스 설정' }
])
const activeTab = ref<TabId>('applicants-list')

const applicants = ref<Applicant[]>([
  { id: 1, name: '김철수', email: 'kimcs@email.com', appliedAt: '2024-10-10', status: '서류 심사', statusColor: 'blue', careerYears: 3, education: '학사', certificates: 2, skills: ['Vue.js','TypeScript','React','Node.js','Git'] },
  { id: 2, name: '이영희', email: 'leeyh@email.com', appliedAt: '2024-10-12', status: '서류 통과', statusColor: 'green', careerYears: 5, education: '석사', certificates: 3, skills: ['React','TypeScript','Next.js','GraphQL','AWS'] },
  { id: 3, name: '박민수', email: 'parkms@email.com', appliedAt: '2024-10-13', status: '면접 대기', statusColor: 'yellow', careerYears: 2, education: '학사', certificates: 1, skills: ['Vue.js','JavaScript','CSS','HTML','Figma'] },
  { id: 4, name: '정수진', email: 'jeongsj@email.com', appliedAt: '2024-10-14', status: '서류 심사', statusColor: 'blue', careerYears: 4, education: '학사', certificates: 2, skills: ['Angular','TypeScript','RxJS','SCSS','Docker'] },
  { id: 5, name: '최준호', email: 'choijh@email.com', appliedAt: '2024-10-11', status: '서류 통과', statusColor: 'green', careerYears: 6, education: '석사', certificates: 4, skills: ['React','Vue.js','TypeScript','Webpack','Jest'] }
])

/* ---- 필터 상태/옵션 ---- */
const searchQuery = ref('')
const statusFilter = ref('all')
const statusOptions = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '서류 심사' },
  { value: 'passed', label: '서류 통과' },
  { value: 'interview', label: '면접 대기' },
  { value: 'rejected', label: '불합격' }
]
const getStatusLabel = (v: string) =>
  ({ pending: '서류 심사', passed: '서류 통과', interview: '면접 대기', rejected: '불합격' } as const)[v] || v

/* ---- 필터링/통계 ---- */
const filteredApplicants = computed(() =>
  applicants.value.filter(a => {
    const q = searchQuery.value.toLowerCase()
    const okSearch = a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
    const okStatus = statusFilter.value === 'all' || a.status === getStatusLabel(statusFilter.value)
    return okSearch && okStatus
  })
)

const stats = computed(() => ({
  total: applicants.value.length,
  pending: applicants.value.filter(a => a.status === '서류 심사').length,
  passed: applicants.value.filter(a => a.status === '서류 통과').length,
  interview: applicants.value.filter(a => a.status === '면접 대기').length
}))

/* ---- 액션 ---- */
const viewApplicantDetail = (id: number) => {
  console.log('지원자 상세 보기:', id)
  // router.push(`/recruiter/applicant/${id}`)
}
const handleEdit = () => console.log('공고 수정')
const handleDelete = () =>
  confirm('정말로 이 공고를 삭제하시겠습니까?') && console.log('공고 삭제')

const toggleFilter = () => console.log('추가 필터 토글')
</script>
