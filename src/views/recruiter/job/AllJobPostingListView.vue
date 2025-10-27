<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { JobPostingListResponse } from '@/types/jobPosting/JobPostingTypes'
import { getJobs } from '@/api/schedules/jobposting/jobposting'
import {
    FileText,
    CheckCircle,
    Users,
    Award,
    Search,
    Briefcase,
    Edit,
    Share2,
} from 'lucide-vue-next'

// -----------------------------
// Router
// -----------------------------
const router = useRouter()

// -----------------------------
// State
// -----------------------------
const searchQuery = ref('')
const statusFilter = ref('')
const departmentFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

const jobs = ref<JobPostingListResponse[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

const stats = ref({
    total: 0,
    active: 0,
    totalApplicants: 0,
    hired: 0,
})

// -----------------------------
// Utils
// -----------------------------
const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
        채용중: 'bg-green-100 text-green-700',
        예정: 'bg-yellow-100 text-yellow-700',
        마감: 'bg-gray-200 text-gray-600',
    }
    return map[status] || 'bg-gray-100 text-gray-600'
}

// -----------------------------
// API 호출
// -----------------------------
const loadJobs = async () => {
    try {
        isLoading.value = true
        errorMessage.value = ''

        const response = await getJobs()
        if (response.success) {
            jobs.value = response.results

            //  통계 계산
            stats.value.total = jobs.value.length
            stats.value.active = jobs.value.filter((j) => j.status === '채용중').length
            stats.value.totalApplicants = jobs.value.reduce(
                (sum, j) => sum + (j.applicantCount || 0),
                0
            )
            stats.value.hired = jobs.value.reduce((total, job) => {
                const finalStage = job.processSummaries?.find(
                    (s) => s.stageName === '최종 합격'
                )
                return total + (finalStage?.count || 0)
            }, 0)
        } else {
            throw new Error(response.message)
        }
    } catch (err: any) {
        console.error('채용공고 목록 조회 실패:', err)
        errorMessage.value = err.message || '데이터를 불러오지 못했습니다.'
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    loadJobs()
})

// -----------------------------
// Computed
// -----------------------------
const filteredJobs = computed(() => {
    let result = jobs.value

    //  검색 필터
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(
            (job) =>
                job.title.toLowerCase().includes(query) ||
                job.departmentName.toLowerCase().includes(query)
        )
    }

    //  상태 필터
    if (statusFilter.value) {
        result = result.filter((job) => job.status === statusFilter.value)
    }

    //  부서 필터
    if (departmentFilter.value) {
        result = result.filter((job) =>
            job.departmentName
                .toLowerCase()
                .includes(departmentFilter.value.toLowerCase())
        )
    }

    return result
})

// 페이지네이션 계산
const totalJobs = computed(() => filteredJobs.value.length)
const totalPages = computed(() => Math.ceil(totalJobs.value / itemsPerPage))
const paginatedJobs = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredJobs.value.slice(start, end)
})

// 페이지 표시 범위
const paginationStart = computed(() =>
    totalJobs.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1
)
const paginationEnd = computed(() => {
    const end = currentPage.value * itemsPerPage
    return end > totalJobs.value ? totalJobs.value : end
})

// -----------------------------
// Methods
// -----------------------------
const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) currentPage.value = page
}
const previousPage = () => {
    if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-yellow-500'
    return 'bg-gray-400'
}

const openJobForm = () => router.push({ name: 'jobPostingCreate' })
const viewJobDetail = (id: number) =>
    router.push({ name: 'recruiter-job-detail', params: { id } })

const editJob = (id: number) => alert(`공고 ID ${id} 수정 페이지로 이동`)
const shareJob = (id: number) => alert(`공고 ID ${id} 공유 기능 (추후 연결 예정)`)
const viewApplicants = (id: number) =>
    alert(`공고 ID ${id}의 지원자 목록 보기`)

// 필터 변경 시 페이지 초기화
const handleSearch = () => (currentPage.value = 1)
const handleFilterChange = () => (currentPage.value = 1)

// 필터 감시해서 자동 리셋
watch([searchQuery, statusFilter, departmentFilter], () => {
    currentPage.value = 1
})
</script>

