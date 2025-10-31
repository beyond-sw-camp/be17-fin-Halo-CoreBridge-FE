<script setup lang="ts">
import { reactive, ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { JobPostingCreateRequest } from '@/types/jobPosting/JobPostingTypes'
import { createJobPosting, getDepartment } from '@/api/job-posting/index'
import draggable from 'vuedraggable'
import { GripVertical, Pencil, Trash2, Plus } from 'lucide-vue-next'

const router = useRouter()

// ===========================
// Types
// ===========================
interface StageEdit {
    id: number
    name: string
    color: string // Enum(ColorCode)
    edit: boolean
}

interface Department {
    id: number
    name: string
}

// ===========================
// Form State
// ===========================
const form = reactive<JobPostingCreateRequest>({
    title: '',
    employmentType: null,
    careerType: null,
    minExperience: undefined,
    maxExperience: undefined,
    positionLevel: '',
    location: '',
    applyStartDate: '',
    applyEndDate: '',
    hireEndDate: '',
    headcount: 0,
    summary: '',
    responsibilities: '',
    requirements: '',
    preferred: '',
    techStack: [] as string[],
    recruitProcess: [
        { name: '지원 완료', color: 'BLUE', orderIdx: 1 },
        { name: '서류 검토', color: 'ORANGE', orderIdx: 2 },
        { name: '1차 면접', color: 'PINK', orderIdx: 3 },
        { name: '2차 면접', color: 'PURPLE', orderIdx: 4 },
        { name: '최종 합격', color: 'RED', orderIdx: 5 },
    ],
    salaryType: null,
    salaryMin: undefined,
    salaryMax: undefined,
    salaryNegotiable: false,
    workingHours: '',
    benefits: '',
    departmentId: null,
    contactName: '',
    contactEmail: '',
    additionalInfo: '',
})

const department = ref<Department[]>([])
const errors = reactive<Record<string, string>>({})
const isSubmitting = ref(false)
const errorMessage = ref('')
const isLoading = ref(true)

// 채용프로세스의 시작과 끝 고정(색상만 변경 가능)
const fixedStart = reactive({ name: '지원 완료', color: 'BLUE', orderIdx: '' })
const fixedEnd = reactive({ name: '최종 합격', color: 'RED', orderIdx: '' })

// ===========================
// Tech Stack Management
// ===========================
const techInput = ref('')
const addTech = () => {
    const trimmed = techInput.value.trim()
    if (trimmed) {
        form.techStack.push(trimmed)
        techInput.value = ''
        errors.techStack = ''
    }
}
const removeTech = (i: number) => form.techStack.splice(i, 1)

// ===========================
// Recruitment Process
// ===========================
const baseColors = ['BLUE', 'ORANGE', 'PINK', 'PURPLE', 'RED']
const maxStages = ref(10)

const stages = ref<StageEdit[]>([
    { id: 1, name: '서류 검토', color: 'BLUE', edit: false },
    { id: 2, name: '1차 면접', color: 'ORANGE', edit: false },
    { id: 3, name: '2차 면접', color: 'PURPLE', edit: false },
])

//  객체 기반 동기화
const syncRecruitProcess = () => {
    // 중간단계 순서에 맞춰 orderIdx 재계산
    const middle = stages.value.map((s, idx) => ({
        id: idx + 1, // id는 순서대로 다시 매기기
        name: s.name,
        color: s.color,
        orderIdx: idx + 2, // 2부터 시작 (지원 완료가 1)
    }))

    // 전체 조합
    form.recruitProcess = [
        { name: fixedStart.name, color: fixedStart.color, orderIdx: 1 },
        ...middle,
        { name: fixedEnd.name, color: fixedEnd.color, orderIdx: middle.length + 2 },
    ]
}
watch(stages, syncRecruitProcess, { deep: true })

const addStage = () => {
    const newId = Math.max(0, ...stages.value.map(s => s.id)) + 1
    stages.value.push({
        id: newId,
        name: `새 단계 ${newId}`,
        color: 'PURPLE',
        edit: false,
    })
    syncRecruitProcess()
}

const editStage = (s: StageEdit) => {
    s.edit = !s.edit
    if (!s.edit) syncRecruitProcess()
}

// 중간단계 삭제
const deleteStage = (id: number) => {
    stages.value = stages.value.filter(s => s.id !== id)
    // id 다시 정렬 후 동기화
    stages.value = stages.value.map((s, idx) => ({ ...s, id: idx + 1 }))
    syncRecruitProcess()
}

const onDragEnd = () => {
    // 드래그 후 순서가 바뀌면 id와 orderIdx도 다시 세팅
    stages.value = stages.value.map((s, idx) => ({
        ...s,
        id: idx + 1,
    }))
    syncRecruitProcess()
}

// ===========================
// Navigation & Actions
// ===========================
const exit = () => {
    if (confirm('작성 중인 내용이 저장되지 않습니다. 정말 나가시겠습니까?')) {
        window.history.length > 1 ? router.back() : router.push({ name: 'recruiter-jobs' })
    }
}

const saveDraft = () => {
    console.log('임시 저장:', form)
}

// ===========================
// Form Submission
// ===========================
const toDateTime = (d?: string | null, end = false): string | null =>
    !d || d.trim() === '' ? null : `${d} ${end ? '23:59:59' : '00:00:00'}`

const submitForm = async () => {
    isSubmitting.value = true
    try {
        const payload: JobPostingCreateRequest = {
            ...form,
            headcount: Number(form.headcount) || 0,
            salaryMin: Number(form.salaryMin) || 0,
            salaryMax: Number(form.salaryMax) || 0,
            departmentId: Number(form.departmentId) || null,
            applyStartDate: toDateTime(form.applyStartDate, false) as any,
            applyEndDate: toDateTime(form.applyEndDate, true) as any,
            hireEndDate: toDateTime(form.hireEndDate, true) as any,
            recruitProcess: form.recruitProcess, // 
        }

        Object.keys(errors).forEach(k => (errors[k] = ''))

        const res = await createJobPosting(payload)

        if (res.success) {
            alert('채용공고 등록이 완료되었습니다!')
            router.push('/recruiter/jobs')
        } else {
            Object.assign(errors, res.results || {})
        }
    } catch (err) {
        console.error('등록 오류:', err)
        alert('서버 오류가 발생했습니다.')
    } finally {
        isSubmitting.value = false
    }
}

// ===========================
// Auto Clear Error
// ===========================
watch(
    () => ({ ...form }),
    (newVal) => {
        Object.keys(errors).forEach(key => {
            const val = (newVal as any)[key]
            const isEmptyArray = Array.isArray(val) && val.length === 0
            if (errors[key] && val !== '' && val !== null && !isEmptyArray) {
                errors[key] = ''
            }
        })
    },
    { deep: true }
)

// ===========================
// Computed
// ===========================
const isExperienced = computed(() => form.careerType === '경력')
const isExperienceInvalid = computed(() => form.careerType === '경력' && (!form.minExperience || !form.maxExperience))
const isSalaryInvalid = computed(() => form.salaryType === '고정급여' && (!form.salaryMin || !form.salaryMax))

// ===========================
// Load Departments
// ===========================
onMounted(async () => {
    try {
        const res = await getDepartment()
        if (res.success) department.value = res.results
        else errorMessage.value = res.message || '데이터를 불러오지 못했습니다.'
    } catch (err: any) {
        console.error(err)
        errorMessage.value = '서버오류 발생'
    } finally {
        isLoading.value = false
    }
})
</script>


<template>
    <div class="bg-gray-50 min-h-screen">
        <!-- Header -->
        <header class="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 h-20 z-10">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-slate-600">채용 공고 작성</h1>
                    <button
                        class="px-4 py-2 text-slate-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        @click="exit">
                        나가기
                    </button>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 my-20">
            <form class="space-y-8" @submit.prevent="submitForm">
                <!-- 기본 정보 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 class="text-xl font-bold text-slate-600 mb-6">기본 정보</h2>

                    <div class="space-y-6">
                        <!-- 제목 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                제목 <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.title" type="text" placeholder="예: 시니어 백엔드 개발자" :class="[
                                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent',
                                errors.title ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
                            ]" />
                            <p v-if="errors.title" class="text-sm text-red-500 mt-1">{{ errors.title }}</p>
                        </div>

                        <div class="grid grid-cols-2 gap-6">
                            <!-- 부서 -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    부서 <span class="text-red-500">*</span>
                                </label>
                                <select v-model="form.departmentId" :class="[
                                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent',
                                    errors.departmentId ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
                                ]">
                                    <option disabled value=null>부서 선택</option>
                                    <option v-for="dept in department" :key="dept.id" :value="dept.id">
                                        {{ dept.name }}
                                    </option>
                                </select>
                                <p v-if="errors.departmentId" class="text-sm text-red-500 mt-1">{{ errors.departmentId
                                    }}</p>
                            </div>

                            <!-- 고용 형태 -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    고용 형태 <span class="text-red-500">*</span>
                                </label>
                                <select v-model="form.employmentType" :class="[
                                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent',
                                    errors.employmentType ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
                                ]">
                                    <option :value="null">고용 형태 선택</option>
                                    <option value="정규직">정규직</option>
                                    <option value="계약직">계약직</option>
                                    <option value="인턴">인턴</option>
                                </select>
                                <p v-if="errors.employmentType" class="text-sm text-red-500 mt-1">{{
                                    errors.employmentType }}</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-6">
                            <!-- 경력 요건 -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    경력 요건 <span class="text-red-500">*</span>
                                </label>
                                <select v-model="form.careerType" :class="[
                                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent',
                                    errors.careerType ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
                                ]">
                                    <option :value="null">경력 선택</option>
                                    <option value="신입">신입</option>
                                    <option value="경력">경력</option>
                                    <option value="경력무관">경력 무관</option>
                                </select>

                                <!-- 경력 선택 안 했을 때 -->
                                <p v-if="errors.careerType" class="text-sm text-red-500 mt-1">
                                    {{ errors.careerType }}
                                </p>

                                <!-- 경력직 선택 시 세부 입력창 -->
                                <transition name="fade">
                                    <div v-if="isExperienced" class="mt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">최소 경력
                                                (년)</label>
                                            <input v-model="form.minExperience" type="number" min="0" placeholder="예: 1"
                                                :class="[
                                                    'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent',
                                                    (form.careerType === '경력' && (!form.minExperience || !form.maxExperience))
                                                        ? 'border-red-300 focus:ring-red-300'
                                                        : 'border-gray-300 focus:ring-slate-600'
                                                ]" />
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">최대 경력
                                                (년)</label>
                                            <input v-model="form.maxExperience" type="number" min="0" placeholder="예: 5"
                                                :class="[
                                                    'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent',
                                                    (form.careerType === '경력' && (!form.minExperience || !form.maxExperience))
                                                        ? 'border-red-300 focus:ring-red-300'
                                                        : 'border-gray-300 focus:ring-slate-600'
                                                ]" />
                                        </div>

                                        <p v-if="form.careerType === '경력' && (!form.minExperience || !form.maxExperience)"
                                            class="col-span-2 text-sm text-red-500 mt-1">
                                            경력직일 경우 최소/최대 경력을 모두 입력해주세요.
                                        </p>
                                    </div>
                                </transition>
                            </div>


                            <!-- 직급 -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">직급</label>
                                <input v-model="form.positionLevel" type="text" placeholder="예: 주임, 대리, 과장"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600" />
                            </div>
                        </div>

                        <!-- 근무 지역 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                근무 지역 <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.location" type="text" placeholder="예: 서울시 강남구 테헤란로 123" :class="[
                                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent',
                                errors.location ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
                            ]" />
                            <p v-if="errors.location" class="text-sm text-red-500 mt-1">{{ errors.location }}</p>
                        </div>

                        <!-- 날짜 & 모집 인원 -->
                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    접수 시작일 <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.applyStartDate" type="date" :class="[
                                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent',
                                    errors.applyStartDate ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
                                ]" />
                                <p v-if="errors.applyStartDate" class="text-sm text-red-500 mt-1">{{
                                    errors.applyStartDate }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    접수 종료일 <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.applyEndDate" type="date" :class="[
                                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent',
                                    errors.applyEndDate ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
                                ]" />
                                <p v-if="errors.applyEndDate" class="text-sm text-red-500 mt-1">{{ errors.applyEndDate
                                    }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    마감일 <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.hireEndDate" type="date" :class="[
                                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent',
                                    errors.hireEndDate ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
                                ]" />
                                <p v-if="errors.hireEndDate" class="text-sm text-red-500 mt-1">{{ errors.hireEndDate }}
                                </p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">모집 인원</label>
                                <input v-model="form.headcount" type="number" placeholder="예: 2"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600" />
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 상세 설명 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 class="text-xl font-bold text-slate-600 mb-6">상세 설명</h2>

                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                직무 소개 <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="form.summary" rows="6" placeholder="예시)
- 당사는 새로운 기술 도입에 적극적인 백엔드 개발자를 찾고 있습니다.
- 주요 서비스의 API 설계 및 성능 최적화를 담당합니다.
- 다양한 팀과 협업하며 안정적이고 확장 가능한 시스템을 구축합니다." :class="[
    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent resize-none',
    errors.summary ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600',
    'placeholder:text-left placeholder:whitespace-pre-line placeholder:text-gray-400'
]"></textarea>
                            <p v-if="errors.summary" class="text-sm text-red-500 mt-1">{{ errors.summary }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                주요 업무 <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="form.responsibilities" rows="6" placeholder="예시)
- CRUD 기능 구현
- 최적화된 쿼리 작성
- 성능 개선 및 리팩토링" :class="[
    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent resize-none',
    'placeholder:text-left placeholder:whitespace-pre-line placeholder:text-gray-400',
    errors.responsibilities ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
]"></textarea>
                            <p v-if="errors.responsibilities" class="text-sm text-red-500 mt-1">{{
                                errors.responsibilities }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                필수 자격 요건 <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="form.requirements" rows="6" placeholder="예시)
- Vue 3, TypeScript 실무 경험
- REST API 연동 및 비동기 처리에 대한 이해
- Git, Jira 등 협업 툴 사용 경험" :class="[
    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent resize-none',
    'placeholder:text-left placeholder:whitespace-pre-line placeholder:text-gray-400',
    errors.requirements ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
]"></textarea>
                            <p v-if="errors.requirements" class="text-sm text-red-500 mt-1">{{ errors.requirements }}
                            </p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                우대 사항 <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="form.preferred" rows="4" placeholder="예시)
- 대규모 트래픽 서비스 경험
- AWS 또는 클라우드 환경 운영 경험
- CI/CD 파이프라인 구축 경험" :class="[
    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent resize-none',
    'placeholder:text-left placeholder:whitespace-pre-line placeholder:text-gray-400',
    errors.preferred ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
]"></textarea>
                            <p v-if="errors.preferred" class="text-sm text-red-500 mt-1">{{ errors.preferred }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                기술 스택 <span class="text-red-500">*</span>
                            </label>
                            <div class="flex gap-2 mb-3">
                                <input v-model="techInput" type="text" placeholder="기술 스택 추가 후 Enter"
                                    @keydown.enter.prevent="addTech" :class="[
                                        'w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:border-transparent resize-none',
                                        'placeholder:text-left placeholder:whitespace-pre-line placeholder:text-gray-400',
                                        errors.techStack ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
                                    ]" />
                                <button type="button"
                                    class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 whitespace-nowrap"
                                    @click="addTech">
                                    추가
                                </button>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="(tech, i) in form.techStack" :key="i"
                                    class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                                    {{ tech }}
                                    <button type="button" @click="removeTech(i)" class="hover:text-blue-900">✕</button>
                                </span>
                            </div>
                            <p v-if="errors.techStack" class="text-sm text-red-500 mt-1">{{ errors.techStack }}</p>
                        </div>
                    </div>
                </section>

                <!-- 근무 조건 및 복리후생 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 class="text-xl font-bold text-slate-600 mb-6">근무 조건 및 복리후생</h2>

                    <div class="space-y-6">
                        <!-- 급여 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">급여</label>

                            <!-- 급여 형태 -->
                            <div class="grid grid-cols-3 gap-4 mb-3">
                                <select v-model="form.salaryType" :class="[
                                    'px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent',
                                    errors.salaryType ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
                                ]">
                                    <option :value="null">급여 형태 선택</option>
                                    <option value="연봉">연봉</option>
                                    <option value="월급">월급</option>
                                    <option value="시급">시급</option>
                                </select>
                            </div>

                            <!-- 급여 옵션 -->
                            <div class="flex items-center gap-6 mb-4">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" v-model="form.salaryNegotiable" :value="false"
                                        class="text-slate-600 border-gray-300 focus:ring-slate-600" />
                                    <span class="text-gray-700 text-sm">고정 급여</span>
                                </label>

                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" v-model="form.salaryNegotiable" :value="true"
                                        class="text-slate-600 border-gray-300 focus:ring-slate-600" />
                                    <span class="text-gray-700 text-sm">면접 후 결정</span>
                                </label>
                            </div>

                            <!-- 고정급여 선택 시만 최소/최대 표시 -->
                            <transition name="fade">
                                <div v-if="form.salaryType && !form.salaryNegotiable" class="grid grid-cols-2 gap-4">
                                    <input v-model="form.salaryMin" type="text" placeholder="최소 금액 (만원)" :class="[
                                        'px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent',
                                        (form.salaryType && !form.salaryNegotiable && (!form.salaryMin || !form.salaryMax))
                                            ? 'border-red-300 focus:ring-red-300'
                                            : 'border-gray-300 focus:ring-slate-600'
                                    ]" />
                                    <input v-model="form.salaryMax" type="text" placeholder="최대 금액 (만원)" :class="[
                                        'px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent',
                                        (form.salaryType && !form.salaryNegotiable && (!form.salaryMin || !form.salaryMax))
                                            ? 'border-red-300 focus:ring-red-300'
                                            : 'border-gray-300 focus:ring-slate-600'
                                    ]" />
                                </div>
                            </transition>

                            <p v-if="form.salaryType && !form.salaryNegotiable && (!form.salaryMin || !form.salaryMax)"
                                class="text-sm text-red-500 mt-1">
                                고정 급여일 경우 최소/최대 금액을 모두 입력해주세요.
                            </p>
                        </div>


                        <!-- 근무 시간 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                근무 시간 <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.workingHours" type="text" placeholder="예: 09:00 - 18:00 (주 5일)" :class="[
                                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent',
                                errors.workingHours ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
                            ]" />
                            <p v-if="errors.workingHours" class="text-sm text-red-500 mt-1">{{ errors.workingHours }}
                            </p>
                        </div>

                        <!-- 복리후생 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                복리후생 <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="form.benefits" rows="5" placeholder="예시)
- 중식 제공
- 자율 출퇴근 제도
- 재택근무 가능
- 교육비 및 도서비 지원" :class="[
    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent resize-none',
    'placeholder:text-left placeholder:whitespace-pre-line placeholder:text-gray-400',
    errors.benefits ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
]"></textarea>
                            <p v-if="errors.benefits" class="text-sm text-red-500 mt-1">{{ errors.benefits }}</p>
                        </div>
                    </div>
                </section>

                <!-- 채용 프로세스 설정 -->
                <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 class="text-xl font-bold text-slate-700 mb-6">채용 프로세스 설정</h2>

                    <!-- 지원 완료 (고정 이름 + 색상 선택 가능) -->
                    <div
                        class="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 mb-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div class="flex items-center gap-3">
                            <span class="w-3.5 h-3.5 rounded-full"
                                :class="`bg-${fixedStart.color.toLowerCase()}-500`"></span>
                            <span class="text-slate-700 font-medium text-sm">지원 완료</span>
                        </div>
                        <select v-model="fixedStart.color"
                            class="border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-700 focus:ring-2 focus:ring-slate-300 focus:outline-none"
                            @change="syncRecruitProcess">
                            <option v-for="color in baseColors" :key="color" :value="color">{{ color }}</option>
                        </select>
                    </div>

                    <hr class="my-4" />

                    <!-- 중간 단계 (드래그 가능) -->
                    <draggable v-model="stages" item-key="id" handle=".drag-handle" animation="200" @end="onDragEnd">
                        <template #item="{ element: stage }">
                            <div
                                class="border border-gray-200 rounded-lg px-4 py-3 mb-3 bg-white hover:shadow-sm hover:border-slate-300 transition-all">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <GripVertical :size="18" class="text-gray-400 drag-handle cursor-grab" />
                                        <div class="flex items-center gap-2">
                                            <span class="w-3.5 h-3.5 rounded-full"
                                                :class="`bg-${stage.color.toLowerCase()}-500`"></span>

                                            <!-- 단계명 -->
                                            <input v-if="stage.edit" v-model="stage.name" type="text"
                                                @focusout="editStage(stage)"
                                                class="border-b border-gray-300 focus:border-slate-400 focus:outline-none px-1 py-0.5 text-slate-700 font-medium text-sm bg-transparent" />
                                            <span v-else class="text-slate-700 font-medium text-sm tracking-tight">
                                                {{ stage.name }}
                                            </span>

                                            <!-- 색상 선택 -->
                                            <select v-model="stage.color"
                                                class="ml-2 border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-700 focus:ring-2 focus:ring-slate-300 focus:outline-none"
                                                @change="syncRecruitProcess">
                                                <option v-for="color in baseColors" :key="color" :value="color">
                                                    {{ color }}
                                                </option>
                                            </select>

                                            <!-- 수정 버튼 -->
                                            <button type="button" @click="editStage(stage)"
                                                class="text-gray-400 hover:text-slate-600 transition-colors ml-1">
                                                <Pencil :size="14" />
                                            </button>
                                        </div>
                                    </div>

                                    <!-- 삭제 버튼 -->
                                    <button type="button" @click="deleteStage(stage.id)"
                                        class="text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 :size="15" />
                                    </button>
                                </div>
                            </div>
                        </template>
                    </draggable>

                    <!-- 단계 추가 -->
                    <div class="flex justify-center mt-6">
                        <button type="button" @click="addStage"
                            class="flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-all text-sm font-medium">
                            <div class="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center">
                                <Plus :size="14" class="text-white" />
                            </div>
                            <span>단계 추가 ({{ stages.length }}/10)</span>
                        </button>
                    </div>

                    <!-- 최종 합격 (고정 이름 + 색상 선택 가능) -->
                    <div
                        class="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 mt-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div class="flex items-center gap-3">
                            <span class="w-3.5 h-3.5 rounded-full"
                                :class="`bg-${fixedEnd.color.toLowerCase()}-500`"></span>
                            <span class="text-slate-700 font-medium text-sm">최종 합격</span>
                        </div>
                        <select v-model="fixedEnd.color"
                            class="border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-700 focus:ring-2 focus:ring-slate-300 focus:outline-none"
                            @change="syncRecruitProcess">
                            <option v-for="color in baseColors" :key="color" :value="color">
                                {{ color }}
                            </option>
                        </select>
                    </div>
                </section>



                <!-- 추가 정보 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 class="text-xl font-bold text-slate-600 mb-6">추가 정보</h2>

                    <div class="space-y-6">
                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    담당자 이름 <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.contactName" type="text" placeholder="예: 홍길동" :class="[
                                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent',
                                    errors.contactName ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
                                ]" />
                                <p v-if="errors.contactName" class="text-sm text-red-500 mt-1">{{ errors.contactName }}
                                </p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    담당자 이메일 <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.contactEmail" type="email" placeholder="예: hr@company.com" :class="[
                                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent',
                                    errors.contactEmail ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
                                ]" />
                                <p v-if="errors.contactEmail" class="text-sm text-red-500 mt-1">{{ errors.contactEmail
                                    }}</p>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">기타 안내사항</label>
                            <textarea v-model="form.additionalInfo" rows="4" placeholder="예시)
- 포트폴리오 또는 GitHub 링크를 함께 제출해주세요.
- 서류 합격자에게는 개별적으로 면접 일정을 안내드립니다." :class="[
    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent resize-none',
    'placeholder:text-left placeholder:whitespace-pre-line placeholder:text-gray-400',
    errors.additionalInfo ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
]"></textarea>
                            <p v-if="errors.additionalInfo" class="text-sm text-red-500 mt-1">{{ errors.additionalInfo
                                }}</p>
                        </div>
                    </div>
                </section>

                <!-- 하단 버튼 -->
                <div class="flex items-center justify-end gap-3">
                    <button
                        class="px-4 py-2 text-slate-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        type="button" @click="saveDraft">
                        임시 저장
                    </button>
                    <button
                        class="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium "
                        type="submit" :disabled="isSubmitting">
                        {{ isSubmitting ? '등록 중...' : '공고 등록' }}
                    </button>
                </div>
            </form>
        </main>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>