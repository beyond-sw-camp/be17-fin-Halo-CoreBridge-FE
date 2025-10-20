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
            <div v-if="activeTab === 'applicants-list'" class="bg-white rounded-lg shadow-sm border border-gray-200">
                <!-- Stats Cards -->
                <div class="p-6 border-b border-gray-200">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm text-blue-600 font-medium">전체 지원자</p>
                                    <p class="text-2xl font-bold text-blue-800">{{ stats.total }}</p>
                                </div>
                                <Users :size="24" class="text-blue-600" />
                            </div>
                        </div>
                        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm text-yellow-600 font-medium">서류 심사</p>
                                    <p class="text-2xl font-bold text-yellow-800">{{ stats.pending }}</p>
                                </div>
                                <Clock :size="24" class="text-yellow-600" />
                            </div>
                        </div>
                        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm text-green-600 font-medium">서류 통과</p>
                                    <p class="text-2xl font-bold text-green-800">{{ stats.passed }}</p>
                                </div>
                                <CheckCircle :size="24" class="text-green-600" />
                            </div>
                        </div>
                        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm text-purple-600 font-medium">면접 대기</p>
                                    <p class="text-2xl font-bold text-purple-800">{{ stats.interview }}</p>
                                </div>
                                <FileText :size="24" class="text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <!-- Search and Filter -->
                    <div class="flex flex-col sm:flex-row gap-4">
                        <div class="flex-1 relative">
                            <Search :size="20"
                                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input v-model="searchQuery" type="text" placeholder="지원자 이름 또는 이메일로 검색..."
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                        </div>
                        <div class="flex items-center gap-2">
                            <Filter :size="20" class="text-gray-400" />
                            <select v-model="statusFilter"
                                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Applicants List -->
                <div class="divide-y divide-gray-200">
                    <div v-for="applicant in filteredApplicants" :key="applicant.id"
                        class="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                        @click="viewApplicantDetail(applicant.id)">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {{ applicant.name.charAt(0) }}
                                </div>
                                <div>
                                    <h4 class="font-semibold text-slate-800">{{ applicant.name }}</h4>
                                    <p class="text-gray-600">{{ applicant.email }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-6">
                                <div class="text-right">
                                    <p class="text-sm text-gray-500">지원일</p>
                                    <p class="font-medium">{{ applicant.appliedAt }}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm text-gray-500">경력</p>
                                    <p class="font-medium">{{ applicant.careerYears }}년</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm text-gray-500">학력</p>
                                    <p class="font-medium">{{ applicant.education }}</p>
                                </div>
                                <span :class="[
                                    'px-3 py-1 text-sm rounded-full font-medium',
                                    applicant.statusColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                                        applicant.statusColor === 'green' ? 'bg-green-100 text-green-700' :
                                            applicant.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                ]">
                                    {{ applicant.status }}
                                </span>
                            </div>
                        </div>
                        <div class="mt-3 flex gap-2 flex-wrap">
                            <span v-for="skill in applicant.skills.slice(0, 4)" :key="skill"
                                class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {{ skill }}
                            </span>
                            <span v-if="applicant.skills.length > 4"
                                class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                +{{ applicant.skills.length - 4 }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-if="filteredApplicants.length === 0" class="p-12 text-center">
                    <Users :size="48" class="mx-auto text-gray-300 mb-4" />
                    <h3 class="text-lg font-medium text-gray-500 mb-2">조건에 맞는 지원자가 없습니다</h3>
                    <p class="text-gray-400">검색 조건을 변경해보세요.</p>
                </div>
            </div>

            <!-- Process Setting Tab Content -->
            <div v-if="activeTab === 'proccess-setting'"
                class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="mb-6">
                    <h3 class="text-xl font-bold text-slate-800 mb-2">채용 프로세스 설정</h3>
                    <p class="text-gray-600">채용 단계를 추가, 수정, 삭제하고 순서를 변경할 수 있습니다.</p>
                </div>

                <!-- Current Process Overview -->
                <div class="mb-8">
                    <h4 class="text-lg font-semibold text-slate-700 mb-4">현재 채용 프로세스</h4>
                    <div class="flex items-center gap-4 overflow-x-auto pb-4">
                        <div v-for="(step, index) in recruitmentProcess" :key="index"
                            class="flex items-center gap-2 min-w-fit">
                            <div class="flex flex-col items-center">
                                <div :class="step.color"
                                    class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {{ index + 1 }}
                                </div>
                                <span class="text-sm font-medium text-slate-700 mt-2 text-center whitespace-nowrap">
                                    {{ step.name }}
                                </span>
                            </div>
                            <ChevronRight v-if="index < recruitmentProcess.length - 1" :size="20"
                                class="text-gray-400 mt-3" />
                        </div>
                    </div>
                </div>

                <!-- Process Management -->
                <div class="space-y-6">
                    <!-- Add New Step -->
                    <div class="border border-gray-200 rounded-lg p-4">
                        <h5 class="font-semibold text-slate-700 mb-4">새 단계 추가</h5>
                        <div class="flex gap-4 items-end">
                            <div class="flex-1">
                                <label class="block text-sm font-medium text-gray-700 mb-2">단계명</label>
                                <input v-model="newStepName" type="text" placeholder="예: 1차 면접, 코딩테스트 등"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">색상</label>
                                <select v-model="newStepColor"
                                    class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                                    <option value="bg-gray-400">회색</option>
                                    <option value="bg-red-500">빨강</option>
                                    <option value="bg-orange-500">주황</option>
                                    <option value="bg-yellow-500">노랑</option>
                                    <option value="bg-green-500">초록</option>
                                    <option value="bg-blue-500">파랑</option>
                                    <option value="bg-purple-500">보라</option>
                                    <option value="bg-pink-500">분홍</option>
                                    <option value="bg-indigo-500">남색</option>
                                    <option value="bg-cyan-500">청록</option>
                                </select>
                            </div>
                            <button @click="addStep" :disabled="!newStepName.trim()"
                                class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                                <Plus :size="16" class="inline mr-2" />
                                추가
                            </button>
                        </div>
                    </div>

                    <!-- Existing Steps Management -->
                    <div class="border border-gray-200 rounded-lg p-4">
                        <h5 class="font-semibold text-slate-700 mb-4">단계 관리</h5>
                        <div class="space-y-3">
                            <div v-for="(step, index) in recruitmentProcess" :key="index"
                                class="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <!-- Step Order -->
                                <div
                                    class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                                    {{ index + 1 }}
                                </div>

                                <!-- Step Color Preview -->
                                <div :class="step.color" class="w-6 h-6 rounded-full"></div>

                                <!-- Step Name (Editable) -->
                                <div class="flex-1">
                                    <input v-if="editingIndex === index" v-model="editingName" @blur="saveEdit(index)"
                                        @keyup.enter="saveEdit(index)" @keyup.escape="cancelEdit"
                                        class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                                    <span v-else class="font-medium text-slate-700">{{ step.name }}</span>
                                </div>

                                <!-- Color Selector (when editing) -->
                                <div v-if="editingIndex === index" class="w-32">
                                    <select v-model="editingColor"
                                        class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-sm">
                                        <option value="bg-gray-400">회색</option>
                                        <option value="bg-red-500">빨강</option>
                                        <option value="bg-orange-500">주황</option>
                                        <option value="bg-yellow-500">노랑</option>
                                        <option value="bg-green-500">초록</option>
                                        <option value="bg-blue-500">파랑</option>
                                        <option value="bg-purple-500">보라</option>
                                        <option value="bg-pink-500">분홍</option>
                                        <option value="bg-indigo-500">남색</option>
                                        <option value="bg-cyan-500">청록</option>
                                    </select>
                                </div>

                                <!-- Actions -->
                                <div class="flex items-center gap-2">
                                    <button v-if="editingIndex !== index" @click="startEdit(index)"
                                        class="p-1 text-gray-400 hover:text-slate-600 transition-colors" title="수정">
                                        <Edit2 :size="16" />
                                    </button>

                                    <template v-if="editingIndex === index">
                                        <button @click="saveEdit(index)"
                                            class="p-1 text-green-600 hover:text-green-700 transition-colors"
                                            title="저장">
                                            <Check :size="16" />
                                        </button>
                                        <button @click="cancelEdit"
                                            class="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="취소">
                                            <X :size="16" />
                                        </button>
                                    </template>

                                    <button v-if="editingIndex !== index && recruitmentProcess.length > 1"
                                        @click="removeStep(index)"
                                        class="p-1 text-red-400 hover:text-red-600 transition-colors" title="삭제">
                                        <Trash2 :size="16" />
                                    </button>

                                    <!-- Move buttons -->
                                    <div v-if="editingIndex !== index" class="flex flex-col gap-1">
                                        <button v-if="index > 0" @click="moveStep(index, index - 1)"
                                            class="p-1 text-gray-400 hover:text-slate-600 transition-colors"
                                            title="위로 이동">
                                            <ChevronUp :size="14" />
                                        </button>
                                        <button v-if="index < recruitmentProcess.length - 1"
                                            @click="moveStep(index, index + 1)"
                                            class="p-1 text-gray-400 hover:text-slate-600 transition-colors"
                                            title="아래로 이동">
                                            <ChevronDown :size="14" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Save Changes -->
                    <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div class="text-sm text-gray-600">
                            변경사항은 자동으로 저장됩니다.
                        </div>
                        <div class="flex gap-3">
                            <button @click="resetToDefault"
                                class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                기본값으로 리셋
                            </button>
                            <button @click="saveProcessChanges"
                                class="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                                변경사항 저장
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
    ArrowLeft,
    Users,
    FileText,
    CheckCircle,
    Clock,
    Search,
    Filter,
    Building2,
    MapPin,
    Briefcase,
    DollarSign,
    Calendar,
    User,
    Mail,
    ChevronRight,
    Plus,
    Edit2,
    Trash2,
    Check,
    X,
    ChevronUp,
    ChevronDown
} from 'lucide-vue-next';

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

