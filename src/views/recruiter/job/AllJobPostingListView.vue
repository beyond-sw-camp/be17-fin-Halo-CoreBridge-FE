<template>
    <div class="bg-gray-50 min-h-screen">

        <!-- Main Content -->
        <main class=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Page Header -->
            <div class="mb-8">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h2 class="text-3xl font-bold text-slate-600 mb-2">채용 공고</h2>
                        <p class="text-gray-600">진행 중인 채용 공고를 관리하세요</p>
                    </div>
                    <button @click="openJobForm"
                        class="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium hover:cursor-pointer">
                        + 새 채용 공고
                    </button>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-gray-600 text-sm font-medium">전체 공고</span>
                        <span class="text-2xl">📋</span>
                    </div>
                    <div class="text-3xl font-bold text-slate-600">{{ stats.total }}</div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-gray-600 text-sm font-medium">모집 중</span>
                        <span class="text-2xl">✅</span>
                    </div>
                    <div class="text-3xl font-bold text-green-600">{{ stats.active }}</div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-gray-600 text-sm font-medium">전체 지원자</span>
                        <span class="text-2xl">👥</span>
                    </div>
                    <div class="text-3xl font-bold text-blue-600">{{ stats.totalApplicants }}</div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-gray-600 text-sm font-medium">최종 합격</span>
                        <span class="text-2xl">🎉</span>
                    </div>
                    <div class="text-3xl font-bold text-purple-600">{{ stats.hired }}</div>
                </div>
            </div>

            <!-- Job Listings Table -->
            <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6 flex flex-row">
                <!-- Search Bar -->
                <div class="flex-1 mr-4">
                    <div class="relative">
                        <input v-model="searchQuery" type="text" placeholder="공고명, 포지션, 부서, 키워드로 검색..."
                            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            @input="handleSearch">
                        <Search class="w-5 h-5 text-gray-400 absolute left-3 top-4" />
                    </div>
                </div>

                <!-- Filter Row -->
                <div class="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                    <!-- Status Filter -->
                    <div class="flex-1">
                        <select v-model="selectedStatus" @change="handleFilterChange"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900">
                            <option value="">전체 상태</option>
                            <option value="recruiting">모집 중</option>
                            <option value="paused">모집 중단</option>
                            <option value="closed">모집 마감</option>
                            <option value="draft">임시저장</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="mt-6">
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-xl font-bold text-slate-600 mb-4">진행중인 채용 공고</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b-2 border-gray-200">
                                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">공고명</th>
                                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">부서</th>
                                    <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">상태</th>
                                    <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">마감일</th>
                                    <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">지원자</th>
                                    <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">진행률</th>
                                    <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">단계별 현황</th>
                                    <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">액션</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="job in activeJobs" :key="job.id"
                                    class="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                                    @click="viewJobDetail(job.id)">
                                    <!-- 공고명 -->
                                    <td class="py-3 px-4">
                                        <div class="flex items-center gap-2">
                                            <Share2 v-if="job.sharedWith && job.sharedWith.length > 0"
                                                class="w-4 h-4 text-blue-600 flex-shrink-0"
                                                :title="`${job.sharedWith.length}명과 공유중`" />
                                            <div class="min-w-0">
                                                <p class="font-semibold text-gray-900 truncate">{{ job.title }}</p>
                                                <p class="text-xs text-gray-500">{{ job.experience }} · {{ job.type }}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- 부서 -->
                                    <td class="py-3 px-4">
                                        <div class="flex items-center gap-1 text-sm text-gray-600">
                                            <Briefcase class="w-3 h-3" />
                                            {{ job.department }}
                                        </div>
                                    </td>

                                    <!-- 상태 -->
                                    <td class="py-3 px-4 text-center">
                                        <span :class="[
                                            'inline-block px-2 py-1 text-xs font-semibold rounded',
                                            getStatusClass(job.status)
                                        ]">
                                            {{ getStatusLabel(job.status) }}
                                        </span>
                                    </td>

                                    <!-- 마감일 -->
                                    <td class="py-3 px-4 text-center">
                                        <div class="text-sm">
                                            <p class="font-medium">{{ job.deadline }}</p>
                                            <p
                                                :class="['text-xs', job.daysLeft <= 3 ? 'text-red-600 font-bold' : 'text-gray-500']">
                                                D-{{ job.daysLeft }}
                                            </p>
                                        </div>
                                    </td>

                                    <!-- 지원자 -->
                                    <td class="py-3 px-4 text-center">
                                        <div
                                            class="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                                            <Users class="w-4 h-4 text-gray-500" />
                                            {{ job.applicants }}명
                                        </div>
                                    </td>

                                    <!-- 진행률 -->
                                    <td class="py-3 px-4">
                                        <div class="flex items-center gap-2">
                                            <div class="flex-1 bg-gray-200 rounded-full h-2">
                                                <div :class="['h-2 rounded-full', getProgressColor(job.progress)]"
                                                    :style="{ width: job.progress + '%' }"></div>
                                            </div>
                                            <span class="text-xs font-semibold text-gray-600 w-10 text-right">{{
                                                job.progress }}%</span>
                                        </div>
                                    </td>

                                    <!-- 단계별 현황 -->
                                    <td class="py-3 px-4">
                                        <div class="flex items-center justify-center gap-2 text-xs">
                                            <div class="text-center">
                                                <p class="text-gray-500">서류</p>
                                                <p class="font-bold text-gray-700">{{ job.screening }}</p>
                                            </div>
                                            <span class="text-gray-300">→</span>
                                            <div class="text-center">
                                                <p class="text-gray-500">1차</p>
                                                <p class="font-bold text-gray-700">{{ job.interview1 }}</p>
                                            </div>
                                            <span class="text-gray-300">→</span>
                                            <div class="text-center">
                                                <p class="text-gray-500">2차</p>
                                                <p class="font-bold text-gray-700">{{ job.interview2 }}</p>
                                            </div>
                                            <span class="text-gray-300">→</span>
                                            <div class="text-center">
                                                <p class="text-gray-500">최종</p>
                                                <p class="font-bold text-gray-700">{{ job.final }}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- 액션 -->
                                    <td class="py-3 px-4">
                                        <div class="flex items-center justify-center gap-1">
                                            <button @click.stop="editJob(job.id)"
                                                class="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition"
                                                title="수정">
                                                <Edit class="w-4 h-4" />
                                            </button>
                                            <button @click.stop="shareJob(job.id)"
                                                class="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition"
                                                title="공유">
                                                <Share2 class="w-4 h-4" />
                                            </button>
                                            <button @click.stop="viewApplicants(job.id)"
                                                class="p-1.5 text-green-600 hover:bg-green-100 rounded transition"
                                                title="지원자 보기">
                                                <Users class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="mt-6 flex items-center justify-between">
                <div class="text-sm text-gray-600">
                    총 {{ totalJobs }}개 중 {{ paginationStart }}-{{ paginationEnd }}개 표시
                </div>
                <div class="flex gap-2">
                    <button @click="previousPage" :disabled="currentPage === 1"
                        class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        이전
                    </button>
                    <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
                        'px-4 py-2 rounded-lg text-sm font-medium',
                        currentPage === page
                            ? 'bg-slate-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    ]">
                        {{ page }}
                    </button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        다음
                    </button>
                </div>
            </div>


        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'


