<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Users, FileText, CheckCircle, Clock, Search, Filter } from 'lucide-vue-next'
import ApplicantListCard from '@/components/applicant/ApplicantListCard.vue'
import { getApplicantsList } from '@/api/jobposting'
import { useRoute } from 'vue-router'

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

// --------------------------------------
// 상태 변수
// --------------------------------------
const route = useRoute()
const jobId = Number(route.params.id)

const applicants = ref<Applicant[]>([])
const errorMessage = ref('')
const isLoading = ref(true)

// --------------------------------------
// API 호출
// --------------------------------------
onMounted(async () => {
    try {
        const response = await getApplicantsList(jobId)
        if (response.success) {
            applicants.value = response.results as Applicant[]
        } else {
            errorMessage.value = response.message || '데이터를 불러오지 못했습니다.'
        }
    } catch (err: any) {
        console.error(err)
        errorMessage.value = '서버 오류가 발생했습니다.'
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

    return applicants.value.filter(applicant => {
        const matchesSearch =
            applicant.name.toLowerCase().includes(search) ||
            applicant.email.toLowerCase().includes(search)

        const matchesStatus =
            status === 'all' || applicant.stageName === status

        return matchesSearch && matchesStatus
    })
})

const statusOptions = [
    { value: 'all', label: '전체' },

]

// --------------------------------------
// 통계 계산
// --------------------------------------
const stats = computed(() => {
    const total = applicants.value.length

    // 단계별 인원 수 집계
    const grouped = applicants.value.reduce((acc, a) => {
        acc[a.stageName] = (acc[a.stageName] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    // 최종 합격자
    const final = grouped['최종합격'] || 0

    // 진행 중(= 아직 최종 합격이 아닌 모든 사람)
    const ongoing = total - final
    console.log(final)

    return {
        total,
        ongoing,
        final
    }
})

// --------------------------------------
// 이벤트 핸들러
// --------------------------------------
const viewApplicantDetail = (id: number) => {
    console.log('지원자 상세 보기:', id)
    // router.push(`/recruiter/applicant/${id}`)
}
</script>

<template>
    <div class="bg-gray-50 min-h-screen">
        <main>
            <!--  통계 카드 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <!-- 전체 지원자 -->
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

                <!-- 채용 진행 중 -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div class="flex items-center gap-3">
                        <div class="p-2 bg-yellow-50 rounded-lg">
                            <Clock :size="24" class="text-yellow-600" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">채용 진행 중</p>
                            <p class="text-2xl font-bold text-slate-700">{{ stats.ongoing }}</p>
                        </div>
                    </div>
                </div>

                <!-- 최종 합격 -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div class="flex items-center gap-3">
                        <div class="p-2 bg-green-50 rounded-lg">
                            <CheckCircle :size="24" class="text-green-600" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">최종 합격</p>
                            <p class="text-2xl font-bold text-slate-700">{{ stats.final }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!--  필터 -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1 relative">
                        <Search :size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="text" v-model="searchQuery" placeholder="이름, 이메일로 검색..."
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

            <!--  지원자 목록 -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 class="text-xl font-semibold text-slate-600 mb-4">
                    지원자 목록 ({{ filteredApplicants.length }})
                </h2>

                <div v-if="filteredApplicants.length > 0" class="space-y-4">
                    <ApplicantListCard v-for="applicant in filteredApplicants" :key="applicant.id" :applicant="{
                        id: applicant.id,
                        name: applicant.name,
                        email: applicant.email,
                        appliedAt: applicant.applyDate,
                        status: applicant.stageName,
                        statusColor:
                            applicant.stageName.includes('면접') ? 'purple'
                                : applicant.stageName.includes('서류') ? 'yellow'
                                    : applicant.stageName.includes('합격') ? 'green'
                                        : 'gray',
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
    </div>
</template>
