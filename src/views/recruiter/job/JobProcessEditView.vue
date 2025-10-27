<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import draggable from 'vuedraggable';
import {
  ChevronRight,
  Plus,
  GripVertical,
} from 'lucide-vue-next'

import recruitProcessAPI from '@/api/recruit-process'
import { useRoute } from 'vue-router'
import type {
  RecruitProcess, RecruitProcessChangeOrderForm, RecruitProcessDeleteForm, RecruitProcessEditForm,
  RecruitProcessForm,
  RecruitProcessRequest
} from '@/types/jobPosting/RecruitProcess.ts'
import type { ColorCode } from '@/types/common/ColorCode.ts'
import RecruitDropdown from '@/components/recruiter-dashboard/RecruitDropdown.vue'
import RecruitEditModal from '@/components/recruiter-dashboard/RecruitEditModal.vue'
import RecruitDeleteModal from '@/components/recruiter-dashboard/RecruitDeleteModal.vue'

const route = useRoute()
const recruitmentProcess = ref<RecruitProcess[]>([])

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


const recruitProcessForm: RecruitProcessForm = reactive({
  name: '',
  colorCode: colorCode.value[0]?.code,
  jobPostingId: Number(route.params.id),
})

onMounted(async () => {

  const recruitProcessRequest: RecruitProcessRequest = {
    recruit: String(route.params.id)
  }

  const response = await recruitProcessAPI.requestRecruitProcesses(recruitProcessRequest)
  if (response.success) {
    recruitmentProcess.value = response.results.recruitProcesses
  }

})

// 타입 정의 추가
interface DraggableEvent {
  oldIndex: number
  newIndex: number
  item: HTMLElement
}

const onDragEnd = async (event: DraggableEvent) => {

  // 드래그로 인한 위치 변경이 없는 경우
  if (event.oldIndex === event.newIndex) {
    return
  }

  const movedProcess: RecruitProcess = recruitmentProcess.value[event.newIndex]

  if (movedProcess == undefined) {
    return
  }

  const recruitProcessChangeOrderForm: RecruitProcessChangeOrderForm = {
    processId: movedProcess.id,
    jobPostingId: Number(route.params.id),
    fromIdx: event.oldIndex + 1,
    toIdx: event.newIndex + 1
  }

  const response = await recruitProcessAPI.requestRecruitProcessChangeOrder(recruitProcessChangeOrderForm)
  if (response.success) {
    recruitmentProcess.value = response.results.recruitProcesses
  }
}

/*
 * 채용 프로세스 추가
 */
const addProcess = async () => {

  const response = await recruitProcessAPI.requestRecruitProcessAdding(recruitProcessForm)
  if (response.success) {
    recruitmentProcess.value = response.results.recruitProcesses
  } else {
    console.log(response)
  }
}

const editProcess = ref<RecruitProcessEditForm>({
  id: 0,
  name: '',
  colorCode: '',
  jobPostingId: 0,
})

const isOpenUpdateModal = ref(false)
const currentColorCodeName = ref('')
const edit = (recruitProcess: RecruitProcess) => {
  isOpenUpdateModal.value = true

  currentColorCodeName.value = recruitProcess.colorCode.name
  editProcess.value.id = recruitProcess.id
  editProcess.value.name = recruitProcess.name
  editProcess.value.colorCode = recruitProcess.colorCode.code
  editProcess.value.jobPostingId = Number(route.params.id)
}

const handleUpdateModalClose = () => {
  isOpenUpdateModal.value = false
}

const editConfirm = async (recruitProcessEditForm: RecruitProcessEditForm) => {

  const response = await recruitProcessAPI.requestUpdateRecruitProcess(recruitProcessEditForm)
  if (response.success) {
    recruitmentProcess.value = response.results.recruitProcesses
    handleUpdateModalClose()
  }
}

const isDeletedError = ref(false)
const isOpenDeleteModal = ref(false)
const deletedErrorMsg = ref('')
const delProcess = ref<RecruitProcessDeleteForm>({
  id: 0
})
const deleteProcess = (recruitProcess: RecruitProcess) => {
  isOpenDeleteModal.value = true
  delProcess.value!.id = recruitProcess.id
}

const handleDeleteModalClose = () => {
  isOpenDeleteModal.value = false
  isDeletedError.value = false
  deletedErrorMsg.value = ''
}

const deleteConfirm = async () => {

  const response = await recruitProcessAPI.requestDeleteRecruitProcess(delProcess.value)
  if (response.success) {
    recruitmentProcess.value = response.results.recruitProcesses
  } else {
    isOpenDeleteModal.value = true
    isDeletedError.value = true
    deletedErrorMsg.value = response.message
  }
}
</script>
<template>
  <div class="bg-gray-50 min-h-screen">
    <RecruitEditModal :open-modal="isOpenUpdateModal" :edit-process="editProcess" @close="handleUpdateModalClose" @confirm="editConfirm" :current-color-code="currentColorCodeName" />
    <RecruitDeleteModal :open-modal="isOpenDeleteModal" @close="handleDeleteModalClose" @confirm="deleteConfirm" :deleted-error-msg="deletedErrorMsg" :is-deleted-error="isDeletedError" />
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
                <div :class="`bg-${step.colorCode.code}`"
                     class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {{ step.orderIdx }}
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
              <button @click="addProcess" :disabled="!recruitProcessForm.name.trim()"
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
              <template #item="{ element: step }">
                <div class="drag-handle cursor-move flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <!-- Drag Handle -->
                  <div class=" p-1 text-gray-400 hover:text-slate-600 transition-colors">
                    <GripVertical :size="16" />
                  </div>

                  <!-- Step Order -->
                  <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                    {{ step.orderIdx }}
                  </div>

                  <!-- Step Color Preview -->
                  <div :class="`bg-${step.colorCode.code}`" class="w-6 h-6 rounded-full"></div>

                  <!-- Step Name (Editable) -->
                  <div class="flex-1">
                    <span class="font-medium text-slate-700">{{ step.name }}</span>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-2">
                    <RecruitDropdown  @edit-menu-click="edit(step)" @delete-menu-click="deleteProcess(step)" />
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
