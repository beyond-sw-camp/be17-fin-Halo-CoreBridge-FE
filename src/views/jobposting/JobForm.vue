<script setup lang="ts">
import { reactive, ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { GripVertical, Pencil, Trash2, Plus } from 'lucide-vue-next'
import TechStackSelectButton from '@/components/techstack/TechStackSelectButton.vue'
import { createJobPosting, updateJobPosting, getDepartment } from '@/api/jobposting/index'
import { getTechStack } from '@/api/teck-stack'
import type { JobPostingCreateRequest, JobPostingDetailResponse } from '@/types/jobposting/JobPostingTypes'
import type { Account } from '@/types/user/Account'
import AccountAddInterviewerModal from '@/components/recruiter-dashboard/accounts/AccountAddInterviewerModal.vue'

/* ============================================================
 * Props / Emits
 * ============================================================ */
const props = defineProps<{
    mode: 'create' | 'edit'
    initialData?: JobPostingDetailResponse
}>()
const emit = defineEmits(['completed'])

/* ============================================================
 * Form / State
 * ============================================================ */
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
    coverLetterTitles: [{ title: '', subtitle: '' }],
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
    interviewers: [] as number[],
})

const router = useRouter()
const department = ref<{ id: number; name: string }[]>([])
const errors = reactive<Record<string, string>>({})
const isSubmitting = ref(false)
const isLoading = ref(true)
const errorMessage = ref('')

/* ============================================================
 * 01. 기술 스택 관리
 * ============================================================ */

const techOptions = ref<{ code: string; label: string }[]>([])

// 기술스택 제거 함수 (부모 → chip에서 삭제)
const removeTech = (code: string) => {
    form.techStack = form.techStack.filter(v => v !== code)
}


/* ============================================================
 * 02. 채용 프로세스 관리 (드래그 / 추가 / 삭제)
 * ============================================================ */
interface StageEdit {
    id: number
    name: string
    color: string
    edit: boolean
}

const fixedStart = reactive({ name: '지원 완료', color: 'BLUE', orderIdx: '' })
const fixedEnd = reactive({ name: '최종 합격', color: 'RED', orderIdx: '' })
const stages = ref<StageEdit[]>([
    { id: 1, name: '서류 검토', color: 'BLUE', edit: false },
    { id: 2, name: '1차 면접', color: 'ORANGE', edit: false },
    { id: 3, name: '2차 면접', color: 'PURPLE', edit: false },
])

const baseColors = ['BLUE', 'ORANGE', 'PINK', 'PURPLE', 'RED']

const syncRecruitProcess = () => {
    const middle = stages.value.map((s, idx) => ({
        id: idx + 1,
        name: s.name,
        color: s.color,
        orderIdx: idx + 2,
    }))
    form.recruitProcess = [
        { name: fixedStart.name, color: fixedStart.color, orderIdx: 1 },
        ...middle,
        { name: fixedEnd.name, color: fixedEnd.color, orderIdx: middle.length + 2 },
    ]
}
watch(stages, syncRecruitProcess, { deep: true })

const addStage = () => {
    const newId = Math.max(0, ...stages.value.map(s => s.id)) + 1
    stages.value.push({ id: newId, name: `새 단계 ${newId}`, color: 'PURPLE', edit: false })
    syncRecruitProcess()
}
const editStage = (s: StageEdit) => (s.edit = !s.edit)
const deleteStage = (id: number) => {
    stages.value = stages.value.filter(s => s.id !== id).map((s, idx) => ({ ...s, id: idx + 1 }))
    syncRecruitProcess()
}
const onDragEnd = () => {
    stages.value = stages.value.map((s, idx) => ({ ...s, id: idx + 1 }))
    syncRecruitProcess()
}

/* ============================================================
 * 03. 자기소개서 문항 관리
 * ============================================================ */
const addQuestion = () => form.coverLetterTitles.push({ title: '', subtitle: '' })
const removeQuestion = (index: number) => form.coverLetterTitles.splice(index, 1)
const isPreviewOpen = ref(false)

