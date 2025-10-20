<template>
    <div class="bg-gray-50 min-h-screen">
        <!-- Main Content -->
        <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header Card -->

            <header class="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 h-20 z-10">
                <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-4">
                            <h1 class="text-2xl font-bold text-slate-600">채용 상세</h1>
                        </div>
                        <button
                            class="px-4 py-2 text-slate-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            @click="exit()">
                            나가기
                        </button>
                    </div>
                </div>
            </header>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 mt-20  ">
                <div class="flex items-start gap-6 mb-6">
                    <div
                        class="w-20 h-20 bg-slate-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                        채용
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <h1 class="text-3xl font-bold text-slate-800">{{ jobPosting.title }}</h1>
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
                            <span v-for="(tech, index) in jobPosting.techStack.slice(0, 5)" :key="index"
                                class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                {{ tech }}
                            </span>
                            <span v-if="jobPosting.techStack.length > 5"
                                class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                +{{ jobPosting.techStack.length - 5 }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Salary & Apply Button -->
                <div class="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div class="flex items-center gap-4 flex-col ">
                        <div class="text-2xl text-gray-600">연봉</div>
                        <div class="text-lg text-gray-500">{{ jobPosting.salaryNegotiable }}</div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-right text-sm text-gray-600">
                            <div>마감일: <span class="font-medium text-red-600">{{ jobPosting.deadline }}</span></div>
                            <div>지원자: <span class="font-medium">{{ jobPosting.applicantCount }}명</span></div>
                        </div>
                        <button @click="handleApply"
                            class="px-8 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium text-lg shadow-sm">
                            지원하기
                        </button>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                <!-- Left Column (2/3) - Main Content -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Job Description -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <FileText :size="24" class="text-slate-600" />
                            직무 소개
                        </h2>
                        <p class="text-gray-700 leading-relaxed whitespace-pre-line">
                            {{ jobPosting.description }}
                        </p>
                    </section>

                    <!-- Responsibilities -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <CheckCircle :size="24" class="text-slate-600" />
                            주요 업무
                        </h2>
                        <ul class="text-gray-700 space-y-3">
                            <li v-for="(task, index) in jobPosting.responsibilities" :key="index"
                                class="flex items-start gap-3">
                                <div class="w-2 h-2 bg-slate-600 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{{ task }}</span>
                            </li>
                        </ul>
                    </section>

                    <!-- Requirements -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Star :size="24" class="text-slate-600" />
                            필수 자격 요건
                        </h2>
                        <ul class="text-gray-700 space-y-3">
                            <li v-for="(req, index) in jobPosting.requirements" :key="index"
                                class="flex items-start gap-3">
                                <div class="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{{ req }}</span>
                            </li>
                        </ul>
                    </section>

                    <!-- Preferred Qualifications -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ThumbsUp :size="24" class="text-slate-600" />
                            우대 사항
                        </h2>
                        <ul class="text-gray-700 space-y-3">
                            <li v-for="(qual, index) in jobPosting.preferred" :key="index"
                                class="flex items-start gap-3">
                                <div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{{ qual }}</span>
                            </li>
                        </ul>
                    </section>

                    <!-- Benefits -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Gift :size="24" class="text-slate-600" />
                            복리후생
                        </h2>
                        <ul class="text-gray-700 space-y-3">
                            <li v-for="(benefit, index) in jobPosting.benefits" :key="index"
                                class="flex items-start gap-3">
                                <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{{ benefit }}</span>
                            </li>
                        </ul>
                    </section>

                    <!-- Additional Info -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Info :size="24" class="text-slate-600" />
                            기타 안내사항
                        </h2>
                        <p class="text-gray-700 leading-relaxed whitespace-pre-line">
                            {{ jobPosting.additionalInfo }}
                        </p>
                    </section>
                </div>

                <!-- Right Column (1/3) - Sidebar Info -->
                <div class="space-y-6">
                    <!-- Tech Stack Detail -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Code :size="20" class="text-slate-600" />
                            기술 스택
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="(tech, index) in jobPosting.techStack" :key="index"
                                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                {{ tech }}
                            </span>
                        </div>
                    </section>

                    <!-- Job Info -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-slate-800 mb-4">채용 정보</h3>
                        <div class="space-y-4 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600">모집 인원</span>
                                <span class="font-medium">{{ jobPosting.headcount }}명</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">현재 지원자</span>
                                <span class="font-medium text-slate-600">{{ jobPosting.applicantCount }}명</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">등록일</span>
                                <span class="font-medium">{{ jobPosting.postedDate }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">접수 기간</span>
                                <span class="font-medium">{{ jobPosting.applicationPeriod }}</span>
                            </div>
                        </div>
                    </section>

                    <!-- Recruitment Process -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Target :size="20" class="text-slate-600" />
                            채용 프로세스
                        </h3>
                        <div class="space-y-4">
                            <div v-for="(step, index) in recruitmentProcess" :key="index" class="flex gap-3">
                                <div class="flex flex-col items-center">
                                    <div :class="`w-3 h-3 rounded-full ${step.color}`"></div>
                                    <div v-if="index < recruitmentProcess.length - 1"
                                        class="w-0.5 h-8 bg-gray-200 mt-1">
                                    </div>
                                </div>
                                <div class="flex-1 pb-2">
                                    <div class="font-medium text-gray-900 text-sm">{{ step.name }}</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Work Conditions -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Clock :size="20" class="text-slate-600" />
                            근무 조건
                        </h3>
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600">근무 시간</span>
                                <span class="font-medium">{{ jobPosting.workingHours }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">근무일</span>
                                <span class="font-medium">{{ jobPosting.workingDays }}</span>
                            </div>
                        </div>
                    </section>

                    <!-- Contact Info -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <User :size="20" class="text-slate-600" />
                            문의처
                        </h3>
                        <div class="space-y-3 text-sm">
                            <div class="flex items-center gap-3">
                                <Mail :size="16" class="text-gray-400" />
                                <span class="text-gray-700">{{ jobPosting.contact.email }}</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <User :size="16" class="text-gray-400" />
                                <span class="text-gray-700">담당자: {{ jobPosting.contact.name }}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-sm border-t border-gray-200 h-20 z-10">
                <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div class="flex items-center justify-end">
                        <div class="flex items-center gap-3">
                            <button
                                class="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium"
                                @click="submitForm">
                                지원 하기
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
    Building2,
    MapPin,
    Briefcase,
    DollarSign,
    Clock,
    User,
    Mail,
    FileText,
    CheckCircle,
    Star,
    ThumbsUp,
    Gift,
    Info,
    Code,
    Target
} from 'lucide-vue-next'

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

interface RecruitmentStep {
    name: string
    color: string
}

const jobPosting = ref<JobPosting>({
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
• 입사 지원 서류에 허위 사실이 발견될 경우, 채용이 취소될 수 있습니다.
• 국가보훈대상자 및 장애인은 관련 법규에 따라 우대합니다.`,
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

const getStatusClass = (status: string): string => {
    if (status === '채용중') {
        return 'bg-green-100 text-green-700'
    }
    return 'bg-gray-100 text-gray-700'
}

const handleApply = (): void => {
    alert('지원하기 페이지로 이동합니다.')
    // 실제로는 지원 페이지로 라우팅
    // router.push('/apply/1')
}
</script>
