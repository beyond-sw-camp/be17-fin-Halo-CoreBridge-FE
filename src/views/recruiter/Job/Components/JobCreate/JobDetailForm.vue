<script setup lang="ts">
/**
 * ✅ props: 부모 form + techInput 전달받기
 * ✅ emits: 부모 함수 트리거용 (addTech / removeTech / update:techInput)
 */
const props = defineProps({
  form: { type: Object, required: true },
  techInput: { type: String, required: true },
})

const emit = defineEmits(['update:techInput', 'addTech', 'removeTech'])
</script>

<template>
  <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 class="text-xl font-bold text-slate-600 mb-6">상세 설명</h2>

    <div class="space-y-6">
      <!-- 직무 소개 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          직무 소개 <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="props.form.summary"
          rows="4"
          placeholder="직무에 대한 간단한 소개를 작성해주세요."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 resize-none"
        ></textarea>
      </div>

      <!-- 주요 업무 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          주요 업무 <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="props.form.responsibilities"
          rows="6"
          placeholder="• 주요 담당 업무를 작성해주세요"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 resize-none"
        ></textarea>
      </div>

      <!-- 필수 자격 요건 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          필수 자격 요건 <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="props.form.requirements"
          rows="6"
          placeholder="• 필수로 갖춰야 할 자격 요건을 작성해주세요"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 resize-none"
        ></textarea>
      </div>

      <!-- 우대 사항 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          우대 사항
        </label>
        <textarea
          v-model="props.form.preferred"
          rows="4"
          placeholder="• 우대할 수 있는 조건을 작성해주세요"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 resize-none"
        ></textarea>
      </div>

      <!-- 기술 스택 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          기술 스택
        </label>
        <div class="flex gap-2 mb-3">
          <!-- ✅ 부모 techInput 값 양방향 업데이트 -->
          <input
            :value="props.techInput"
            @input="emit('update:techInput', $event.target.value)"
            type="text"
            placeholder="기술 스택 입력 후 추가"
            @keyup.enter="emit('addTech')"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600"
          />
          <button
            type="button"
            class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
            @click="emit('addTech')"
          >
            추가
          </button>
        </div>

        <!-- ✅ 기술 스택 목록 -->
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(tech, i) in props.form.techStack"
            :key="i"
            class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
          >
            {{ tech }}
            <button
              type="button"
              @click="emit('removeTech', i)"
              class="hover:text-blue-900"
            >
              ✕
            </button>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