/* ============================================================
 * 04. 주소 검색 (카카오 API)
 * ============================================================ */
function openAddressSearch() {
    new (window as any).daum.Postcode({
        oncomplete: (data: any) => {
            const addr = data.roadAddress ? data.roadAddress : data.jibunAddress
            form.location = addr
        },
    }).open()
}

/* ============================================================
 * 05. 모집 일정 (날짜 + 시간 결합)
 * ============================================================ */
const applyStartDateOnly = ref('')
const applyStartTimeOnly = ref('')
const applyEndDateOnly = ref('')
const applyEndTimeOnly = ref('')
const hireEndDateOnly = ref('')
const hireEndTimeOnly = ref('')

watch(
    [
        applyStartDateOnly,
        applyStartTimeOnly,
        applyEndDateOnly,
        applyEndTimeOnly,
        hireEndDateOnly,
        hireEndTimeOnly,
    ],
    () => {
        // 날짜와 시간을 "2025-11-13 22:48:00" 형식으로 변환
        const formatDateTime = (date: string, time: string) => {
            if (!date || !time) return ''
            return `${date} ${time}:00` //  'T' 대신 공백, 초는 00 고정
        }

        form.applyStartDate = formatDateTime(applyStartDateOnly.value, applyStartTimeOnly.value)
        form.applyEndDate = formatDateTime(applyEndDateOnly.value, applyEndTimeOnly.value)
        form.hireEndDate = formatDateTime(hireEndDateOnly.value, hireEndTimeOnly.value)
    },
    { deep: true }
)


/* ============================================================
 * 06. 면접관 관리
 * ============================================================ */
const addInterviewers = ref<Account[]>([])
const extractInitial = (name: string) => name.charAt(0).toUpperCase()
const isOpenInterviewerAddModal = ref(false)
const openInterviewerAddModal = () => (isOpenInterviewerAddModal.value = true)
const closeInterviewerAddModal = () => (isOpenInterviewerAddModal.value = false)

const addInterviewersToForm = (accounts: Account[]) => {
    addInterviewers.value = accounts
    const newIds = accounts.map(acc => acc.id)
    form.interviewers = Array.from(new Set([...form.interviewers, ...newIds]))
}
const deleteInterviewer = (accountId: number) => {
    form.interviewers = form.interviewers.filter(id => id !== accountId)
    addInterviewers.value = addInterviewers.value.filter(acc => acc.id !== accountId)
}

/* ============================================================
 * 07. 네비게이션 / 제출 로직
 * ============================================================ */
const exit = () => {
    if (confirm('작성 중인 내용이 저장되지 않습니다. 정말 나가시겠습니까?')) {
        window.history.length > 1 ? router.back() : router.push({ name: 'recruiter-jobs' })
    }
}

const submitForm = async () => {
    isSubmitting.value = true
    try {
        const payload: JobPostingCreateRequest = {
            ...form,
            headcount: Number(form.headcount) || 0,
            salaryMin: Number(form.salaryMin) || 0,
            salaryMax: Number(form.salaryMax) || 0,
            departmentId: Number(form.departmentId) || null,
            applyStartDate: form.applyStartDate,
            applyEndDate: form.applyEndDate,
            hireEndDate: form.hireEndDate,
        }

        Object.keys(errors).forEach(k => (errors[k] = ''))

        const res =
            props.mode === 'create'
                ? await createJobPosting(payload)
                : await updateJobPosting(props.initialData!.id, payload)

        if (res.success) {
            alert(props.mode === 'create' ? '채용공고 등록이 완료되었습니다!' : '채용공고 수정이 완료되었습니다!')
            emit('completed')
        } else {
            Object.assign(errors, res.results || {})
        }
    } catch (err) {
        console.error('요청 오류:', err)
        alert('서버 오류가 발생했습니다.')
    } finally {
        isSubmitting.value = false
    }
}

