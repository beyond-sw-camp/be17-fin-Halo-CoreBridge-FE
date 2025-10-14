<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 py-12">
    <div class="max-w-6xl mx-auto">
      <!-- 헤더 -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="inline-flex items-center justify-center w-14 h-14 bg-slate-600 rounded-full">
              <Briefcase class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">채용공고</h1>
              <p class="text-sm text-gray-500">등록된 공고를 확인하고 관리할 수 있어요.</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- 보기 전환 버튼 (토글형) -->
            <div class="flex border border-slate-300 rounded-lg overflow-hidden">
              <button
                @click="viewMode = 'card'"
                :class="[
                  'px-3 py-2 flex items-center gap-2 text-sm transition-all',
                  viewMode === 'card'
                    ? 'bg-slate-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                ]"
              >
                <Grid size="18" />
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'px-3 py-2 flex items-center gap-2 text-sm transition-all',
                  viewMode === 'list'
                    ? 'bg-slate-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                ]"
              >
                <List size="18" />
              </button>
            </div>

            <!-- 새 공고 등록 -->
            <router-link
              to="/job-postings/create"
              class="px-4 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition"
            >
              + 새 공고 등록
            </router-link>
          </div>
        </div>
      </div>

      <!-- 카드형 보기 -->
      <div v-if="viewMode === 'card'" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="post in mockList" :key="post.id" @click="goToPipeline(post.id)">
          <div class="bg-white rounded-xl shadow p-5 hover:shadow-lg transition cursor-pointer">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ post.title }}</h3>
            <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ post.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(skill, idx) in post.skills"
                :key="idx"
                class="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 리스트형 보기 -->
      <div v-else class="space-y-3">
        <div
          v-for="post in mockList"
          :key="post.id"
          @click="goToPipeline(post.id)"
          class="bg-white rounded-lg shadow p-5 hover:shadow-md transition cursor-pointer flex justify-between items-center"
        >
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ post.title }}</h3>
            <p class="text-sm text-gray-500 line-clamp-1">{{ post.description }}</p>
          </div>
          <div class="flex gap-2">
            <span
              v-for="(skill, idx) in post.skills"
              :key="idx"
              class="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Briefcase, Grid, List } from 'lucide-vue-next'

const router = useRouter()
const viewMode = ref<'card' | 'list'>('card') // 보기 모드 상태 관리

const mockList = ref([
  {
    id: 1,
    title: '백엔드 개발자 채용',
    description: 'Spring Boot 기반의 서버 개발 담당. AWS 인프라 경험자 우대.',
    skills: ['Java', 'Spring Boot', 'MySQL', 'AWS'],
  },
  {
    id: 2,
    title: '프론트엔드 개발자 채용',
    description: 'Vue.js 환경에서 UI 개발 및 API 연동. Tailwind CSS 사용.',
    skills: ['Vue', 'TypeScript', 'TailwindCSS'],
  },
  {
    id: 3,
    title: '데이터 엔지니어 모집',
    description: '데이터 파이프라인 구축 및 ETL 자동화 담당.',
    skills: ['Python', 'Airflow', 'PostgreSQL'],
  },
  {
    id: 4,
    title: 'QA 엔지니어 모집',
    description: '테스트 자동화 및 품질 관리 업무 담당.',
    skills: ['Cypress', 'Jest', 'GitHub Actions'],
  },
])

const goToPipeline = (jobId: number) => {
  router.push(`/recruiter/jobs/${jobId}/pipeline`)
}
</script>
