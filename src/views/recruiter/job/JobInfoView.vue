<template>
    <div class="bg-gray-50 min-h-screen">
        <!-- Main Content -->
        <main class="mx-auto px-4 sm:px-6 lg:px-8 py-6">


            <div class="grid grid-cols-3 gap-6">
                <!-- Left Column (2/3) - Main Content -->
                <div class="col-span-2 space-y-6">
                    <!-- Header Card -->


                    <!-- Job Description -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-slate-600 mb-4">직무 소개</h3>
                        <p class="text-gray-700 leading-relaxed whitespace-pre-line">
                            {{ jobPosting.description }}
                        </p>
                    </section>

                    <!-- Responsibilities -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-slate-600 mb-4">주요 업무</h3>
                        <ul class="text-gray-700 space-y-2 list-disc list-inside">
                            <li v-for="(task, index) in jobPosting.responsibilities" :key="index">
                                {{ task }}
                            </li>
                        </ul>
                    </section>

                    <!-- Requirements -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-slate-600 mb-4">필수 자격 요건</h3>
                        <ul class="text-gray-700 space-y-2 list-disc list-inside">
                            <li v-for="(req, index) in jobPosting.requirements" :key="index">
                                {{ req }}
                            </li>
                        </ul>
                    </section>

                    <!-- Preferred Qualifications -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-slate-600 mb-4">우대 사항</h3>
                        <ul class="text-gray-700 space-y-2 list-disc list-inside">
                            <li v-for="(qual, index) in jobPosting.preferred" :key="index">
                                {{ qual }}
                            </li>
                        </ul>
                    </section>

                    <!-- Benefits -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-slate-600 mb-4">복리후생</h3>
                        <ul class="text-gray-700 space-y-2 list-disc list-inside">
                            <li v-for="(benefit, index) in jobPosting.benefits" :key="index">
                                {{ benefit }}
                            </li>
                        </ul>
                    </section>

                    <!-- Additional Info -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-slate-600 mb-4">기타 안내사항</h3>
                        <p class="text-gray-700 leading-relaxed whitespace-pre-line">
                            {{ jobPosting.additionalInfo }}
                        </p>
                    </section>
                </div>

                <!-- Right Column (1/3) - Sidebar Info -->
                <div class="space-y-6">
                    <!-- Quick Stats -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-slate-600 mb-4">공고 정보</h3>
                        <div class="space-y-4">
                            <div>
                                <div class="text-sm text-gray-600 mb-1">공고 상태</div>
                                <div class="font-medium text-green-600">{{ jobPosting.status }}</div>
                            </div>
                            <div>
                                <div class="text-sm text-gray-600 mb-1">등록일</div>
                                <div class="font-medium text-gray-900">{{ jobPosting.postedDate }}</div>
                            </div>
                            <div>
                                <div class="text-sm text-gray-600 mb-1">접수 기간</div>
                                <div class="font-medium text-gray-900">{{ jobPosting.applicationPeriod }}</div>
                            </div>
                            <div>
                                <div class="text-sm text-gray-600 mb-1">마감일</div>
                                <div class="font-medium text-red-600">{{ jobPosting.deadline }}</div>
                            </div>
                            <div>
                                <div class="text-sm text-gray-600 mb-1">모집 인원</div>
                                <div class="font-medium text-gray-900">{{ jobPosting.headcount }}명</div>
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

                    <!-- Tech Stack Detail -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-slate-600 mb-4">기술 스택</h3>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="(tech, index) in jobPosting.techStack" :key="index"
                                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                {{ tech }}
                            </span>
                        </div>
                    </section>



                    <!-- Recruitment Process -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-slate-600 mb-4">채용 프로세스</h3>
                        <div class="space-y-4">
                            <div v-for="(step, index) in recruitmentProcess" :key="index" class="flex gap-3">
                                <div class="flex flex-col items-center">
                                    <div :class="`w-3 h-3 rounded-full ${step.color}`"></div>
                                    <div v-if="index < recruitmentProcess.length - 1" class="w-0.5 h-full bg-gray-200">
                                    </div>
                                </div>
                                <div class="flex-1 pb-4">
                                    <div class="font-medium text-gray-900">{{ step.name }}</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Work Conditions -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-slate-600 mb-4">근무 조건</h3>
                        <div class="space-y-3">
                            <div class="flex items-center gap-3 text-gray-700">
                                <Clock :size="20" class="text-slate-600" />
                                <div>
                                    <div class="text-sm text-gray-600">근무 시간</div>
                                    <div class="font-medium">{{ jobPosting.workingHours }}</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 text-gray-700">
                                <Calendar :size="20" class="text-slate-600" />
                                <div>
                                    <div class="text-sm text-gray-600">근무일</div>
                                    <div class="font-medium">{{ jobPosting.workingDays }}</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Contact Info -->
                    <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-bold text-slate-600 mb-4">담당자 정보</h3>
                        <div class="space-y-3">
                            <div class="flex items-center gap-3 text-gray-700">
                                <User :size="20" class="text-slate-600" />
                                <div>
                                    <div class="text-sm text-gray-600">이름</div>
                                    <div class="font-medium">{{ jobPosting.contact.name }}</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 text-gray-700">
                                <Mail :size="20" class="text-slate-600" />
                                <div>
                                    <div class="text-sm text-gray-600">이메일</div>
                                    <div class="font-medium">{{ jobPosting.contact.email }}</div>
                                </div>
                            </div>
                        </div>
                    </section>




                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Users, Clock, Calendar, User, Mail } from 'lucide-vue-next' // ✅ 본문에서 사용하는 아이콘만 남김

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

const activeTab = ref('info')

const tabs = ref([
    { id: 'info', name: '공고 정보' },
    { id: 'applicants', name: '지원자 관리' },
    { id: 'applicants-list', name: '지원자 목록' },
    { id: 'post-schedule', name: '공고 일정' },
    { id: 'proccess-setting', name: '프로세스 설정' }
])

// ✅ 헤더에서 emit 받는 이벤트만 남김
const handleEdit = () => console.log('공고 수정')
const handlePause = () => alert('공고가 모집 중단 상태로 변경되었습니다.')
const handleDelete = () => {
    if (confirm('정말로 이 공고를 삭제하시겠습니까?')) {
        console.log('공고 삭제')
    }
}
</script>