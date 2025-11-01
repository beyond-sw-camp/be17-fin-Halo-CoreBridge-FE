<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Users, Clock, Calendar, User, Mail, MapPin, Code } from 'lucide-vue-next'
import { getJobById } from '@/api/jobposting/index'
import ColorCode from '@/components/common/ColorCode.vue'

// -----------------------------
// 타입 정의
// -----------------------------
interface colorCode {
    name: string
    label: string
    code: string
}

interface RecruitProcessRead {
    id: number
    name: string
    colorCode: colorCode
    orderIdx: number
}

interface JobPostingDetailResponse {
    //기본 식별자
    id: number

    //기본 회사소개
    summary: string
    responsibilities: string
    requirements: string
    preferred: string
    benefits: string
    additionalInfo: string

    //공고 정보
    status: string
    createDate: string
    applyStartDate: string
    applyEndDate: string
    hireEndDate: string

    headCount: number
    applicantCount: number

    skills: string[]
    recruitProcesses: RecruitProcessRead[]

    //근무 조건
    workingHours: string
    location: string

    //담당자 정보
    contactName: string
    contactEmail: string
}

// -----------------------------
// 상태 관리
// -----------------------------
const route = useRoute()
const jobId = Number(route.params.id)

const jobPosting = ref<JobPostingDetailResponse | null>(null)
const recruitmentProcess = ref<RecruitProcessRead[]>([])
const colorCode = ref<colorCode[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

// -----------------------------
// API 호출
// -----------------------------
onMounted(async () => {
    try {
        const response = await getJobById(jobId)
        if (response.success) {
            jobPosting.value = response.results as JobPostingDetailResponse
            recruitmentProcess.value = response.results.recruitProcesses || []
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




// -----------------------------
// 헤더 이벤트 (임시)
// -----------------------------
const handleEdit = () => console.log('공고 수정')
const handlePause = () => alert('공고가 모집 중단 상태로 변경되었습니다.')
const handleDelete = () => {
    if (confirm('정말로 이 공고를 삭제하시겠습니까?')) {
        console.log('공고 삭제')
    }
}
</script>

<template>
    <div class="bg-gray-50 min-h-screen p-6">
        <!--  로딩 상태 -->
        <div v-if="isLoading" class="text-center text-gray-500 py-20">불러오는 중...</div>

        <!--  에러 상태 -->
        <div v-else-if="errorMessage" class="text-center text-red-500 py-20">
            {{ errorMessage }}
        </div>

        <!--  정상 렌더링 -->
        <main v-else-if="jobPosting" class="grid grid-cols-3 gap-6">
            <!-- Left Column (2/3) -->
            <div class="col-span-2 space-y-6">
                <!-- 직무 소개 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-bold text-slate-600 mb-4">직무 소개</h3>
                    <p class="text-gray-700 leading-relaxed whitespace-pre-line">
                        {{ jobPosting.summary || '내용 없음' }}
                    </p>
                </section>

                <!-- 주요 업무 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-bold text-slate-600 mb-4">주요 업무</h3>
                    <p class="text-gray-700 whitespace-pre-line">
                        {{ jobPosting.responsibilities || '내용 없음' }}
                    </p>
                </section>

                <!-- 필수 자격 요건 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-bold text-slate-600 mb-4">필수 자격 요건</h3>
                    <p class="text-gray-700 whitespace-pre-line">
                        {{ jobPosting.requirements || '내용 없음' }}
                    </p>
                </section>

                <!-- 우대 사항 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-bold text-slate-600 mb-4">우대 사항</h3>
                    <p class="text-gray-700 whitespace-pre-line">
                        {{ jobPosting.preferred || '내용 없음' }}
                    </p>
                </section>

                <!-- 복리후생 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-bold text-slate-600 mb-4">복리후생</h3>
                    <p class="text-gray-700 whitespace-pre-line">
                        {{ jobPosting.benefits || '내용 없음' }}
                    </p>
                </section>

                <!-- 기타 안내사항 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-bold text-slate-600 mb-4">기타 안내사항</h3>
                    <p class="text-gray-700 whitespace-pre-line">
                        {{ jobPosting.additionalInfo || '내용 없음' }}
                    </p>
                </section>
            </div>

            <!-- Right Column (1/3) -->
            <div class="space-y-6">
                <!-- 공고 정보 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-bold text-slate-600 mb-4">공고 정보</h3>
                    <div class="space-y-4">
                        <div>
                            <div class="text-sm text-gray-600 mb-1">공고 상태</div>
                            <div class="font-medium" :class="{
                                'text-green-600': jobPosting.status === '채용중',
                                'text-gray-600': jobPosting.status === '마감',
                                'text-orange-600': jobPosting.status === '예정'
                            }">
                                {{ jobPosting.status }}
                            </div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-600 mb-1">등록일</div>
                            <div class="font-medium text-gray-900">{{ jobPosting.createDate }}</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-600 mb-1">접수 기간</div>
                            <div class="font-medium text-gray-900">{{ jobPosting.applyStartDate }} ~
                                {{ jobPosting.applyEndDate }}</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-600 mb-1">채용 마감일</div>
                            <div class="font-medium text-gray-900">{{ jobPosting.hireEndDate }}</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-600 mb-1">모집 인원</div>
                            <div class="font-medium text-gray-900">{{ jobPosting.headCount }}명</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-600 mb-1">지원자 수</div>
                            <div class="font-medium text-slate-600 flex items-center gap-1">
                                <Users :size="20" />
                                {{ jobPosting.applicantCount }}명
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 기술 스택 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-bold text-slate-600 mb-4">기술 스택</h3>
                    <div class="flex flex-wrap gap-2">
                        <span v-for="(skill, index) in jobPosting.skills" :key="index"
                            class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {{ skill }}
                        </span>
                    </div>
                </section>

                <!-- 채용 프로세스 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-bold text-slate-600 mb-6">채용 프로세스</h3>

                    <ul class="relative space-y-6">
                        <!-- 수직 라인 -->
                        <div class="absolute left-1.5 top-3 bottom-3 w-0.5 bg-gray-200"></div>

                        <li v-for="step in recruitmentProcess" :key="step.id" class="relative flex items-start gap-3">
                            <!-- 동그라미 -->
                            <div class="z-10 w-4 h-4 rounded-full flex-shrink-0 border-2 border-white shadow"
                                :class="`bg-${step.colorCode.code}`"></div>

                            <!-- 프로세스 내용 -->
                            <div>
                                <!-- orderIdx (연하게) -->
                                <span class="text-sm text-gray-400 font-medium">{{ step.orderIdx }}. </span>
                                <!-- 프로세스명 -->
                                <span class="font-semibold text-slate-800">{{ step.name }}</span>
                            </div>
                        </li>
                    </ul>
                </section>

                <!-- 근무 조건 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-bold text-slate-600 mb-4">근무 조건</h3>
                    <div class="space-y-3">
                        <!-- 근무 시간 -->
                        <div class="flex items-center gap-3 text-gray-700">
                            <Clock :size="20" class="text-slate-600" />
                            <div>
                                <div class="text-sm text-gray-600">근무 시간</div>
                                <div class="font-medium">{{ jobPosting.workingHours }}</div>
                            </div>
                        </div>

                        <!-- 근무 장소 -->
                        <div class="flex items-center gap-3 text-gray-700">
                            <MapPin :size="20" class="text-slate-600" />
                            <div>
                                <div class="text-sm text-gray-600">근무 장소</div>
                                <div class="font-medium">{{ jobPosting.location }}</div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 담당자 정보 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-bold text-slate-600 mb-4">담당자 정보</h3>
                    <div class="space-y-3">
                        <div class="flex items-center gap-3 text-gray-700">
                            <User :size="20" class="text-slate-600" />
                            <div>
                                <div class="text-sm text-gray-600">이름</div>
                                <div class="font-medium">{{ jobPosting.contactName }}</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 text-gray-700">
                            <Mail :size="20" class="text-slate-600" />
                            <div>
                                <div class="text-sm text-gray-600">이메일</div>
                                <div class="font-medium">{{ jobPosting.contactEmail }}</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    </div>
</template>
