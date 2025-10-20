<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import JobHeader from '@/components/JobHeader.vue'  // ✅ 헤더 임포트

// ✅ Router 훅 등록
const router = useRouter()
const route = useRoute()

// ✅ 공고 데이터 (예시)
const jobHeader = ref({
  title: '시니어 프론트엔드 개발자',
  status: '채용중',
  department: '개발팀',
  employmentType: '정규직',
  location: '서울시 강남구 테헤란로 123',
  experience: '5년 이상',
  position: '대리',
  techStack: ['Vue.js', 'TypeScript', 'TailwindCSS', 'Pinia'],
  salary: '6,000만~8,000만',
  salaryNegotiable: '면접 후 결정',
})

// ✅ 탭 리스트 (라우터 경로와 정확히 일치시켜야 함)
const tabs = ref([
  { id: 'info', name: '공고 정보' },
  { id: 'job-applicant-kanban', name: '지원자 관리' },
  { id: 'job-applicant-list', name: '지원자 목록' },
  { id: 'job-schedule', name: '공고 일정' },
  { id: 'job-process-edit', name: '프로세스 설정' },
])

// ✅ 현재 활성 탭 (초기값: URL 기준)
const activeTab = ref(route.path.split('/').pop() || 'info')

// ✅ 탭 클릭 시 라우터 이동
const handleTabChange = (tabId: string) => {
  activeTab.value = tabId
  router.push(`/recruiter/jobs/${tabId}`)
}

// ✅ URL 바뀔 때마다 탭 상태 자동 갱신 (새로고침 시도 대응)
watch(
  () => route.path,
  (newPath) => {
    const lastSegment = newPath.split('/').pop()
    if (lastSegment && tabs.value.some(t => t.id === lastSegment)) {
      activeTab.value = lastSegment
    }
  },
  { immediate: true }
)

// ✅ 버튼 이벤트
const handleEdit = () => alert('✏️ 공고 수정 클릭됨!')
const handlePause = () => alert('⏸️ 모집 중단 클릭됨!')
const handleDelete = () => alert('🗑️ 공고 삭제 클릭됨!')
</script>

<template>
  <div class="p-3">
    <!-- ✅ 공통 헤더 -->
    <JobHeader
      :jobPosting="jobHeader"
      :tabs="tabs"
      v-model:activeTab="activeTab"
      @update:activeTab="handleTabChange"
      :showSalaryBox="true"
      @edit="handleEdit"
      @pause="handlePause"
      @delete="handleDelete"
    />
  </div>

  <!-- ✅ 탭별 하위 페이지 출력 -->
  <RouterView />
</template>

<style scoped></style>
