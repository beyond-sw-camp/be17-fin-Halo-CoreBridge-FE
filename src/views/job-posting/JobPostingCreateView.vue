<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { JobPostingCreateRequest } from '@/types/jobPosting/JobPostingTypes'
import { createJobPosting } from '@/api/schedules/jobposting/jobposting'
import draggable from 'vuedraggable'
import { GripVertical, Pencil, Trash2, User, Plus } from 'lucide-vue-next'

const router = useRouter()

// -----------------------------
// Form Data (백엔드 DTO 매칭)
// -----------------------------
const form = reactive<JobPostingCreateRequest>({
    title: '',
    employmentType: '', // FULL_TIME | CONTRACT | INTERN | PART_TIME
    careerType: '',     // NEW | EXPERIENCED | ANY
    minExperience: undefined,
    maxExperience: undefined,
    positionLevel: '',
    location: '',
    applyStartDate: '', // 'YYYY-MM-DD'
    applyEndDate: '',
    hireEndDate: '',
    headcount: 0,
    summary: '',
    responsibilities: '',
    requirements: '',
    preferred: '',
    techStack: [] as string[],
    recruitProcess: ['지원 완료', '서류 검토', '1차 면접', '2차 면접', '최종 합격'],
    salaryType: '', // ANNUAL | MONTHLY | HOURLY
    salaryMin: undefined,
    salaryMax: undefined,
    salaryNegotiable: false,
    workingHours: '',
    benefits: '',
    departmentId: 1,
    contactName: '',
    contactEmail: '',
    additionalInfo: '',
})

// -----------------------------
// 기술스택 입력
// -----------------------------
const techInput = ref('')
const addTech = () => {
    if (techInput.value.trim()) {
        form.techStack.push(techInput.value.trim())
        techInput.value = ''
    }
}
const removeTech = (i: number) => form.techStack.splice(i, 1)

// -----------------------------
// 채용 프로세스 (스테이지)
// -----------------------------
interface Stage {
    id: number
    name: string
    dotColorClass: string
    participants: number
}
interface StageEdit extends Stage {
    edit: boolean
}

const maxStages = ref(10)
const stages = ref<StageEdit[]>([
    { id: 1, name: '과제 평가', dotColorClass: 'bg-orange-500', participants: 1, edit: false },
    { id: 2, name: '직무 인터뷰', dotColorClass: 'bg-yellow-500', participants: 1, edit: false },
    { id: 3, name: '컬쳐핏 인터뷰', dotColorClass: 'bg-green-500', participants: 1, edit: false },
    { id: 4, name: '처우 협의', dotColorClass: 'bg-cyan-500', participants: 1, edit: false },
])

// recruitProcess 동기화
const syncRecruitProcess = () => {
    form.recruitProcess = ['지원 완료', ...stages.value.map(s => s.name), '최종 합격']
}
watch(stages, syncRecruitProcess, { deep: true })

const editStage = (stage: StageEdit) => {
    stage.edit = !stage.edit
    if (!stage.edit) syncRecruitProcess()
}
const deleteStage = (id: number) => {
    stages.value = stages.value.filter(s => s.id !== id)
    syncRecruitProcess()
}
const addStage = () => {
    if (stages.value.length >= maxStages.value) return
    const newId = Math.max(...stages.value.map(s => s.id), 0) + 1
    stages.value.push({
        id: newId,
        name: `새 단계 ${newId}`,
        dotColorClass: 'bg-purple-500',
        participants: 1,
        edit: false,
    })
    syncRecruitProcess()
}

const onDragEnd = (event: any) => {
  console.log('🔄 순서 변경 완료:', stages.value.map(s => s.name))
  // 순서 변경 후 recruitProcess 재정렬
  form.recruitProcess = ['지원 완료', ...stages.value.map(s => s.name), '최종 합격']
}


// -----------------------------
// 페이지 이동/취소
// -----------------------------
const exit = () => {
    if (confirm('작성 중인 내용이 저장되지 않습니다. 정말 나가시겠습니까?')) {
        if (window.history.length > 1) router.back()
        else router.push({ name: 'recruiter-jobs' })
    }
}
const goBack = () => router.back()
const cancel = () => router.push('/jobs')
const saveDraft = () => console.log('임시 저장:', form)
const previewPost = () => console.log('미리보기:', form)

// -----------------------------
// 제출 (실제 API 호출)
// -----------------------------
const isSubmitting = ref(false)

const toDateTime = (d?: string | null, endOfDay = false) =>
    d ? `${d} ${endOfDay ? '23:59:59' : '00:00:00'}` : ''

