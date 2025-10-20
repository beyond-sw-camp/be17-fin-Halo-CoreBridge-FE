<script setup lang="ts">
import { GripVertical, Pencil, Trash2, Plus } from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps({
  stages: { type: Array, required: true },
  maxStages: { type: Number, required: true },
})

const emit = defineEmits(['editStage', 'deleteStage', 'addStage', 'reorderStages'])

// 드래그 상태 관리
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

// 드래그 시작
const handleDragStart = (index: number) => {
  draggedIndex.value = index
}

// 드래그 오버
const handleDragOver = (event: DragEvent, index: number) => {
  event.preventDefault()
  dragOverIndex.value = index
}

// 드래그 종료
const handleDrop = (event: DragEvent, targetIndex: number) => {
  event.preventDefault()
  
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) {
    draggedIndex.value = null
    dragOverIndex.value = null
    return
  }

  // 순서 변경 (깊은 복사)
  const newStages = JSON.parse(JSON.stringify(props.stages))
  const [movedItem] = newStages.splice(draggedIndex.value, 1)
  newStages.splice(targetIndex, 0, movedItem)

  emit('reorderStages', newStages)
  
  draggedIndex.value = null
  dragOverIndex.value = null
}

// 드래그 종료 (외부)
const handleDragEnd = () => {
  draggedIndex.value = null
  dragOverIndex.value = null
}
</script>

<template>
  <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 class="text-xl font-bold text-slate-600 mb-6">채용 프로세스 설정</h2>

    <!-- 접수 단계 (고정) -->
    <div class="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
      <div class="flex items-center gap-3">
        <span class="w-3 h-3 bg-gray-400 rounded-full"></span>
        <span class="text-slate-600 font-semibold text-lg">접수</span>
        <span class="text-xs text-gray-500 ml-2">(고정 단계)</span>
      </div>
    </div>

    <div class="flex items-center justify-center my-3">
      <div class="w-0.5 h-6 bg-gray-300"></div>
    </div>

    <!-- 중간 단계 (드래그 가능) -->
    <div
      v-for="(stage, index) in props.stages"
      :key="stage.id"
      draggable="true"
      @dragstart="handleDragStart(index)"
      @dragover="handleDragOver($event, index)"
      @drop="handleDrop($event, index)"
      @dragend="handleDragEnd"
      :class="[
        'border-2 rounded-lg p-3 mb-3 bg-white transition-all',
        draggedIndex === index ? 'opacity-50 border-slate-400' : 'border-gray-200',
        dragOverIndex === index ? 'border-slate-500 bg-slate-50' : '',
        'cursor-move hover:border-slate-300 hover:shadow-md'
      ]"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 flex-1">
          <GripVertical :size="20" class="text-gray-400 cursor-grab active:cursor-grabbing" />
          
          <span class="w-3 h-3 rounded-full flex-shrink-0" :class="stage.dotColorClass"></span>

          <input
            v-if="stage.edit"
            v-model="stage.name"
            type="text"
            @blur="emit('editStage', stage)"
            @keyup.enter="emit('editStage', stage)"
            class="border-b-2 border-slate-400 focus:outline-none focus:border-slate-600 px-2 py-1 text-slate-600 font-medium flex-1"
            @click.stop
          />
          <span v-else class="text-slate-600 font-medium text-lg">{{ stage.name }}</span>

          <button
            type="button"
            @click.stop="emit('editStage', stage)"
            class="text-gray-400 hover:text-slate-600 transition-colors p-1"
          >
            <Pencil :size="16" />
          </button>
        </div>

        <button
          type="button"
          @click.stop="emit('deleteStage', stage.id)"
          class="text-gray-400 hover:text-red-600 transition-colors p-1"
        >
          <Trash2 :size="16" />
        </button>
      </div>
    </div>

    <!-- 연결선 -->
    <div class="flex items-center justify-center my-3">
      <div class="w-0.5 h-6 bg-gray-300"></div>
    </div>

    <!-- 단계 추가 버튼 -->
    <button
      type="button"
      @click.stop="emit('addStage')"
      :disabled="props.stages.length >= props.maxStages"
      :class="[
        'flex items-center justify-center gap-2 text-slate-600 p-4 rounded-lg font-medium transition-all w-full mb-3',
        props.stages.length >= props.maxStages
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-slate-100 hover:bg-slate-200 cursor-pointer'
      ]"
    >
      <div class="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center">
        <Plus :size="16" class="text-white" />
      </div>
      <span>단계 추가 ({{ props.stages.length }}/{{ props.maxStages }})</span>
    </button>

    <!-- 연결선 -->
    <div class="flex items-center justify-center my-3">
      <div class="w-0.5 h-6 bg-gray-300"></div>
    </div>

    <!-- 최종합격 단계 (고정) -->
    <div class="border border-gray-200 rounded-lg p-4 bg-blue-50">
      <div class="flex items-center gap-3">
        <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
        <span class="text-slate-600 font-semibold text-lg">최종합격</span>
        <span class="text-xs text-gray-500 ml-2">(고정 단계)</span>
      </div>
    </div>
  </section>
</template>