// Applicant List Data
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

// Process Setting Data
const newStepName = ref('');
const newStepColor = ref('bg-blue-500');
const editingIndex = ref(-1);
const editingName = ref('');
const editingColor = ref('');

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

const handleDelete = (): void => {
    if (confirm('정말로 이 공고를 삭제하시겠습니까?')) {
        console.log('공고 삭제')
    }
}

// Process Setting Methods
const addStep = () => {
    if (!newStepName.value.trim()) return;

    recruitmentProcess.value.push({
        name: newStepName.value.trim(),
        color: newStepColor.value
    });

    newStepName.value = '';
    newStepColor.value = 'bg-blue-500';
};

const startEdit = (index: number) => {
    editingIndex.value = index;
    editingName.value = recruitmentProcess.value[index].name;
    editingColor.value = recruitmentProcess.value[index].color;
};

const saveEdit = (index: number) => {
    if (!editingName.value.trim()) return;

    recruitmentProcess.value[index] = {
        name: editingName.value.trim(),
        color: editingColor.value
    };

    cancelEdit();
};

const cancelEdit = () => {
    editingIndex.value = -1;
    editingName.value = '';
    editingColor.value = '';
};

const removeStep = (index: number) => {
    if (recruitmentProcess.value.length <= 1) return;

    if (confirm('이 단계를 삭제하시겠습니까?')) {
        recruitmentProcess.value.splice(index, 1);
    }
};

