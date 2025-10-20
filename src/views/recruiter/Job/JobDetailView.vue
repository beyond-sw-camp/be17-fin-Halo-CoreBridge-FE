<template>
  <div class="bg-gray-50 min-h-screen">
    <main class="mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- ✅ 헤더 전체(정보/액션/급여/탭) -->
      <JobHeader
        :job="jobHeader"
        :tabs="tabs"
        :activeTab="activeTab"
        :showSalary="true"
        @update:activeTab="activeTab = $event"
        @edit="handleEdit"
        @delete="handleDelete"
      />

      <!-- ✅ 칸반 보드 (지원자 관리 탭) -->
      <section
        v-if="activeTab === 'applicants'"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <!-- 검색 & 필터 -->
        <JobDetailFilter v-model="searchQuery" @toggleFilter="toggleFilter" />

        <!-- ✅ 단계별 컬럼 컴포넌트로 분리 -->
        <div class="flex gap-4 overflow-x-auto">
          <StageColumn
            v-for="stage in stages"
            :key="stage.id"
            :stage="stage"
            :applicants="getStageApplicants(stage.id)"
            @viewApplicant="viewApplicant"
          />
        </div>
      </section>

      <!-- 필요시 다른 탭들(info / applicants-list / post-schedule / proccess-setting)은 추후 동일 패턴으로 추가 -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 공통 헤더 & 서브 컴포넌트
import JobHeader from './Components/Common/JobHeader.vue'
import JobDetailFilter from './Components/JobDetail/JobDetailFilter.vue'
import StageColumn from './Components/JobDetail/StageColumn.vue'

/** ------------------------
 * 타입들
 * ------------------------ */
type TabId =
  | 'info'
  | 'applicants'
  | 'applicants-list'
  | 'post-schedule'
  | 'proccess-setting'

interface Applicant {
  id: string
  name: string
  email: string
  experience: number
  stageId: string
  appliedDate: string
  interviewDate?: string
  statusText: string
  skills: string[]
}
interface Stage {
  id: string
  name: string
  headerClass: string
  dotClass: string
}
interface JobPosting {
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

/** ------------------------
 * 라우터
 * ------------------------ */
const router = useRouter()

/** ------------------------
 * 탭
 * ------------------------ */
const tabs = ref<{ id: TabId; name: string }[]>([
  { id: 'info', name: '공고 정보' },
  { id: 'applicants', name: '지원자 관리' },
  { id: 'applicants-list', name: '지원자 목록' },
  { id: 'post-schedule', name: '공고 일정' },
  { id: 'proccess-setting', name: '프로세스 설정' }
])
const activeTab = ref<TabId>('applicants')

/** ------------------------
 * 공고 더미 데이터
 * ------------------------ */
const jobPosting = ref<JobPosting>({
  title: '시니어 프론트엔드 개발자',
  status: '채용중',
  department: '개발팀',
  employmentType: '정규직',
  location: '서울시 강남구 테헤란로 123',
  experience: '경력 5년 이상',
  position: '주임, 대리, 과장',
  techStack: ['Vue.js', 'TypeScript', 'Tailwind CSS', 'Nuxt.js', 'Jest', 'Pinia'],
  salary: '6,000만원 ~ 8,000만원',
  salaryNegotiable: '면접 후 결정',
  postedDate: '2025-10-01',
  applicationPeriod: '2025.10.01 ~ 10.31',
  deadline: '2025-10-31'
})

/** ✅ JobHeader에 맞게 매핑 */
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

/** ------------------------
 * 칸반 스테이지 / 지원자 더미 데이터
 * ------------------------ */
const stages = ref<Stage[]>([
  { id: 'applied', name: '지원 완료', headerClass: 'bg-gray-100', dotClass: 'bg-gray-500' },
  { id: 'screening', name: '서류 검토', headerClass: 'bg-blue-100', dotClass: 'bg-blue-500' },
  { id: 'interview1', name: '1차 면접', headerClass: 'bg-purple-100', dotClass: 'bg-purple-500' },
  { id: 'interview2', name: '2차 면접', headerClass: 'bg-orange-100', dotClass: 'bg-orange-500' },
  { id: 'final', name: '최종 합격', headerClass: 'bg-green-100', dotClass: 'bg-green-500' }
])

const applicants = ref<Applicant[]>([
  {
    id: '1',
    name: '김민수',
    email: 'minsu.kim@email.com',
    experience: 5,
    stageId: 'applied',
    appliedDate: '2025-10-10',
    statusText: '1일 전',
    skills: ['Java', 'Spring', 'AWS']
  },
  {
    id: '2',
    name: '이지은',
    email: 'jieun.lee@email.com',
    experience: 3,
    stageId: 'applied',
    appliedDate: '2025-10-11',
    statusText: '2일 전',
    skills: ['Node.js', 'Python', 'Docker']
  },
  {
    id: '3',
    name: '박서준',
    email: 'seojun.park@email.com',
    experience: 7,
    stageId: 'screening',
    appliedDate: '2025-10-12',
    statusText: '검토 중',
    skills: ['Go', 'Kubernetes']
  },
  {
    id: '4',
    name: '최유진',
    email: 'yujin.choi@email.com',
    experience: 4,
    stageId: 'interview1',
    appliedDate: '2025-10-13',
    interviewDate: '2025-10-18',
    statusText: '면접 예정',
    skills: ['C++', 'Redis']
  },
  {
    id: '5',
    name: '정현우',
    email: 'hyunwoo.jung@email.com',
    experience: 6,
    stageId: 'final',
    appliedDate: '2025-10-10',
    interviewDate: '2025-10-17',
    statusText: '최종 합격',
    skills: ['Scala', 'Kafka']
  }
])

/** ------------------------
 * 검색 필터링
 * ------------------------ */
const searchQuery = ref('')
const filteredApplicants = computed(() => {
  if (!searchQuery.value) return applicants.value
  const q = searchQuery.value.toLowerCase()
  return applicants.value.filter(
    a => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
  )
})
const getStageApplicants = (stageId: string) =>
  filteredApplicants.value.filter(a => a.stageId === stageId)

/** ------------------------
 * 이벤트
 * ------------------------ */
const viewApplicant = (id: string) => router.push(`/recruiter/applicants/${id}`)
const toggleFilter = () => console.log('필터 토글')
const handleEdit = () => console.log('공고 수정')
const handleDelete = () =>
  confirm('정말로 이 공고를 삭제하시겠습니까?') && console.log('공고 삭제')
</script>