/* ============================================================
 * 08. 에러 자동 초기화
 * ============================================================ */
watch(
    () => ({ ...form }),
    (newVal) => {
        Object.keys(errors).forEach(key => {
            const val = (newVal as any)[key]
            const isEmptyArray = Array.isArray(val) && val.length === 0
            if (errors[key] && val !== '' && val !== null && !isEmptyArray) errors[key] = ''
        })
    },
    { deep: true }
)

/* ============================================================
 * 09. computed / 수정 모드 초기화
 * ============================================================ */
const isExperienced = computed(() => form.careerType === '경력')
const isExperienceInvalid = computed(() => form.careerType === '경력' && (!form.minExperience || !form.maxExperience))
const isSalaryInvalid = computed(() => form.salaryType === '고정급여' && (!form.salaryMin || !form.salaryMax))

/* ============================================================
 * 10. api 호출하기
 * ============================================================ */
const loadDepartment = async () => {
    const res = await getDepartment()
    if (res.success) {
        department.value = res.results
    }
}

const loadTechStacks = async () => {
    const res = await getTechStack()
    if (res.success) {
        techOptions.value = res.results  // [{code, label}]
    }
}

const loadEditDataIfNeeded = async () => {
    if (props.mode !== 'edit' || !props.initialData) return

    const transformed = {
        ...props.initialData,

        recruitProcess: props.initialData.recruitProcess.map(proc => ({
            id: proc.id,
            name: proc.name,
            color: proc.colorCode?.name || 'BLUE',
            orderIdx: proc.orderIdx,
        })),

        coverLetterTitles: props.initialData.coverLetterTitles.map(q => ({
            id: q.id,
            title: q.title,
            subtitle: q.subtitle,
        })),
    }

    Object.assign(form, transformed)

    // 채용 단계 UI 세팅
    stages.value = transformed.recruitProcess
        .filter(p => p.name !== '지원 완료' && p.name !== '최종 합격')
        .map((p, idx) => ({
            id: idx + 1,
            name: p.name,
            color: p.color,
            edit: false,
        }))

    const start = transformed.recruitProcess.find(p => p.name === '지원 완료')
    const end = transformed.recruitProcess.find(p => p.name === '최종 합격')

    if (start) fixedStart.color = start.color
    if (end) fixedEnd.color = end.color

    syncRecruitProcess()
}

onMounted(async () => {
    try {
        await loadDepartment()
        await loadTechStacks()
        await loadEditDataIfNeeded()
    } catch (err) {
        console.error(err)
        errorMessage.value = '서버 오류 발생'
    } finally {
        isLoading.value = false
    }
})

</script>