const moveStep = (fromIndex: number, toIndex: number) => {
    const item = recruitmentProcess.value.splice(fromIndex, 1)[0];
    recruitmentProcess.value.splice(toIndex, 0, item);
};

const resetToDefault = () => {
    if (confirm('기본 프로세스로 리셋하시겠습니까? 현재 설정이 모두 삭제됩니다.')) {
        recruitmentProcess.value = [
            { name: '접수', color: 'bg-gray-400' },
            { name: '과제 평가', color: 'bg-orange-500' },
            { name: '직무 인터뷰', color: 'bg-yellow-500' },
            { name: '컬쳐핏 인터뷰', color: 'bg-green-500' },
            { name: '처우 협의', color: 'bg-cyan-500' },
            { name: '최종합격', color: 'bg-blue-500' }
        ];
    }
};

const saveProcessChanges = () => {
    console.log('프로세스 변경사항 저장됨:', recruitmentProcess.value);
    alert('프로세스가 성공적으로 저장되었습니다.');
};

const activeTab = ref('info');

const tabs = ref([
    { id: 'info', name: '공고 정보' },
    { id: 'applicants', name: '지원자 관리' },
    { id: 'applicants-list', name: '지원자 목록' },
    { id: 'post-schedule', name: '공고 일정' },
    { id: 'proccess-setting', name: '프로세스 설정' },
]);

onMounted(() => {
    console.log('채용 상세 페이지 로드');
});
</script>