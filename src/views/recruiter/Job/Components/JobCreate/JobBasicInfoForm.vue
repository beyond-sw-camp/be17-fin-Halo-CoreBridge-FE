<script setup lang="ts">
/**
 * ✅ 부모에서 내려받은 form 객체를 props로 받음
 * 부모는 reactive()로 선언한 form을 넘기고,
 * 자식은 그 객체를 직접 v-model로 사용 가능.
 */
const props = defineProps({
  form: { type: Object, required: true },
})
</script>

<template>
  <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 class="text-xl font-bold text-slate-600 mb-6">기본 정보</h2>

    <div class="space-y-6">
      <!-- 제목 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          제목 <span class="text-red-500">*</span>
        </label>
        <input
          v-model="props.form.title"
          type="text"
          placeholder="예: 시니어 백엔드 개발자"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-transparent"
        />
      </div>

      <!-- 부서 / 고용형태 -->
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            부서 <span class="text-red-500">*</span>
          </label>
          <select
            v-model="props.form.department"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600"
          >
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
          <select
            v-model="props.form.employmentType"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600"
          >
            <option value="">고용 형태 선택</option>
            <option value="fulltime">정규직</option>
            <option value="contract">계약직</option>
            <option value="intern">인턴</option>
            <option value="parttime">파트타임</option>
          </select>
        </div>
      </div>

      <!-- 경력 / 직급 -->
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            경력 요건 <span class="text-red-500">*</span>
          </label>
          <select
            v-model="props.form.experience"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600"
          >
            <option value="">경력 선택</option>
            <option value="fresh">신입</option>
            <option value="1-3">1-3년</option>
            <option value="3-5">3-5년</option>
            <option value="5+">5년 이상</option>
            <option value="any">경력 무관</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">직급</label>
          <input
            v-model="props.form.positionLevel"
            type="text"
            placeholder="예: 주임, 대리, 과장"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600"
          />
        </div>
      </div>

      <!-- 근무 지역 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          근무 지역 <span class="text-red-500">*</span>
        </label>
        <input
          v-model="props.form.location"
          type="text"
          placeholder="예: 서울시 강남구 테헤란로 123"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600"
        />
      </div>
    </div>
  </section>
</template>