<template>
    <div class="bg-gray-50 min-h-screen">
        <AccountAddInterviewerModal @close="closeInterviewerAddModal" :open-modal="isOpenInterviewerAddModal"
            @add="addInterviewersToForm" />

        <!-- Header -->
        <header class="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 h-20 z-10">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-slate-600">
                        {{ props.mode === 'edit' ? '채용 공고 수정' : '채용 공고 작성' }}
                    </h1>
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

                            <div class="flex gap-2">
                                <!-- 주소 입력 필드 -->
                                <input v-model="form.location" type="text" placeholder="주소 검색을 통해 선택해주세요" readonly
                                    :class="[
                                        'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-gray-50',
                                        errors.location ? 'border-red-300 focus:ring-red-300' : 'border-gray-300 focus:ring-slate-600'
                                    ]" />

                                <!-- 주소 검색 버튼 -->
                                <button type="button" @click="openAddressSearch"
                                    class="px-3 py-1.5 text-sm bg-slate-600 text-white rounded-md hover:bg-slate-700 whitespace-nowrap">
                                    주소 검색
                                </button>
                            </div>

                            <p v-if="errors.location" class="text-sm text-red-500 mt-1">
                                {{ errors.location }}
                            </p>
                        </div>

                        <!-- 모집 일정 & 인원 -->
                        <div class="space-y-8">
                            <label class="block text-base font-semibold text-gray-800">
                                모집 일정 및 인원
                            </label>

                            <!-- 접수 시작일 -->
                            <div class="flex flex-col space-y-2">
                                <label class="text-sm text-gray-600">접수 시작일 <span class="text-red-500">*</span></label>
                                <div class="flex flex-col sm:flex-row gap-3">
                                    <input type="date" v-model="applyStartDateOnly"
                                        class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-transparent" />
                                    <input type="time" v-model="applyStartTimeOnly"
                                        class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-transparent" />
                                </div>
                                <p v-if="errors.applyStartDate" class="text-xs text-red-500 mt-1">{{
                                    errors.applyStartDate }}</p>
                            </div>

                            <!-- 접수 마감일 -->
                            <div class="flex flex-col space-y-2">
                                <label class="text-sm text-gray-600">접수 마감일 <span class="text-red-500">*</span></label>
                                <div class="flex flex-col sm:flex-row gap-3">
                                    <input type="date" v-model="applyEndDateOnly"
                                        class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-transparent" />
                                    <input type="time" v-model="applyEndTimeOnly"
                                        class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-transparent" />
                                </div>
                                <p v-if="errors.applyEndDate" class="text-xs text-red-500 mt-1">{{ errors.applyEndDate
                                    }}</p>
                            </div>

                            <!-- 채용 마감일 -->
                            <div class="flex flex-col space-y-2">
                                <label class="text-sm text-gray-600">채용 마감일 <span class="text-red-500">*</span></label>
                                <div class="flex flex-col sm:flex-row gap-3">
                                    <input type="date" v-model="hireEndDateOnly"
                                        class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-transparent" />
                                    <input type="time" v-model="hireEndTimeOnly"
                                        class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-transparent" />
                                </div>
                                <p v-if="errors.hireEndDate" class="text-xs text-red-500 mt-1">{{ errors.hireEndDate }}
                                </p>
                            </div>

                            <!-- 모집 인원 -->
                            <div class="flex flex-col space-y-2">
                                <label class="text-sm text-gray-600">모집 인원</label>
                                <input v-model="form.headcount" type="number" placeholder="예: 3" min="0"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-transparent" />
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

                <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
                    <h2 class="text-xl font-bold text-slate-700 mb-6">기술 스택 설정</h2>

                    <p class="text-sm text-gray-500 mb-4">
                        해당 채용 공고에 필요한 기술스택을 등록해주세요
                    </p>

                    <div class="flex flex-col items-center gap-4">

                        <!-- 버튼만 표시 -->
                        <div class="w-full flex justify-center">
                            <TechStackSelectButton v-model="form.techStack" :options="techOptions" />
                        </div>

                        <!-- 선택된 기술스택 카드 목록 -->
                        <div class="mt-4 flex flex-col space-y-3 w-full">

                            <!-- 아무것도 없을 때 -->
                            <p v-if="form.techStack.length === 0"
                                class="text-center text-slate-500 text-sm py-6 border border-gray-200 rounded-xl">
                                등록된 기술스택이 없습니다.
                            </p>

                            <!-- 선택된 기술스택 카드 -->
                            <div v-for="code in form.techStack" :key="code"
                                class="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition">

                                <!-- 왼쪽 부분 -->
                                <div class="flex items-center space-x-4">
                                    <div
                                        class="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                                        <span class="text-white font-bold text-sm">
                                            {{techOptions.find(t => t.code === code)?.label.charAt(0)}}
                                        </span>
                                    </div>

                                    <div>
                                        <p class="font-semibold text-slate-800">
                                            {{techOptions.find(t => t.code === code)?.label}}
                                        </p>
                                    </div>
                                </div>

                                <!-- 삭제 버튼 -->
                                <button @click="removeTech(code)" class="text-slate-500 hover:text-red-500 transition">
                                    <Trash2 :size="20" />
                                </button>
                            </div>
                        </div>

                        <!-- 오류 메시지 -->
                        <p v-if="errors.techStack" class="text-sm text-red-500 mt-1">
                            {{ errors.techStack }}
                        </p>
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
                                    <!-- 왼쪽 영역 -->
                                    <div class="flex items-center gap-3 w-full">
                                        <!-- 드래그 핸들 -->
                                        <GripVertical :size="18" class="text-gray-400 drag-handle cursor-grab" />

                                        <!-- 색상 미리보기 -->
                                        <span class="w-3.5 h-3.5 rounded-full"
                                            :class="`bg-${stage.color.toLowerCase()}-500`"></span>

                                        <!-- 단계명 + 색상 드롭다운 -->
                                        <div class="flex items-center gap-2 w-full">
                                            <input v-if="stage.edit" v-model="stage.name" type="text"
                                                @focusout="editStage(stage)" placeholder="단계명 입력 (예: 1차 면접)"
                                                class="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-600 focus:border-transparent text-slate-700 w-full" />
                                            <span v-else
                                                class="text-slate-700 font-medium text-sm tracking-tight cursor-pointer flex-grow"
                                                @click="editStage(stage)">
                                                {{ stage.name }}
                                            </span>

                                            <select v-model="stage.color"
                                                class="border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-700 focus:ring-2 focus:ring-slate-300 focus:outline-none min-w-[90px]"
                                                @change="syncRecruitProcess">
                                                <option v-for="color in baseColors" :key="color" :value="color">{{ color
                                                }}</option>
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
                                        class="text-gray-400 hover:text-red-500 transition-colors ml-3">
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
                            <option v-for="color in baseColors" :key="color" :value="color">{{ color }}</option>
                        </select>
                    </div>
                </section>

                <!--  이력서 문항 설정 -->
                <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 class="text-xl font-bold text-slate-700 mb-6">이력서 문항 설정</h2>

                    <!-- 안내 문구 -->
                    <p class="text-sm text-gray-500 mb-4">
                        지원자가 이 공고에 지원할 때 작성해야 하는 자기소개서 문항을 최소 3가지 이상 등록해주세요.
                    </p>

                    <!-- 이력서 문항 미리보기 버튼 -->
                    <div class="flex justify-end gap-3 mt-6">
                        <button type="button" @click="addQuestion"
                            class="flex items-center justify-center gap-2 px-5 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition text-sm font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                            문항 추가
                        </button>

                        <!--  미리보기 버튼 -->
                        <button type="button" @click="isPreviewOpen = true"
                            class="flex items-center justify-center gap-2 px-5 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition text-sm font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            미리보기
                        </button>
                    </div>
                    <div class="mt-4"></div>

                    <!--  미리보기 다이얼로그 -->
                    <transition name="fade">
                        <div v-if="isPreviewOpen"
                            class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20">
                            <!-- 모달 콘텐츠 -->
                            <div
                                class="bg-white w-full max-w-lg mx-4 rounded-xl shadow-xl p-6 relative overflow-y-auto max-h-[80vh] border border-gray-200">
                                <!-- 닫기 버튼 -->
                                <button @click="isPreviewOpen = false"
                                    class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition">
                                    ✕
                                </button>

                                <h3 class="text-lg font-semibold text-slate-700 mb-4">🧾 이력서 문항 미리보기</h3>

                                <div v-if="form.coverLetterTitles.length === 0"
                                    class="text-sm text-gray-500 text-center py-8">
                                    등록된 문항이 없습니다.
                                </div>

                                <!-- 미리보기 항목 -->
                                <div v-for="(q, index) in form.coverLetterTitles" :key="index"
                                    class="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
                                    <p class="font-semibold text-slate-700 text-sm mb-2">
                                        Q{{ index + 1 }}. {{ q.title || '제목 미입력' }}
                                    </p>
                                    <p class="text-gray-500 text-sm mb-3">{{ q.subtitle || '부제목 미입력' }}</p>
                                    <textarea placeholder="여기에 지원자가 답변을 작성합니다." rows="4"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-600 focus:border-transparent"></textarea>
                                </div>
                            </div>
                        </div>
                    </transition>

                    <!-- 문항 리스트 -->
                    <div class="space-y-4">
                        <div v-for="(q, index) in form.coverLetterTitles" :key="index"
                            class="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                            <!-- 삭제 버튼 -->
                            <button type="button" @click="removeQuestion(index)"
                                class="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition">
                                ✕
                            </button>

                            <div class="flex items-center gap-2 mb-3">
                                <span class="font-semibold text-slate-600">Q{{ index + 1 }}.</span>
                                <input v-model="q.title" type="text" placeholder="큰 제목 (예: 지원동기)"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-transparent text-sm" />
                            </div>

                            <input v-model="q.subtitle" type="text" placeholder="부제목 (예: 이 직무에 지원하게 된 이유를 작성해주세요)"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-transparent text-sm" />
                        </div>
                    </div>

                    <!-- 문항 추가 버튼 -->
                    <div class="flex justify-center mt-4">
                        <p v-if="errors.coverLetterTitles" class="text-sm text-red-500 mt-1">{{
                            errors.coverLetterTitles
                        }}</p>
                    </div>
                </section>

                <!-- 면접관 배정 -->
                <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
                    <h2 class="text-xl font-bold text-slate-700 mb-6">면접관 배정</h2>

                    <!-- 안내 문구 -->
                    <p class="text-sm text-gray-500 mb-4">
                        해당 채용 공고에 지원한 지원자들의 면접을 담당할 면접관을 배정해주세요.
                    </p>
                    <button @click="openInterviewerAddModal" type="button"
                        class="ml-auto w-38 hover:cursor-pointer px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium flex items-center space-x-2 shadow-sm transition-all">
                        <Plus :size="16" />
                        <span>면접관 추가</span>
                    </button>

                    <div class="mt-4"></div>

                    <!-- 추가한 면접관 목록 -->
                    <div class="flex flex-col space-y-4 mb-8 overflow-y-auto max-h-96 justify-center">
                        <div v-if="form.interviewers.length == 0" class="text-center text-slate-500">
                            등록된 면접관이 없습니다.
                        </div>
                        <div v-for="account in addInterviewers" :key="account.id"
                            class="bg-white rounded-2xl p-4 border border-slate-200 hover:shadow-lg transition-all ">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-6 flex-1 justify-between">

                                    <!-- Applicant Info -->
                                    <div class="flex items-center space-x-4">
                                        <div
                                            class="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
                                            <span class="text-white font-semibold">{{ extractInitial(account.name)
                                            }}</span>
                                        </div>
                                        <div>
                                            <h3 class="font-semibold text-slate-800 mb-1">
                                                {{ account.name }}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                <!-- Actions -->
                                <div class="flex items-center space-x-3">
                                    <button @click="deleteInterviewer(account.id)" type="button"
                                        class="transition hover:cursor-pointer">
                                        <Trash2 :size="20" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p v-if="errors.interviewers" class="text-sm text-center text-red-500 mt-1">{{
                            errors.interviewers }}</p>
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
                                <p v-if="errors.contactName" class="text-sm text-red-500 mt-1">{{ errors.contactName
                                }}
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
                                <p v-if="errors.contactEmail" class="text-sm text-red-500 mt-1">{{
                                    errors.contactEmail
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
                            <p v-if="errors.additionalInfo" class="text-sm text-red-500 mt-1">{{
                                errors.additionalInfo
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
                        class="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium"
                        type="submit" :disabled="isSubmitting">
                        <!-- ⚙️ (CHANGED) 등록 / 수정 버튼 문구 변경 -->
                        {{ isSubmitting
                            ? (props.mode === 'edit' ? '수정 중...' : '등록 중...')
                            : (props.mode === 'edit' ? '공고 수정' : '공고 등록')
                        }}
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