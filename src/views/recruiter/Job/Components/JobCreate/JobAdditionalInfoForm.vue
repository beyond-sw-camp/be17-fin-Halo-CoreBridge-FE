<script setup lang="ts">
/**
 * ✅ 부모로부터 form 객체를 전달받아서 그대로 v-model로 바인딩
 */
const props = defineProps({
  form: { type: Object, required: true },
})
</script>

<template>
  <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 class="text-xl font-bold text-slate-600 mb-6">추가 정보</h2>

    <div class="space-y-6">
      <!-- 담당자 이름 / 이메일 -->
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            담당자 이름
          </label>
          <input
            v-model="props.form.contactName"
            type="text"
            placeholder="예: 홍길동"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            담당자 이메일
          </label>
          <input
            v-model="props.form.contactEmail"
            type="email"
            placeholder="예: hr@company.com"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600"
          />
        </div>
      </div>

      <!-- 기타 안내사항 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          기타 안내사항
        </label>
        <textarea
          v-model="props.form.additionalInfo"
          rows="4"
          placeholder="지원자에게 전달할 추가 정보"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 resize-none"
        ></textarea>
      </div>
    </div>
  </section>
</template>
