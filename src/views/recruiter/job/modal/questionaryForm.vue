<template>
  <!-- ✅ 배경 흐림 효과 + 반투명 오버레이 -->
  <div
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-xl shadow-2xl w-[950px] max-h-[85vh] flex flex-col"
    >
      <!-- 헤더 -->
      <div
        class="flex justify-between items-center px-6 py-4 border-b border-gray-200"
      >
        <h2 class="text-lg font-semibold text-slate-700">지원서 질문 설정</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <!-- 본문 -->
      <div class="p-6 grid grid-cols-2 gap-6 overflow-y-auto">
        <!-- 좌측: 질문 입력 -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-md font-semibold text-slate-700">질문 목록</h3>
            <button
              @click="addQuestion"
              class="px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 text-sm"
            >
              + 질문 추가
            </button>
          </div>

          <div class="space-y-4 max-h-[400px] overflow-y-auto">
            <div
              v-for="(q, index) in questions"
              :key="index"
              class="bg-gray-50 p-4 rounded-lg border border-gray-200 relative"
            >
              <div class="absolute top-2 right-2">
                <button
                  @click="removeQuestion(index)"
                  class="text-gray-400 hover:text-red-500 transition"
                >
                  ✕
                </button>
              </div>

              <div class="flex items-center gap-2 mb-2">
                <span class="font-medium text-slate-500">{{ index + 1 }}.</span>
                <input
                  v-model="q.mainTitle"
                  type="text"
                  placeholder="큰 제목 (예: 지원동기)"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                />
              </div>

              <input
                v-model="q.subTitle"
                type="text"
                placeholder="부제목 (예: 이 직무에 지원하게 된 이유를 구체적으로 작성해주세요)"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- 우측: 미리보기 -->
        <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 class="text-slate-700 font-semibold mb-3">지원서 미리보기</h3>

          <div
            v-if="questions.length === 0"
            class="text-gray-400 text-sm italic"
          >
            질문이 없습니다. 왼쪽에서 추가해주세요.
          </div>

          <div
            v-for="(q, index) in questions"
            :key="index"
            class="mb-6 border-b border-gray-100 pb-4"
          >
            <p class="text-base font-semibold text-slate-700">
              Q{{ index + 1 }}. {{ q.mainTitle || '큰 제목 없음' }}
            </p>
            <p
              v-if="q.subTitle"
              class="text-sm text-gray-500 mb-2"
            >
              {{ q.subTitle }}
            </p>

            <textarea
              rows="3"
              disabled
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
              placeholder="지원자가 여기에 작성합니다..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div
        class="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50"
      >
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          취소
        </button>
        <button
          @click="saveQuestions"
          class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
        >
          저장하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Question {
  mainTitle: string
  subTitle: string
}

const questions = ref<Question[]>([])

const addQuestion = () => {
  questions.value.push({ mainTitle: '', subTitle: '' })
}

const removeQuestion = (index: number) => {
  questions.value.splice(index, 1)
}

const saveQuestions = () => {
  console.log('저장된 질문:', questions.value)
  alert('저장된 질문 콘솔 확인!')
}
</script>
