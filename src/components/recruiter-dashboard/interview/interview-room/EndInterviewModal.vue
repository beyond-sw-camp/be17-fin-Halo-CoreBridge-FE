<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('cancel')"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="p-6">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle class="w-6 h-6 text-red-600" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-slate-800 mb-2">면접 종료 확인</h3>
            <p class="text-slate-600 mb-4">
              면접을 종료하시겠습니까?
            </p>
            <div v-if="hasUnsavedEvaluation" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div class="flex gap-2">
                <AlertTriangle class="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p class="text-sm text-yellow-800">
                  작성 중인 평가가 있습니다. 종료하기 전에 평가를 저장해주세요.
                </p>
              </div>
            </div>
            <p class="text-sm text-slate-500">
              면접을 종료하면 평가 내용이 저장되고 면접 목록 화면으로 이동합니다.
            </p>
          </div>
        </div>
      </div>
      <div class="px-6 py-4 bg-slate-50 rounded-b-lg flex justify-end gap-3">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium"
        >
          취소
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          면접 종료
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, AlertTriangle } from 'lucide-vue-next';

defineProps<{
  hasUnsavedEvaluation: boolean;
}>();

defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>
