<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import draggable from 'vuedraggable';
import {
  ChevronRight,
  Plus,
  Trash2,
  GripVertical
} from 'lucide-vue-next'

import recruitProcessAPI from '@/api/recruit-process'
import { useRoute } from 'vue-router'
import type {
  RecruitProcess, RecruitProcessChangeOrderForm,
  RecruitProcessForm,
  RecruitProcessRequest
} from '@/types/jobPosting/RecruitProcess.ts'
import type { ColorCode } from '@/types/common/ColorCode.ts'

const recruitmentProcess = ref<RecruitProcess[]>([])

// Process Setting Data
const newStepName = ref('')
const newStepColor = ref()
const editingIndex = ref(-1)
const editingName = ref('')
const editingColor = ref('')

const colorCode = ref<ColorCode[]>([
  {
    name: '파랑',
    code: 'BLUE'
  },
  {
    name: '빨강',
    code: 'RED'
  },
  {
    name: '주황',
    code: 'ORANGE'
  },
  {
    name: '보라',
    code: 'PURPLE'
  },
  {
    name: '분홍',
    code: 'PINK'
  }
])

const recruitProcessChangeOrderForm: RecruitProcessChangeOrderForm = reactive({
  processId: undefined,
  jobPostingId: undefined,
  fromIdx: undefined,
  toIdx: undefined
})

const recruitProcessForm: RecruitProcessForm = reactive({
  name: '',
  colorCode: colorCode.value[0]?.code,
  jobPostingId: -1,
})

// Process Setting Methods
const addStep = () => {
  if (!newStepName.value.trim()) return

  recruitmentProcess.value.push({
    name: newStepName.value.trim(),
    color: newStepColor.value
  })

  newStepName.value = ''
  newStepColor.value = 'bg-blue-500'
}


const removeStep = (index: number) => {
  if (recruitmentProcess.value.length <= 1) return

  if (confirm('이 단계를 삭제하시겠습니까?')) {
    recruitmentProcess.value.splice(index, 1)
  }
}

onMounted(async () => {
  const route = useRoute()

  const recruitProcessRequest: RecruitProcessRequest = {
    recruit: String(route.params.id)
  }

  const response = await recruitProcessAPI.requestRecruitProcesses(recruitProcessRequest)
  if (response.success) {
    recruitmentProcess.value = response.results.recruitProcesses
  }

})

const onDragEnd = () => {
  console.log('드래그 종료')
}

</script>
<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Main Content -->
    <main>
      <!-- Process Setting Tab Content -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                <div :class="`bg-${step.colorCode}`"
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
                <input v-model="recruitProcessForm.name" type="text" placeholder="예: 1차 면접, 코딩테스트 등"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">색상</label>
                <select v-model="recruitProcessForm.colorCode"
                        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                  <option
                    v-for="color in colorCode"
                    :key="color.code"
                    :value="color.code"
                  >
                    {{ color.name }}
                  </option>
                </select>
              </div>
              <button @click="addStep" :disabled="!recruitProcessForm.name.trim()"
                      class="hover:cursor-pointer px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                <Plus :size="16" class="inline mr-2" />
                추가
              </button>
            </div>
          </div>

          <!-- Existing Steps Management -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h5 class="font-semibold text-slate-700 mb-4">단계 관리</h5>
            <draggable
              v-model="recruitmentProcess"
              item-key="id"
              handle=".drag-handle"
              class="space-y-3"
              :animation="200"
              @end="onDragEnd"
            >
              <template #item="{ element: step, index }">
                <div class="drag-handle cursor-move flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <!-- Drag Handle -->
                  <div class=" p-1 text-gray-400 hover:text-slate-600 transition-colors">
                    <GripVertical :size="16" />
                  </div>

                  <!-- Step Order -->
                  <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                    {{ index + 1 }}
                  </div>

                  <!-- Step Color Preview -->
                  <div :class="`bg-${step.colorCode}`" class="w-6 h-6 rounded-full"></div>

                  <!-- Step Name (Editable) -->
                  <div class="flex-1">
                    <span class="font-medium text-slate-700">{{ step.name }}</span>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-2">
                    <button
                      v-if="editingIndex !== index && recruitmentProcess.length > 1"
                      @click="removeStep(index)"
                      class="p-1 text-red-400 hover:text-red-600 transition-colors"
                      title="삭제"
                    >
                      <Trash2 :size="16" />
                    </button>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>
<style scoped></style>
