<script setup lang="ts">
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'

import JobBasicInfoForm from './Components/JobCreate/JobBasicInfoForm.vue'
import JobDetailForm from './Components/JobCreate/JobDetailForm.vue'
import JobConditionForm from './Components/JobCreate/JobConditionForm.vue'
import JobProcessForm from './Components/JobCreate/JobProcessForm.vue'
import JobAdditionalInfoForm from './Components/JobCreate/JobAdditionalInfoForm.vue'

const maxStages = ref(10)
const stages = ref([
    { id: 1, name: '과제 평가', dotColorClass: 'bg-orange-500', participants: 1, edit: false },
    { id: 2, name: '직무 인터뷰', dotColorClass: 'bg-yellow-500', participants: 1, edit: false },
    { id: 3, name: '컬쳐핏 인터뷰', dotColorClass: 'bg-green-500', participants: 1, edit: false },
])

const editStage = (stage: any) => {
    stage.edit = !stage.edit
}

const deleteStage = (id: number) => {
    stages.value = stages.value.filter(s => s.id !== id)
}

const addStage = () => {
    const newId = Math.max(...stages.value.map(s => s.id), 0) + 1
    const colors = ['bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-red-500']
    const color = colors[(stages.value.length) % colors.length]
    stages.value.push({ 
        id: newId, 
        name: `새 단계 ${newId}`, 
        dotColorClass: color, 
        participants: 1, 
        edit: false 
    })
}

// ✅ 드래그 앤 드롭으로 순서 변경 (깊은 복사로 완전히 새 배열 생성)
const reorderStages = (newStages: any[]) => {
    stages.value = [...newStages]
    console.log('순서 변경됨:', stages.value)
}

const form = reactive({
    title: '',
    department: '',
    employmentType: '',
    experience: '',
    positionLevel: '',
    location: '',
    deadline: '',
    headcount: '',
    summary: '',
    responsibilities: '',
    requirements: '',
    preferred: '',
    techStack: [] as string[],
    salaryType: '',
    salaryMin: '',
    salaryMax: '',
    salaryNegotiable: false,
    workingHours: '',
    benefits: '',
    process: ['지원 완료', '서류 검토', '1차 면접', '2차 면접', '최종 합격'],
    contactName: '',
    contactEmail: '',
    additionalInfo: '',
})

const techInput = ref('')

const addTech = () => {
    if (techInput.value.trim()) {
        form.techStack.push(techInput.value.trim())
        techInput.value = ''
    }
}

const removeTech = (i: number) => form.techStack.splice(i, 1)

const router = useRouter()

const submitForm = () => {
    console.log('공고 등록 요청 데이터:', form)
    console.log('프로세스 단계:', stages.value)
    alert('채용공고가 등록되었습니다!')
    // TODO: API 호출 후 목록 페이지로 이동
    // router.push({ name: 'jobPostList' })
}

const saveDraft = () => {
    console.log('임시 저장 데이터:', form)
    console.log('프로세스 단계:', stages.value)
    alert('임시 저장되었습니다!')
    // TODO: API 호출하여 임시 저장
}

const exit = () => {
    if (confirm('작성 중인 내용이 저장되지 않습니다. 정말 나가시겠습니까?')) {
        if (window.history.length > 1) {
            router.back()
        } else {
            router.push({ name: 'jobPostList' })
        }
    }
}
</script>

<template>
    <div class="bg-gray-50 min-h-screen">
        <!-- Header 영역 -->
        <header class="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 h-20 z-10">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <h1 class="text-2xl font-bold text-slate-600">채용 공고 작성</h1>
                <button 
                    type="button"
                    class="px-4 py-2 text-slate-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    @click="exit">
                    나가기
                </button>
            </div>
        </header>

        <!-- Main 영역 -->
        <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 mb-28">
            <form @submit.prevent="submitForm" class="space-y-10">
                <JobBasicInfoForm v-model:form="form" />
                
                <JobDetailForm 
                    :form="form" 
                    v-model:techInput="techInput" 
                    @addTech="addTech" 
                    @removeTech="removeTech" 
                />
                
                <JobConditionForm :form="form" />
                
                <JobProcessForm 
                    :stages="stages" 
                    :maxStages="maxStages" 
                    @editStage="editStage"
                    @deleteStage="deleteStage" 
                    @addStage="addStage"
                    @reorderStages="reorderStages"
                />
                
                <JobAdditionalInfoForm :form="form" />
            </form>
        </main>

        <!-- Footer 영역 (고정) -->
        <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-sm border-t border-gray-200 h-20 z-10">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex items-center justify-end">
                    <div class="flex items-center gap-3">
                        <button
                            type="button"
                            class="px-4 py-2 text-slate-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            @click="saveDraft">
                            임시 저장
                        </button>
                        <button
                            type="button"
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