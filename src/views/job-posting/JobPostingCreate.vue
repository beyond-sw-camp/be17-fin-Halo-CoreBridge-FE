<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 py-12">
    <div class="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
      <!-- 헤더 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-slate-600 rounded-full mb-4">
          <Briefcase class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">채용공고 등록</h1>
      </div>

      <!-- 폼 -->
      <form @submit.prevent="handleSubmit" class="space-y-5">

        <!-- 제목 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
          <input v-model="form.title" type="text"
            class="block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition border-gray-300"
            placeholder="예) 백엔드 개발자 채용" />
        </div>

        <!-- 설명 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">설명</label>
          <textarea v-model="form.description" rows="4"
            class="block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition border-gray-300"
            placeholder="예) Spring Boot 기반의 서버 개발 담당자 모집"></textarea>
        </div>

        <!-- 고용형태 & 경력구분 -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">고용형태</label>
            <select v-model="form.employmentType"
              class="block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition border-gray-300">
              <option value="">선택</option>
              <option value="정규직">정규직</option>
              <option value="계약직">계약직</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">경력 구분</label>
            <select v-model="form.careerType"
              class="block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition border-gray-300">
              <option value="">선택</option>
              <option value="신입">신입</option>
              <option value="경력">경력</option>
              <option value="무관">무관</option>
            </select>
          </div>
        </div>

        <!-- 경력 범위 (경력일 경우에만 노출) -->
        <div v-if="form.careerType === '경력'" class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">최소 경력(년)</label>
            <input v-model.number="form.minExperience" type="number" min="0"
              class="block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition border-gray-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">최대 경력(년)</label>
            <input v-model.number="form.maxExperience" type="number" min="0"
              class="block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition border-gray-300" />
          </div>
        </div>

        <!-- 부서 ID -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">부서 ID</label>
          <input v-model.number="form.departmentId" type="number"
            class="block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition border-gray-300"
            placeholder="예) 1" />
        </div>

        <!-- 접수 기간 -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">접수 시작</label>
            <input v-model="form.applyStartDate" type="datetime-local"
              class="block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition border-gray-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">접수 마감</label>
            <input v-model="form.applyEndDate" type="datetime-local"
              class="block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition border-gray-300" />
          </div>
        </div>

        <!-- 기술 스택 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">기술 스택</label>
          <div class="flex gap-2">
            <input v-model="newSkill" type="text"
              class="flex-1 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition border-gray-300"
              placeholder="예) Java" />
            <button type="button" @click="addSkill"
              class="px-4 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition whitespace-nowrap">
              추가
            </button>
          </div>

          <!-- 추가된 스택 표시 -->
          <div v-if="form.skills.length" class="flex flex-wrap gap-2 mt-3">
            <div v-for="(skill, idx) in form.skills" :key="idx"
              class="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm">
              {{ skill }}
              <button type="button" @click="removeSkill(idx)"
                class="text-gray-400 hover:text-red-500 transition">&times;</button>
            </div>
          </div>
        </div>

        <!-- 등록 버튼 -->
        <button type="submit"
          class="w-full bg-slate-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transform hover:scale-[1.02] transition shadow-lg">
          등록 (Mock)
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Briefcase } from "lucide-vue-next";

const form = ref({
  title: "",
  description: "",
  employmentType: "",
  careerType: "",
  minExperience: null,
  maxExperience: null,
  departmentId: null,
  applyStartDate: "",
  applyEndDate: "",
  skills: [],
});

const newSkill = ref("");

// 기술 스택 추가
function addSkill() {
  const skill = newSkill.value.trim();
  if (skill && !form.value.skills.includes(skill)) {
    form.value.skills.push(skill);
    newSkill.value = "";
  }
}

// 스택 삭제
function removeSkill(index) {
  form.value.skills.splice(index, 1);
}

// 제출 이벤트 (Mock)
function handleSubmit() {
  const payload = {
    ...form.value,
    skills: form.value.skills.map((name, idx) => ({ id: idx + 1, name })),
    department: { id: form.value.departmentId, name: "개발본부" },
    hireEndDate: null, // 기본적으로 null
  };

  console.log("🚀 등록 요청 데이터 (Mock):", payload);
  alert("등록이 완료되었습니다 (mock). 콘솔을 확인하세요!");
}
</script>
