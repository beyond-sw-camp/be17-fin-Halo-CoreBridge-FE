<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Main Content -->  
    <main class="mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
          <section>
            <div class="flex items-start gap-6 mb-6">
              <div
                class="w-20 h-20 bg-slate-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                채용
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h2 class="text-2xl font-bold text-slate-800">{{ jobPosting.title }}</h2>
                  <span :class="getStatusClass(jobPosting.status)"
                        class="px-3 py-1 text-sm rounded-full font-medium">
                                        {{ jobPosting.status }}
                                    </span>
                </div>
                <div class="space-y-2 text-gray-600 mb-4">
                  <div class="flex items-center gap-2">
                    <Building2 :size="20" />
                    {{ jobPosting.department }} • {{ jobPosting.employmentType }}
                  </div>
                  <div class="flex items-center gap-2">
                    <MapPin :size="20" />
                    {{ jobPosting.location }}
                  </div>
                  <div class="flex items-center gap-2">
                    <Briefcase :size="20" />
                    {{ jobPosting.experience }} • {{ jobPosting.position }}
                  </div>
                </div>
                <div class="flex gap-2 flex-wrap">
                                    <span v-for="(tech, index) in jobPosting.techStack.slice(0, 3)" :key="index"
                                          class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                        {{ tech }}
                                    </span>
                  <span v-if="jobPosting.techStack.length > 3"
                        class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                        +{{ jobPosting.techStack.length - 3 }}
                                    </span>
                </div>
              </div>
            </div>


          </section>

          <!-- Actions -->
          <section class="">
            <div class="space-y-3">
              <button @click="handleEdit"
                      class="w-full px-4 py-3 bg-white text-slate-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium hover:cursor-pointer">
                공고 수정
              </button>

              <button @click="handleDelete"
                      class="w-full px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition text-sm font-medium hover:cursor-pointer">
                공고 삭제
              </button>
            </div>
          </section>
        </div>

        <!-- Salary Highlight -->
        <div class="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <DollarSign :size="24" class="text-slate-600" />
              <div>
                <div class="text-sm text-gray-600">연봉</div>
                <div class="text-xl font-bold text-slate-800">{{ jobPosting.salary }}</div>
              </div>
            </div>
            <span class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                            {{ jobPosting.salaryNegotiable }}
                        </span>
          </div>
        </div>
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200">
          <nav class="flex gap-8">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                            'pb-4 px-1 border-b-2 font-medium transition-colors',
                            activeTab === tab.id
                                ? 'border-slate-600 text-slate-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        ]">
              {{ tab.name }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Applicant List Content (when applicants-list tab is active) -->
      <div v-if="activeTab === 'applicants-list'">
        <!-- Stats Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-50 rounded-lg">
                <Users :size="24" class="text-blue-600" />
              </div>
              <div>
                <p class="text-sm text-gray-600">전체 지원자</p>
                <p class="text-2xl font-bold text-slate-700">{{ stats.total }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-yellow-50 rounded-lg">
                <FileText :size="24" class="text-yellow-600" />
              </div>
              <div>
                <p class="text-sm text-gray-600">서류 심사</p>
                <p class="text-2xl font-bold text-slate-700">{{ stats.pending }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-50 rounded-lg">
                <CheckCircle :size="24" class="text-green-600" />
              </div>
              <div>
                <p class="text-sm text-gray-600">서류 통과</p>
                <p class="text-2xl font-bold text-slate-700">{{ stats.passed }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-purple-50 rounded-lg">
                <Clock :size="24" class="text-purple-600" />
              </div>
              <div>
                <p class="text-sm text-gray-600">면접 대기</p>
                <p class="text-2xl font-bold text-slate-700">{{ stats.interview }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 relative">
              <Search :size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" v-model="searchQuery" placeholder="이름, 이메일로 검색..."
                     class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent" />
            </div>
            <div class="flex gap-2">
              <div class="relative">
                <Filter :size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select v-model="statusFilter"
                        class="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none bg-white cursor-pointer">
                  <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Applicants List -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-slate-600 mb-4">
            지원자 목록 ({{ filteredApplicants.length }})
          </h2>
          <div v-if="filteredApplicants.length > 0" class="space-y-4">
            <ApplicantListCard v-for="applicant in filteredApplicants" :key="applicant.id" :applicant="applicant"
                               @click="viewApplicantDetail(applicant.id)" />
          </div>
          <div v-else class="text-center py-12">
            <p class="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ArrowLeft, Users, FileText, CheckCircle, Clock, Search, Filter } from 'lucide-vue-next';
import ApplicantListCard from '@/components/applicant/ApplicantListCard.vue';

import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  User,
  Mail
} from 'lucide-vue-next'

interface JobPosting {
  id: number;
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
  description: string
  responsibilities: string[]
  requirements: string[]
  preferred: string[]
  benefits: string[]
  additionalInfo: string
  postedDate: string
  applicationPeriod: string
  deadline: string
  headcount: number
  applicantCount: number
  workingHours: string
  workingDays: string
  contact: {
    name: string
    email: string
  }
}
interface Applicant {
  id: number;
  name: string;
  email: string;
  appliedAt: string;
  status: string;
  statusColor: string;
  careerYears: number;
  education: string;
  certificates: number;
  skills: string[];
}

interface RecruitmentStep {
  name: string
  color: string
}

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
  description: `우리 팀에서 함께 성장할 시니어 프론트엔드 개발자를 찾습니다.
Vue.js와 TypeScript를 활용하여 혁신적인 웹 애플리케이션을 개발하고,
팀원들과 협업하여 최고의 사용자 경험을 만들어갈 분을 기다립니다.`,
  responsibilities: [
    'Vue.js 기반의 웹 애플리케이션 개발 및 유지보수',
    'TypeScript를 활용한 타입 안정성 확보',
    '컴포넌트 기반 아키텍처 설계 및 구현',
    'RESTful API 연동 및 상태 관리',
    'UI/UX 개선 및 성능 최적화'
  ],
  requirements: [
    'Vue.js (Vue 2 또는 Vue 3) 실무 경험 5년 이상',
    'TypeScript 활용 경험',
    'HTML5, CSS3, JavaScript(ES6+) 능숙자',
    'Git을 활용한 협업 경험',
    '반응형 웹 디자인 구현 경험'
  ],
  preferred: [
    'Tailwind CSS 사용 경험',
    'Nuxt.js 프레임워크 경험',
    '테스트 코드 작성 경험 (Jest, Vitest 등)',
    'CI/CD 파이프라인 구축 경험',
    '오픈소스 기여 경험'
  ],
  benefits: [
    '유연 근무제 (코어타임 11:00-16:00)',
    '재택근무 가능 (주 2회)',
    '최신 개발 장비 지원 (맥북 프로 등)',
    '교육비 지원 (연 200만원)',
    '도서 구매비 무제한',
    '점심 식대 지원',
    '건강검진 지원'
  ],
  additionalInfo: `• 제출하신 서류는 채용 목적 외에는 사용되지 않습니다.
- 입사 지원 서류에 허위 사실이 발견될 경우, 채용이 취소될 수 있습니다.
- 국가보훈대상자 및 장애인은 관련 법규에 따라 우대합니다.`,
  postedDate: '2025년 10월 1일',
  applicationPeriod: '2025.10.01 ~ 10.31',
  deadline: '2025년 10월 31일',
  headcount: 2,
  applicantCount: 23,
  workingHours: '09:00 - 18:00',
  workingDays: '주 5일',
  contact: {
    name: '홍길동',
    email: 'hr@company.com'
  }
})

const recruitmentProcess = ref<RecruitmentStep[]>([
  { name: '접수', color: 'bg-gray-400' },
  { name: '과제 평가', color: 'bg-orange-500' },
  { name: '직무 인터뷰', color: 'bg-yellow-500' },
  { name: '컬쳐핏 인터뷰', color: 'bg-green-500' },
  { name: '처우 협의', color: 'bg-cyan-500' },
  { name: '최종합격', color: 'bg-blue-500' }
])

// Applicant List Data (from ApplicantListView)
const applicants = ref<Applicant[]>([
  {
    id: 1,
    name: '김철수',
    email: 'kimcs@email.com',
    appliedAt: '2024-10-10',
    status: '서류 심사',
    statusColor: 'blue',
    careerYears: 3,
    education: '학사',
    certificates: 2,
    skills: ['Vue.js', 'TypeScript', 'React', 'Node.js', 'Git']
  },
  {
    id: 2,
    name: '이영희',
    email: 'leeyh@email.com',
    appliedAt: '2024-10-12',
    status: '서류 통과',
    statusColor: 'green',
    careerYears: 5,
    education: '석사',
    certificates: 3,
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'AWS']
  },
  {
    id: 3,
    name: '박민수',
    email: 'parkms@email.com',
    appliedAt: '2024-10-13',
    status: '면접 대기',
    statusColor: 'yellow',
    careerYears: 2,
    education: '학사',
    certificates: 1,
    skills: ['Vue.js', 'JavaScript', 'CSS', 'HTML', 'Figma']
  },
  {
    id: 4,
    name: '정수진',
    email: 'jeongsj@email.com',
    appliedAt: '2024-10-14',
    status: '서류 심사',
    statusColor: 'blue',
    careerYears: 4,
    education: '학사',
    certificates: 2,
    skills: ['Angular', 'TypeScript', 'RxJS', 'SCSS', 'Docker']
  },
  {
    id: 5,
    name: '최준호',
    email: 'choijh@email.com',
    appliedAt: '2024-10-11',
    status: '서류 통과',
    statusColor: 'green',
    careerYears: 6,
    education: '석사',
    certificates: 4,
    skills: ['React', 'Vue.js', 'TypeScript', 'Webpack', 'Jest']
  }
]);

const searchQuery = ref('');
const statusFilter = ref('all');

const statusOptions = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '서류 심사' },
  { value: 'passed', label: '서류 통과' },
  { value: 'interview', label: '면접 대기' },
  { value: 'rejected', label: '불합격' }
];

