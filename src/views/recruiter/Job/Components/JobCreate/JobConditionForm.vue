<script setup lang="ts">
/**
 * ✅ 부모의 form 객체를 props로 받아서 v-model로 연결
 */
const props = defineProps({
  form: { type: Object, required: true },
})
</script>

<template>
  <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 class="text-xl font-bold text-slate-600 mb-6">근무 조건 및 복리후생</h2>

    <div class="space-y-6">
      <!-- 급여 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">급여</label>
        <div class="grid grid-cols-3 gap-4">
          <select
            v-model="props.form.salaryType"
            class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600"
          >
            <option value="">급여 형태</option>
            <option value="yearly">연봉</option>
            <option value="monthly">월급</option>
            <option value="hourly">시급</option>
          </select>

          <input
            v-model="props.form.salaryMin"
            type="text"
            placeholder="최소 금액"
            class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600"
          />

          <input
            v-model="props.form.salaryMax"
            type="text"
            placeholder="최대 금액"
            class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600"
          />
        </div>

        <div class="mt-2 flex items-center">
          <input
            v-model="props.form.salaryNegotiable"
            type="checkbox"
            id="negotiable"
            class="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-600"
          />
          <label for="negotiable" class="ml-2 text-sm text-gray-600">면접 후 결정</label>
        </div>
      </div>

      <!-- 근무 시간 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">근무 시간</label>
        <input
          v-model="props.form.workingHours"
          type="text"
          placeholder="예: 09:00 - 18:00 (주 5일)"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600"
        />
      </div>

      <!-- 복리후생 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">복리후생</label>
        <textarea
          v-model="props.form.benefits"
          rows="5"
          placeholder="• 제공되는 복리후생을 작성해주세요"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 resize-none"
        ></textarea>
      </div>
    </div>
  </section>
</template>