type JobStatus = 'recruiting' | 'screening' | 'interviewing' | 'closed' | 'paused'
import {
    Briefcase, Edit, Share2, Users, Search,
} from 'lucide-vue-next'

// Types
interface Job {
    id: number
    title: string
    department: string
    experience: string
    type: string
    status: JobStatus
    postedDate: string
    deadline: string
    daysLeft: number
    applicants: number
    progress: number
    screening: number
    interview1: number
    interview2: number
    final: number
    isUrgent?: boolean
    sharedWith?: number[]
}

interface Stats {
    total: number
    active: number
    totalApplicants: number
    hired: number
}
// Router
const router = useRouter()

// State
const searchQuery = ref('')
const statusFilter = ref('')
const departmentFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

// Mock Data
const jobs = ref<Job[]>([
    {
        id: 1,
        title: '시니어 프론트엔드 개발자',
        department: '개발팀',
        experience: '5년 이상',
        type: '정규직',
        status: 'recruiting',
        postedDate: '2025-10-01',
        deadline: '2025-10-31',
        daysLeft: 16,
        applicants: 45,
        progress: 30,
        screening: 45,
        interview1: 12,
        interview2: 5,
        final: 2,
        sharedWith: [1, 2, 3]
    },
    {
        id: 2,
        title: '백엔드 개발자',
        department: '개발팀',
        experience: '3-5년',
        type: '정규직',
        status: 'screening',
        postedDate: '2025-09-25',
        deadline: '2025-10-25',
        daysLeft: 10,
        applicants: 38,
        progress: 45,
        screening: 38,
        interview1: 8,
        interview2: 3,
        final: 1,
        sharedWith: [1, 2]
    },
    {
        id: 3,
        title: 'UX/UI 디자이너',
        department: '디자인팀',
        experience: '3-5년',
        type: '정규직',
        status: 'interviewing',
        postedDate: '2025-09-20',
        deadline: '2025-10-20',
        daysLeft: 5,
        applicants: 52,
        progress: 65,
        screening: 52,
        interview1: 15,
        interview2: 8,
        final: 3,
        isUrgent: true,
        sharedWith: [1, 4, 3]
    },
    {
        id: 4,
        title: '프로덕트 매니저',
        department: '프로덕트팀',
        experience: '5년 이상',
        type: '정규직',
        status: 'interviewing',
        postedDate: '2025-09-15',
        deadline: '2025-10-18',
        daysLeft: 3,
        applicants: 28,
        progress: 75,
        screening: 28,
        interview1: 10,
        interview2: 6,
        final: 4,
        isUrgent: true,
        sharedWith: [1, 7]
    },
    {
        id: 5,
        title: '마케팅 매니저',
        department: '마케팅팀',
        experience: '3-5년',
        type: '정규직',
        status: 'recruiting',
        postedDate: '2025-10-05',
        deadline: '2025-11-05',
        daysLeft: 21,
        applicants: 31,
        progress: 25,
        screening: 31,
        interview1: 5,
        interview2: 0,
        final: 0
    },
    {
        id: 6,
        title: '풀스택 개발자',
        department: '개발팀',
        experience: '3-5년',
        type: '정규직',
        status: 'recruiting',
        postedDate: '2025-10-08',
        deadline: '2025-11-08',
        daysLeft: 24,
        applicants: 22,
        progress: 20,
        screening: 22,
        interview1: 3,
        interview2: 0,
        final: 0
    },
    {
        id: 7,
        title: '데이터 분석가',
        department: '프로덕트팀',
        experience: '1-3년',
        type: '정규직',
        status: 'screening',
        postedDate: '2025-09-28',
        deadline: '2025-10-28',
        daysLeft: 13,
        applicants: 35,
        progress: 40,
        screening: 35,
        interview1: 7,
        interview2: 2,
        final: 0
    },
    {
        id: 8,
        title: '개발 인턴',
        department: '개발팀',
        experience: '신입',
        type: '인턴',
        status: 'recruiting',
        postedDate: '2025-10-10',
        deadline: '2025-11-10',
        daysLeft: 26,
        applicants: 18,
        progress: 15,
        screening: 18,
        interview1: 0,
        interview2: 0,
        final: 0
    },
    {
        id: 9,
        title: '영업 매니저',
        department: '영업팀',
        experience: '5년 이상',
        type: '정규직',
        status: 'interviewing',
        postedDate: '2025-09-22',
        deadline: '2025-10-22',
        daysLeft: 7,
        applicants: 26,
        progress: 60,
        screening: 26,
        interview1: 9,
        interview2: 5,
        final: 2
    },
    {
        id: 10,
        title: '인사 담당자',
        department: '인사팀',
        experience: '3-5년',
        type: '정규직',
        status: 'screening',
        postedDate: '2025-10-03',
        deadline: '2025-11-03',
        daysLeft: 19,
        applicants: 29,
        progress: 35,
        screening: 29,
        interview1: 6,
        interview2: 1,
        final: 0
    },
    {
        id: 11,
        title: 'DevOps 엔지니어',
        department: '개발팀',
        experience: '5년 이상',
        type: '정규직',
        status: 'recruiting',
        postedDate: '2025-10-12',
        deadline: '2025-11-12',
        daysLeft: 28,
        applicants: 15,
        progress: 10,
        screening: 15,
        interview1: 0,
        interview2: 0,
        final: 0
    },
    {
        id: 12,
        title: '콘텐츠 마케터',
        department: '마케팅팀',
        experience: '1-3년',
        type: '계약직',
        status: 'recruiting',
        postedDate: '2025-10-14',
        deadline: '2025-11-14',
        daysLeft: 30,
        applicants: 12,
        progress: 5,
        screening: 12,
        interview1: 0,
        interview2: 0,
        final: 0
    }
])