// Computed
const filteredApplicants = computed(() => {
  return applicants.value.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = statusFilter.value === 'all' || applicant.status === getStatusLabel(statusFilter.value);
    return matchesSearch && matchesStatus;
  });
});

const stats = computed(() => ({
  total: applicants.value.length,
  pending: applicants.value.filter(a => a.status === '서류 심사').length,
  passed: applicants.value.filter(a => a.status === '서류 통과').length,
  interview: applicants.value.filter(a => a.status === '면접 대기').length
}));

// Methods
const getStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'pending': '서류 심사',
    'passed': '서류 통과',
    'interview': '면접 대기',
    'rejected': '불합격'
  };
  return statusMap[status] || '';
};

const viewApplicantDetail = (id: number) => {
  console.log('지원자 상세 보기:', id);
  // router.push(`/recruiter/applicant/${id}`)
};

const getStatusClass = (status: string): string => {
  if (status === '채용중') {
    return 'bg-green-100 text-green-700'
  }
  return 'bg-gray-100 text-gray-700'
}

const handleGoBack = (): void => {
  console.log('뒤로 가기')
}

const handleEdit = (): void => {
  console.log('공고 수정')
}

const handleDuplicate = (): void => {
  console.log('공고 복제')
}

const handleManageApplicants = (): void => {
  console.log('지원자 관리')
}

const handleViewApplicants = (): void => {
  console.log('지원자 목록 보기')
}

const handleDelete = (): void => {
  if (confirm('정말로 이 공고를 삭제하시겠습니까?')) {
    console.log('공고 삭제')
  }
}

const activeTab = ref('info');

const tabs = ref([
  { id: 'info', name: '공고 정보' },
  { id: 'applicants', name: '지원자 관리' },
  { id: 'applicants-list', name: '지원자 목록' },
  { id: 'post-schedule', name: '공고 일정' },
  { id: 'proccess-setting', name: '프로세스 설정' },
]);

onMounted(() => {
  console.log('지원자 리스트 로드');
});
</script>