<template>
    <div class="bg-gray-50 min-h-screen">
        <main class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header -->
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h2 class="text-3xl font-bold text-slate-700 mb-2">채용 공고</h2>
                    <p class="text-gray-600">진행 중인 채용 공고를 관리하세요</p>
                </div>
                <button @click="openJobForm"
                    class="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium">
                    + 새 채용 공고
                </button>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow-sm border p-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-gray-600 text-sm font-medium">전체 공고</span>
                        <FileText class="w-6 h-6 text-slate-500" />
                    </div>
                    <div class="text-3xl font-bold text-slate-700">{{ stats.total }}</div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border p-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-gray-600 text-sm font-medium">채용 중</span>
                        <CheckCircle class="w-6 h-6 text-green-500" />
                    </div>
                    <div class="text-3xl font-bold text-green-600">{{ stats.active }}</div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border p-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-gray-600 text-sm font-medium">전체 지원자</span>
                        <Users class="w-6 h-6 text-blue-500" />
                    </div>
                    <div class="text-3xl font-bold text-blue-600">
                        {{ stats.totalApplicants }}
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border p-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-gray-600 text-sm font-medium">최종 합격</span>
                        <Award class="w-6 h-6 text-purple-500" />
                    </div>
                    <div class="text-3xl font-bold text-purple-600">{{ stats.hired }}</div>
                </div>
            </div>

            <!-- Search & Filters -->
            <div
                class="bg-white rounded-xl border border-gray-200 p-6 mb-6 flex flex-row shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex-1 mr-4">
                    <div class="relative">
                        <input v-model="searchQuery" type="text" placeholder="공고명, 부서, 키워드 검색..."
                            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                            @input="handleSearch" />
                        <Search class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                    </div>
                </div>

                <div class="flex items-center space-x-4">
                    <select v-model="statusFilter" @change="handleFilterChange"
                        class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent">
                        <option value="">전체 상태</option>
                        <option value="채용중">채용중</option>
                        <option value="예정">예정</option>
                        <option value="마감">마감</option>
                    </select>
                </div>
            </div>

            <!-- Table -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-xl font-bold text-slate-600 mb-4">진행중인 채용 공고</h3>

                <!-- 로딩 / 에러 / 빈 데이터 처리 -->
                <div v-if="isLoading" class="text-center py-10 text-gray-500">
                    ⏳ 데이터 불러오는 중...
                </div>
                <div v-else-if="errorMessage" class="text-center py-10 text-red-500">
                    ⚠️ {{ errorMessage }}
                </div>
                <div v-else-if="paginatedJobs.length === 0" class="text-center py-10 text-gray-500">
                    표시할 공고가 없습니다.
                </div>

                <!-- 데이터 표시 -->
                <div v-else class="overflow-x-auto">
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
                            <tr v-for="job in paginatedJobs" :key="job.id"
                                class="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                                @click="viewJobDetail(job.id)">
                                <td class="py-3 px-4">
                                    <p class="font-semibold text-gray-900 truncate">{{ job.title }}</p>
                                    <p class="text-xs text-gray-500">{{ job.summaryText }}</p>
                                </td>

                                <td class="py-3 px-4 text-sm text-gray-600">
                                    <Briefcase class="w-3 h-3 inline mr-1" />
                                    {{ job.departmentName }}
                                </td>

                                <td class="py-3 px-4 text-center">
                                    <span
                                        :class="['inline-block px-2 py-1 text-xs font-semibold rounded', getStatusClass(job.status)]">
                                        {{ job.status }}
                                    </span>
                                </td>

                                <td class="py-3 px-4 text-center text-sm">
                                    <p class="font-medium">{{ formatDate(job.hireEndDate) }}</p>
                                    <p class="text-xs text-gray-500">{{ job.dday }}</p>
                                </td>

                                <td class="py-3 px-4 text-center font-semibold text-gray-800">
                                    {{ job.applicantCount }}명
                                </td>

                                <td class="py-3 px-4">
                                    <div class="flex items-center gap-2">
                                        <div class="flex-1 bg-gray-200 rounded-full h-2">
                                            <div :class="['h-2 rounded-full', getProgressColor(job.progressPercent)]"
                                                :style="{ width: job.progressPercent + '%' }"></div>
                                        </div>
                                        <span class="text-xs font-semibold text-gray-600 w-10 text-right">
                                            {{ job.progressPercent }}%
                                        </span>
                                    </div>
                                </td>

                                <td class="py-3 px-4 text-xs">
                                    <div class="flex items-center justify-center gap-2">
                                        <template v-for="(stage, index) in job.processSummaries" :key="index">
                                            <div class="text-center">
                                                <p class="text-gray-500">{{ stage.stageName }}</p>
                                                <p class="font-bold text-gray-700">{{ stage.count }}</p>
                                            </div>
                                            <span v-if="index < job.processSummaries.length - 1"
                                                class="text-gray-300">→</span>
                                        </template>
                                    </div>
                                </td>

                                <td class="py-3 px-4 text-center">
                                    <div class="flex items-center justify-center gap-2">
                                        <button @click.stop="editJob(job.id)"
                                            class="p-1.5 text-slate-600 hover:bg-slate-100 rounded">
                                            <Edit class="w-4 h-4" />
                                        </button>
                                        <button @click.stop="shareJob(job.id)"
                                            class="p-1.5 text-blue-600 hover:bg-blue-100 rounded">
                                            <Share2 class="w-4 h-4" />
                                        </button>
                                        <button @click.stop="viewApplicants(job.id)"
                                            class="p-1.5 text-green-600 hover:bg-green-100 rounded">
                                            <Users class="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination -->
            <div class="mt-6 flex items-center justify-between">
                <div class="text-sm text-gray-600">
                    총 {{ totalJobs }}개 중 {{ paginationStart }}–{{ paginationEnd }} 표시
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
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50',
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

<style scoped>
/* 필요시 추가 스타일 */
</style>