const stats = ref<Stats>({
    total: 24,
    active: 12,
    totalApplicants: 387,
    hired: 28
})

// Computed
const filteredJobs = computed(() => {
    let result = jobs.value

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(job =>
            job.title.toLowerCase().includes(query) ||
            job.department.toLowerCase().includes(query)
        )
    }

    // Status filter
    if (statusFilter.value) {
        result = result.filter(job => job.status === statusFilter.value)
    }

    // Department filter
    if (departmentFilter.value) {
        result = result.filter(job =>
            job.department.toLowerCase().includes(departmentFilter.value.toLowerCase())
        )
    }

    return result
})

const paginatedJobs = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredJobs.value.slice(start, end)
})

const totalJobs = computed(() => filteredJobs.value.length)

const totalPages = computed(() => Math.ceil(totalJobs.value / itemsPerPage))

const paginationStart = computed(() => {
    return totalJobs.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1
})

const paginationEnd = computed(() => {
    const end = currentPage.value * itemsPerPage
    return end > totalJobs.value ? totalJobs.value : end
})

// Use paginatedJobs instead of filteredJobs in template
const displayJobs = computed(() => paginatedJobs.value)

// Methods
// const getStatusClass = (status: string) => {
//     const classes = {
//         active: 'bg-green-100 text-green-800',
//         closed: 'bg-gray-100 text-gray-800',
//         draft: 'bg-yellow-100 text-yellow-800'
//     }
//     return classes[status as keyof typeof classes] || ''
// }