const submitForm = async () => {
    // 간단 필수 검증
    if (!form.title || !form.employmentType || !form.location || !form.applyStartDate || !form.applyEndDate || !form.hireEndDate) {
        alert('필수 항목(제목/고용형태/근무지역/접수기간/마감일)을 입력해주세요.')
        return
    }

    isSubmitting.value = true
    try {
        // Enum/숫자/날짜 포맷 정리
        const payload: JobPostingCreateRequest = {
            ...form,
            headcount: Number(form.headcount) || 0,
            salaryMin: form.salaryMin == null || form.salaryMin === ('' as any) ? 0 : Number(form.salaryMin),
            salaryMax: form.salaryMax == null || form.salaryMax === ('' as any) ? 0 : Number(form.salaryMax),
            departmentId: Number(form.departmentId) || 1,
            applyStartDate: toDateTime(form.applyStartDate, false),
            applyEndDate: toDateTime(form.applyEndDate, true),
            hireEndDate: toDateTime(form.hireEndDate, true),
            recruitProcess: ['지원 완료', ...stages.value.map(s => s.name), '최종 합격'],
        }

        const res = await createJobPosting(payload)

        if (res.success) {
            alert('✅ 채용공고 등록이 완료되었습니다!')
            router.push('/recruiter/jobs')
        } else {
            alert(`등록 실패: ${res.message}`)
        }
    } catch (e) {
        console.error('등록 오류:', e)
        alert('서버 오류가 발생했습니다.')
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="bg-gray-50 min-h-screen">
        <!-- Header -->
        <header class="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 h-20 z-10">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <h1 class="text-2xl font-bold text-slate-600">채용 공고 작성</h1>
                    </div>
                    <button
                        class="px-4 py-2 text-slate-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        @click="exit()">
                        나가기
                    </button>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 my-20">
            <form class="space-y-8" @submit.prevent="submitForm" @keydown.enter.prevent>
                <!-- 기본 정보 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 class="text-xl font-bold text-slate-600 mb-6">기본 정보</h2>

                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                제목 <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.title" type="text" placeholder="예: 시니어 백엔드 개발자"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-transparent" />
                        </div>

                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    부서 <span class="text-red-500">*</span>
                                </label>

                                <select v-model="form.department"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600">
                                    <option value="">부서 선택</option>
                                    <option value="dev">개발팀</option>
                                    <option value="design">디자인팀</option>
                                    <option value="marketing">마케팅팀</option>
                                    <option value="sales">영업팀</option>
                                    <option value="hr">인사팀</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    고용 형태 <span class="text-red-500">*</span>
                                </label>
                                <select v-model="form.employmentType"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600">
                                    <option value="">고용 형태 선택</option>
                                    <option value="정규직">정규직</option>
                                    <option value="계약직">계약직</option>
                                    <option value="인턴">인턴</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    경력 요건 <span class="text-red-500">*</span>
                                </label>
                                <select v-model="form.careerType"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600">
                                    <option value="">경력 선택</option>
                                    <option value="신입">신입</option>
                                    <option value="경력">경력</option>
                                    <option value="경력무관">경력 무관</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    직급
                                </label>
                                <input v-model="form.positionLevel" type="text" placeholder="예: 주임, 대리, 과장"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                근무 지역 <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.location" type="text" placeholder="예: 서울시 강남구 테헤란로 123"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600" />
                        </div>

                        <div class="flex flex-col gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    접수 시작일 <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.applyStartDate" type="date"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    접수 종료일 <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.applyEndDate" type="date"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    마감일 <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.hireEndDate" type="date"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    모집 인원
                                </label>
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
                            <textarea v-model="form.summary" rows="4" placeholder="직무에 대한 간단한 소개를 작성해주세요."
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 resize-none"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                주요 업무 <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="form.responsibilities" rows="6" placeholder="• 주요 담당 업무를 작성해주세요"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 resize-none"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                필수 자격 요건 <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="form.requirements" rows="6" placeholder="• 필수로 갖춰야 할 자격 요건을 작성해주세요"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 resize-none"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                우대 사항
                            </label>
                            <textarea v-model="form.preferred" rows="4" placeholder="• 우대할 수 있는 조건을 작성해주세요"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 resize-none"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                기술 스택
                            </label>
                            <div class="flex gap-2 mb-3">
                                <input v-model="techInput" type="text" placeholder="기술 스택 추가 후 enter"
                                    @keyup.enter.prevent="addTech"
                                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600" />
                                <button type="button"
                                    class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
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
                        </div>
                    </div>
                </section>

                <!-- 근무 조건 및 복리후생 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 class="text-xl font-bold text-slate-600 mb-6">근무 조건 및 복리후생</h2>

                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">급여</label>
                            <div class="grid grid-cols-3 gap-4">
                                <select v-model="form.salaryType"
                                    class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600">
                                    <option value="">급여 형태</option>
                                    <option value="연봉">연봉</option>
                                    <option value="월급">월급</option>
                                    <option value="시급">시급</option>
                                </select>
                                <input v-model="form.salaryMin" type="text" placeholder="최소 금액(단위 : 만원)"
                                    class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600" />
                                <input v-model="form.salaryMax" type="text" placeholder="최대 금액(단위 : 만원)"
                                    class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600" />
                            </div>
                            <div class="mt-2 flex items-center">
                                <input v-model="form.salaryNegotiable" type="checkbox" id="negotiable"
                                    class="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-600" />
                                <label for="negotiable" class="ml-2 text-sm text-gray-600">면접 후 결정</label>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">근무 시간</label>
                            <input v-model="form.workingHours" type="text" placeholder="예: 09:00 - 18:00 (주 5일)"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">복리후생</label>
                            <textarea v-model="form.benefits" rows="5" placeholder="• 제공되는 복리후생을 작성해주세요"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 resize-none"></textarea>
                        </div>
                    </div>
                </section>

                <!-- 채용 프로세스 설정 -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 class="text-xl font-bold text-slate-600 mb-6">채용 프로세스 설정</h2>

                    <!-- 검수 단계 (고정) -->
                    <div class="border border-gray-200 rounded-lg p-2 mb-4 bg-white">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
                                    <span class="text-slate-600 font-medium">접수</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <hr class="my-4" />

                    <!-- 중간 단계 (드래그 가능) -->
                    <draggable v-model="stages" item-key="id" handle=".drag-handle" animation="200"
                        ghost-class="opacity-50" @end="onDragEnd">
                        <template #item="{ element: stage }">
                            <div
                                class="border border-gray-200 rounded-lg p-2 mb-4 bg-white hover:border-slate-300 transition-colors">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <!-- 이 부분이 handle 역할 -->
                                        <GripVertical :size="20" class="text-gray-400 drag-handle cursor-grab" />

                                        <div class="flex items-center gap-2">
                                            <span class="w-2 h-2 rounded-full" :class="stage.dotColorClass"></span>
                                            <input v-if="stage.edit" v-model="stage.name" type="text"
                                                @focusout="editStage(stage)"
                                                class="border-b border-gray-300 focus:outline-none px-1 py-0.5 text-slate-600 font-medium" />
                                            <span v-else class="text-slate-600 font-medium">{{ stage.name }}</span>
                                        </div>

                                        <button type="button" @click="editStage(stage)"
                                            class="text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer">
                                            <Pencil :size="16" />
                                        </button>
                                    </div>

                                    <div class="flex items-center gap-3">
                                        <button @click="deleteStage(stage.id)"
                                            class="text-gray-400 hover:text-red-600 transition-colors hover:cursor-pointer">
                                            <Trash2 :size="16" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </draggable>


                    <!-- 단계 추가 버튼 -->
                    <div class="flex justify-center">
                        <button type="button" @click="addStage"
                            class="flex items-center justify-center gap-2 text-slate-600 bg-slate-100 mb-6 p-4  hover:bg-slate-200 rounded-lg hover:cursor-pointer font-medium transition-colors w-full h-full"
                            :disabled="stages.length >= maxStages">
                            <div class="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center">
                                <Plus :size="16" class="text-white" />
                            </div>
                            <span>단계 추가 ({{ stages.length }}/{{ maxStages }})</span>
                        </button>
                    </div>

                    <!-- 최종합격 단계 (고정) -->
                    <div class="border border-gray-200 rounded-lg p-2 bg-white">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span class="text-slate-600 font-medium">최종합격</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- 추가 정보 -->
                <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 class="text-xl font-bold text-slate-600 mb-6">추가 정보</h2>

                    <div class="space-y-6">
                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    담당자 이름
                                </label>
                                <input v-model="form.contactName" type="text" placeholder="예: 홍길동"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    담당자 이메일
                                </label>
                                <input v-model="form.contactEmail" type="email" placeholder="예: hr@company.com"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                기타 안내사항
                            </label>
                            <textarea v-model="form.additionalInfo" rows="4" placeholder="지원자에게 전달할 추가 정보"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 resize-none"></textarea>
                        </div>
                    </div>
                </section>
            </form>
        </main>

        <!-- Header -->
        <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-sm border-t border-gray-200 h-20 z-10">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex items-center justify-end">
                    <div class="flex items-center gap-3">
                        <button
                            class="px-4 py-2 text-slate-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            @click="saveDraft">
                            임시 저장
                        </button>
                        <button
                            class="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium"
                            @click="submitForm">
                            공고 등록
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>
<style scoped>
/* 필요 시 추가 커스텀 스타일 */
</style>
