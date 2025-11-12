<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Users, Clock, Search, Filter } from 'lucide-vue-next'
import ApplicantListCard from '@/components/applicant/ApplicantListCard.vue'
import { getApplicantsList } from '@/api/resume'
import RecruitProcessApi from '@/api/recruit-process'
import { useRoute, useRouter } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts'

// --------------------------------------
// 타입 정의
// --------------------------------------
interface Applicant {
    id: number
    name: string
    email: string
    careerType: string
    skills: string[]
    degree: string
    certificateCount: number
    applyDate: string
    stageName: string
}

interface RecruitProcess {
    id: number
    name: string
    colorCode: {
        name: string
        label: string
        code: string
    }
    orderIdx: number
    count?: number
}

// --------------------------------------
// 상태 변수
// --------------------------------------
const route = useRoute()
const router = useRouter()
const jobId = Number(route.params.id)

const applicants = ref<Applicant[]>([])
const recruitProcesses = ref<RecruitProcess[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

// --------------------------------------
// 데이터 로드
// --------------------------------------
onMounted(async () => {
    try {
        const [applicantRes, processRes] = await Promise.all([
            getApplicantsList(jobId),
            RecruitProcessApi.requestRecruitProcesses({ recruit: jobId })
        ])

        if (applicantRes.success && applicantRes.results)
            applicants.value = applicantRes.results

        if (processRes.success && processRes.results)
            recruitProcesses.value = processRes.results.recruitProcesses
    } catch (e) {
        console.error(e)
        errorMessage.value = '데이터를 불러오는 중 오류가 발생했습니다.'
    } finally {
        isLoading.value = false
    }
})

// --------------------------------------
// 검색 및 필터링
// --------------------------------------
const searchQuery = ref('')
const statusFilter = ref('all')

const filteredApplicants = computed(() => {
    const search = searchQuery.value.toLowerCase()
    const status = statusFilter.value

    return applicants.value.filter((a) => {
        const matchesSearch =
            a.name.toLowerCase().includes(search) ||
            a.email.toLowerCase().includes(search)
        const matchesStatus = status === 'all' || a.stageName === status
        return matchesSearch && matchesStatus
    })
})

// 필터 옵션
const statusOptions = computed(() => [
    { value: 'all', label: '전체' },
    ...recruitProcesses.value.map((p) => ({
        value: p.name,
        label: p.name
    }))
])

// --------------------------------------
// 통계 계산
// --------------------------------------
const stats = computed(() => {
    const total = applicants.value.length

    const processes = recruitProcesses.value.map((p) => {
        const count = applicants.value.filter((a) => a.stageName === p.name).length
        return { ...p, count }
    })

    return { total, processes }
})

// --------------------------------------
// ApexCharts (그래프)
// --------------------------------------
const barSeries = computed(() => [
    { name: '지원자 수', data: stats.value.processes.map((p) => p.count) }
])

const barOptions = computed(() => ({
    chart: { toolbar: { show: false } },
    xaxis: {
        categories: stats.value.processes.map((p) => p.name),
        labels: { style: { colors: '#6b7280', fontSize: '12px' } }
    },
    yaxis: {
        labels: { style: { colors: '#6b7280' } },
        title: { text: '인원 수', style: { color: '#6b7280' } }
    },
    plotOptions: {
        bar: {
            borderRadius: 6,
            distributed: true,
            columnWidth: '55%'
        }
    },
    grid: { borderColor: '#f1f5f9' },
    dataLabels: { enabled: false },
    colors: ['#3b82f6', '#f97316', '#a855f7', '#22c55e', '#ec4899']
}))

const donutSeries = computed(() => stats.value.processes.map((p) => p.count))
const donutOptions = computed(() => ({
    labels: stats.value.processes.map((p) => p.name),
    colors: ['#3b82f6', '#f97316', '#a855f7', '#22c55e', '#ec4899'],
    legend: { position: 'bottom' },
    plotOptions: {
        pie: {
            donut: {
                size: '70%',
                labels: {
                    show: true,
                    total: {
                        show: true,
                        label: '전체',
                        formatter: () => `${stats.value.total}명`
                    }
                }
            }
        }
    },
    dataLabels: { enabled: true }
}))

// --------------------------------------
// 이벤트
// --------------------------------------
const viewApplicantDetail = (id: number): void => {
    router.push(`/jobposts/${jobId}/applies/${id}`)
}
</script>

<template>
    <div class="bg-gray-50 min-h-screen">
        <main v-if="!isLoading" class="space-y-10">
            <!-- ✅ 통계 카드 -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <!-- 전체 지원자 -->
                <div
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-5 flex flex-col items-start transition hover:shadow-md hover:scale-[1.02]">
                    <div class="flex items-center justify-center w-10 h-10 rounded-full mb-3 bg-blue-100">
                        <Users :size="20" class="text-blue-500" />
                    </div>
                    <p class="text-sm font-medium text-gray-500">전체 지원자</p>
                    <p class="text-2xl font-bold text-slate-800 mt-1">{{ stats.total }}</p>
                    <div class="w-full h-1 mt-3 rounded-full bg-gray-100">
                        <div class="h-1 rounded-full bg-blue-500 w-full"></div>
                    </div>
                </div>

                <!-- 각 프로세스 -->
                <div v-for="stage in stats.processes" :key="stage.id"
                    class="relative bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-5 flex flex-col items-start transition hover:shadow-md hover:scale-[1.02]">
                    <div class="flex items-center justify-center w-10 h-10 rounded-full mb-3"
                        :class="`bg-${stage.colorCode.code.replace('-500', '-100')}`">
                        <Clock :size="20" :class="`text-${stage.colorCode.code}`" />
                    </div>
                    <p class="text-sm font-medium text-gray-500">{{ stage.name }}</p>
                    <p class="text-2xl font-bold text-slate-800 mt-1">{{ stage.count }}</p>
                    <div class="w-full h-1 mt-3 rounded-full bg-gray-100">
                        <div class="h-1 rounded-full transition-all duration-500" :class="`bg-${stage.colorCode.code}`"
                            :style="`width: ${(stage.count / stats.total) * 100}%`" />
                    </div>
                    <span class="absolute top-3 right-4 text-xs font-semibold text-gray-400">
                        {{ ((stage.count / stats.total) * 100).toFixed(1) }}%
                    </span>
                </div>
            </div>

            <!-- ✅ 그래프 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Bar Chart -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 class="text-lg font-semibold text-slate-700 mb-4">
                        단계별 지원자 수 (Bar Chart)
                    </h2>
                    <VueApexCharts type="bar" height="250" :options="barOptions" :series="barSeries" />
                </div>

                <!-- Donut Chart -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 class="text-lg font-semibold text-slate-700 mb-4">
                        단계별 비율 (Donut Chart)
                    </h2>
                    <VueApexCharts type="donut" height="250" :options="donutOptions" :series="donutSeries" />
                </div>
            </div>

            <!-- ✅ 필터 -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1 relative">
                        <Search :size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input v-model="searchQuery" type="text" placeholder="이름, 이메일로 검색..."
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent" />
                    </div>

                    <div class="flex gap-2">
                        <div class="relative">
                            <Filter :size="20"
                                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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

            <!-- ✅ 지원자 목록 -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 class="text-xl font-semibold text-slate-600 mb-4">
                    지원자 목록 ({{ filteredApplicants.length }})
                </h2>

                <div v-if="filteredApplicants.length" class="space-y-4">
                    <ApplicantListCard v-for="applicant in filteredApplicants" :key="applicant.id" :applicant="{
                        id: applicant.id,
                        name: applicant.name,
                        email: applicant.email,
                        appliedAt: applicant.applyDate,
                        status: applicant.stageName,
                        statusColor: recruitProcesses.find(p => p.name === applicant.stageName)?.colorCode.code || 'gray-500',
                        careerType: applicant.careerType,
                        education: applicant.degree,
                        certificates: applicant.certificateCount,
                        skills: applicant.skills
                    }" @click="viewApplicantDetail(applicant.id)" />
                </div>

                <div v-else class="text-center py-12">
                    <p class="text-gray-500">검색 결과가 없습니다.</p>
                </div>
            </div>
        </main>

        <div v-else class="text-center py-12 text-gray-500">로딩 중...</div>
    </div>
</template>

<style scoped>
:root {
    --tw-blue-500: #3b82f6;
    --tw-orange-500: #f97316;
    --tw-green-500: #22c55e;
    --tw-purple-500: #a855f7;
    --tw-pink-500: #ec4899;
}
</style>
