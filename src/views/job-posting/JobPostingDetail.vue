<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">
      <!-- 헤더 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-slate-600 rounded-full mb-4">
          <Briefcase class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ post.title }}</h1>
        <p class="text-gray-500">{{ post.department }} · {{ post.employmentType }}</p>
      </div>

      <!-- 본문 내용 -->
      <div class="space-y-8 text-gray-800">
        <!-- 설명 -->
        <section>
          <h2 class="text-lg font-semibold mb-2 text-slate-700">📋 공고 설명</h2>
          <p class="leading-relaxed whitespace-pre-line">{{ post.description }}</p>
        </section>

        <!-- 기술 스택 -->
        <section v-if="post.skills && post.skills.length">
          <h2 class="text-lg font-semibold mb-2 text-slate-700">🧩 기술 스택</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(skill, idx) in post.skills"
              :key="idx"
              class="px-3 py-1 bg-slate-100 rounded-lg text-slate-700 text-sm font-medium">
              {{ skill }}
            </span>
          </div>
        </section>

        <!-- 모집 기간 -->
        <section>
          <h2 class="text-lg font-semibold mb-2 text-slate-700">📅 모집 기간</h2>
          <div class="grid grid-cols-2 sm:grid-cols-2 gap-3">
            <div class="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p class="text-xs text-gray-500 mb-1">접수 시작일</p>
              <p class="font-medium">{{ formatDate(post.applyStartDate) }}</p>
            </div>
            <div class="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p class="text-xs text-gray-500 mb-1">접수 마감일</p>
              <p class="font-medium">{{ formatDate(post.applyEndDate) }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- 액션 버튼 -->
      <div class="mt-10 flex justify-center gap-3">
        <button
          @click="$router.back()"
          class="px-5 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-medium transition">
          돌아가기
        </button>
        <router-link
          to="/job-postings"
          class="px-5 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition">
          목록 보기
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Briefcase } from "lucide-vue-next";
// import { getJobPostingById } from "@/api/jobPosting"; // 실제 API 사용할 때

const route = useRoute();
const post = ref({});

// 날짜 포맷팅 함수
function formatDate(datetime) {
  if (!datetime) return "-";
  return new Date(datetime).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Mock 데이터 (DB 연결 전)
const mockData = {
  id: 1,
  title: "백엔드 개발자 채용",
  description: "Spring Boot 기반 서버 개발 담당자 모집",
  department: "개발본부",
  employmentType: "정규직",
  skills: ["Java", "Spring Boot", "MySQL"],
  applyStartDate: "2025-10-15 09:00:00",
  applyEndDate: "2025-11-15 18:00:00",
};

onMounted(async () => {
  // 실제 API 연결 시
  // const { data } = await getJobPostingById(route.params.id);
  // post.value = data;

  // 지금은 mock 데이터 사용
  post.value = mockData;
});
</script>