const getStatusText = (status: string) => {
    const texts = {
        active: '모집 중',
        closed: '마감',
        draft: '임시 저장'
    }
    return texts[status as keyof typeof texts] || status
}

const goToDetail = (jobId: number) => {
    console.log('Go to job detail:', jobId)
    // 실제로는 router.push를 사용
    // router.push(`/jobs/${jobId}`)
    router.push({ name: 'recruiter-job-detail', params: { id: jobId } })
}

const openJobForm = () => {
    console.log('Open job form')
    // 실제로는 router.push를 사용
    // router.push('/jobs/new')
}

const goToPage = (page: number) => {
    currentPage.value = page
}

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

// Update filteredJobs reference in template
// Change v-for="job in filteredJobs" to v-for="job in displayJobs"

const activeJobs = computed(() => {
    return jobs.value.filter(j => j.status !== 'closed' && j.status !== 'paused')
})

const getStatusClass = (status: JobStatus) => {
    const classes: Record<JobStatus, string> = {
        recruiting: 'bg-green-100 text-green-700',
        screening: 'bg-blue-100 text-blue-700',
        interviewing: 'bg-purple-100 text-purple-700',
        closed: 'bg-gray-100 text-gray-700',
        paused: 'bg-yellow-100 text-yellow-700'
    }
    return classes[status]
}

const getStatusLabel = (status: JobStatus) => {
    const labels: Record<JobStatus, string> = {
        recruiting: '채용중',
        screening: '서류검토',
        interviewing: '면접중',
        closed: '마감',
        paused: '일시중단'
    }
    return labels[status]
}

const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-yellow-500'
    return 'bg-gray-400'
}


const viewJobDetail = (jobId: number) => {
    alert(`공고 ID ${jobId}의 상세 정보를 볼 수 있습니다.`)
}

const editJob = (jobId: number) => {
    alert(`공고 ID ${jobId}를 수정할 수 있습니다.`)
}

const shareJob = (jobId: number) => {
    selectedJobId.value = jobId
    selectedJobs.value = [jobId]
    const job = jobs.value.find(j => j.id === jobId)
    if (job?.sharedWith) {
        selectedMembers.value = [...job.sharedWith]
    }
    showShareModal.value = true
}


const viewApplicants = (jobId: number) => {
    alert(`공고 ID ${jobId}의 지원자 목록을 볼 수 있습니다.`)
}

const showShareModal = ref(false)
const selectedMembers = ref<number[]>([])
const selectedJobs = ref<number[]>([])
const selectedJobId = ref<number | null>(null)

// Types
interface FilterOptions {
    status: string
    department: string
    level: string
    employmentType: string
    location: string
}

interface QuickFilters {
    urgent: boolean
    deadline: boolean
    featured: boolean
}

// Props
interface Props {
    filteredCount?: number | null
}

const props = withDefaults(defineProps<Props>(), {
    filteredCount: null
})

// Emits
interface Emits {
    (e: 'search', query: string): void
    (e: 'filter-change', filters: FilterOptions & { search: string }): void
    (e: 'quick-filter', filters: QuickFilters): void
}

const emit = defineEmits<Emits>()

// Reactive data
const selectedStatus = ref('')
const selectedDepartment = ref('')
const selectedLevel = ref('')
const selectedEmploymentType = ref('')
const selectedLocation = ref('')

const quickFilters = ref<QuickFilters>({
    urgent: false,
    deadline: false,
    featured: false
})

// Computed properties
const hasActiveFilters = computed(() => {
    return searchQuery.value !== '' ||
        selectedStatus.value !== '' ||
        selectedDepartment.value !== '' ||
        selectedLevel.value !== '' ||
        selectedEmploymentType.value !== '' ||
        selectedLocation.value !== '' ||
        Object.values(quickFilters.value).some(filter => filter)
})

// Methods
const handleSearch = () => {
    emit('search', searchQuery.value)
    emitFilterChange()
}

const handleFilterChange = () => {
    emitFilterChange()
}

const emitFilterChange = () => {
    const filters = {
        search: searchQuery.value,
        status: selectedStatus.value,
        department: selectedDepartment.value,
        level: selectedLevel.value,
        employmentType: selectedEmploymentType.value,
        location: selectedLocation.value
    }
    emit('filter-change', filters)
}

const toggleQuickFilter = (filterType: keyof QuickFilters) => {
    quickFilters.value[filterType] = !quickFilters.value[filterType]
    emit('quick-filter', { ...quickFilters.value })
}

const clearAllFilters = () => {
    searchQuery.value = ''
    selectedStatus.value = ''
    selectedDepartment.value = ''
    selectedLevel.value = ''
    selectedEmploymentType.value = ''
    selectedLocation.value = ''

    quickFilters.value = {
        urgent: false,
        deadline: false,
        featured: false
    }

    emitFilterChange()
    emit('quick-filter', { ...quickFilters.value })
}

// Watch for quick filters changes
watch(quickFilters, (newFilters) => {
    emit('quick-filter', newFilters)
}, { deep: true })
</script>

<style scoped>
/* Additional custom styles if needed */
</style>