<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { defineProps } from 'vue';
import { useRoute } from 'vue-router';
import { User, FileText, Download } from 'lucide-vue-next';
import ApplicantSidebar from '@/components/applicant/ApplicantSidebar.vue';
import {
  getResume,
  getCoverLetterDescriptionsV2,
  getCoverLetterTitles,
  downloadPdfV2,
} from '@/api/resume';
import PdfViewer from '@/components/pdf/PdfViewer.vue';
import type {
  ResumeResponse,
  Career,
  Education,
  Certificate,
  Language,
  ResumeSkill,
  BaseResponse,
  PdfResponse,
  CoverLetterDescriptionResponse,
} from '@/types/resume/ResumeTypes.ts';
import type { CoverLetterTitleResponse } from '@/api/resume';

// UI 전용 타입
interface ApplicantInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  appliedDate: string;
  position: string;
  status: string;
  statusColor: string;
}

interface RecruiterNote {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

interface TimelineItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  time: string;
}

// 라우터 props 수신
defineProps<{
  jobpostId: string;
  resumeId: string;
}>();

const route = useRoute();

// 상태
const activeTab = ref<'resume' | 'coverLetter' | 'pdf'>('resume');
const resumeData = ref<ResumeResponse | null>(null);
const applicant = ref<ApplicantInfo | null>(null);
const portfolios = ref<PdfResponse[]>([]);
const coverLetterDescriptions = ref<CoverLetterDescriptionResponse[]>([]);
const coverLetterTitles = ref<CoverLetterTitleResponse[]>([]);

// 모킹 데이터
const recruiterNotes = ref<RecruiterNote[]>([
  { id: 1, author: 'Halo', content: '포트폴리오 검토 완료. UI 완성도가 매우 높음.', createdAt: '2025. 10. 14 오전 11:05' },
  { id: 2, author: 'Halo', content: '경력사항 확인 완료. 대기업 경험 보유.', createdAt: '2025. 10. 01 오후 3:45' },
]);

const timelineItems = ref<TimelineItem[]>([
  { id: 1, title: '지원자 단계 이동', subtitle: 'Halo 님이 실행', description: '접수 >> 화상 면접 단계로 이동', date: '2025. 10. 14', time: '오전 11:05' },
  { id: 2, title: '지원자 단계 이동', subtitle: 'Halo 님이 실행', description: '과제 평가 >> 검수 단계로 이동', date: '2025. 10. 14', time: '오전 9:14' },
]);

// 파일 다운로드
const downloadFile = async (file: PdfResponse) => {
  if (!resumeData.value) {
    console.error('Resume data is not available.');
    // 사용자에게 알림을 표시할 수 있습니다 (예: toast 메시지)
    return;
  }

  try {
    const blob = await downloadPdfV2(resumeData.value.id);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.originalFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download file:', error);
    // 사용자에게 다운로드 실패 알림을 표시할 수 있습니다.
  }
};

// 노트 추가
const addRecruiterNote = (content: string) => {
  recruiterNotes.value.unshift({
    id: Date.now(),
    author: 'Halo',
    content,
    createdAt: new Date().toLocaleString('ko-KR'),
  });
};

// 데이터 로드
onMounted(async () => {
  const jobpostId = Number(route.params.jobpostId);
  const resumeId = Number(route.params.resumeId);

  if (isNaN(jobpostId) || isNaN(resumeId)) {
    console.error('Invalid jobpostId or resumeId from URL');
    return;
  }

  try {
    const response = await getResume(jobpostId, resumeId);
    resumeData.value = response;

    const data = resumeData.value;
    if (data) {
      applicant.value = {
        id: data.userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        appliedDate: new Date(data.appliedAt).toLocaleDateString('ko-KR'),
        position: `채용 공고 ID: ${jobpostId}`,
        status: '서류 검토',
        statusColor: 'gray',
      };

      if (data.pdf) {
        portfolios.value = [data.pdf];
      }

      // 자소서 데이터 로드
      try {
        const [descriptions, titles] = await Promise.all([
          getCoverLetterDescriptionsV2(jobpostId, resumeId, jobpostId),
          getCoverLetterTitles(jobpostId)
        ]);
        coverLetterDescriptions.value = descriptions;
        coverLetterTitles.value = titles;
      } catch (error) {
        console.error('Failed to load cover letter data:', error);
      }
    }
  } catch (error) {
    console.error('Failed to load resume data:', error);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Left Sidebar -->
    <ApplicantSidebar
      v-if="applicant"
      :applicant="applicant"
      :recruiter-notes="recruiterNotes"
      @add-note="addRecruiterNote"
    />

    <!-- Center Content -->
    <div v-if="resumeData" class="flex-1 flex flex-col min-w-0">
      <!-- Top Header -->
      <div class="bg-white border-b border-gray-200 px-6 py-3">
        <div v-if="applicant" class="flex items-center gap-2 text-sm">
          <span class="text-gray-500">지원자 관리</span>
          <span class="text-gray-400">></span>
          <span class="text-slate-600">{{ applicant.position }}</span>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Main Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <div class="max-w-4xl min-w-[600px]">
            <!-- Tabs -->
            <div class="mb-6 border-b border-gray-200">
              <div class="flex gap-8">
                <button
                  @click="activeTab = 'resume'"
                  :class="activeTab === 'resume' ? 'border-slate-600 text-slate-600' : 'border-transparent text-gray-500 hover:text-slate-600'"
                  class="pb-3 border-b-2 font-medium text-sm transition"
                >
                  이력서
                </button>
                <button
                  @click="activeTab = 'coverLetter'"
                  :class="activeTab === 'coverLetter' ? 'border-slate-600 text-slate-600' : 'border-transparent text-gray-500 hover:text-slate-600'"
                  class="pb-3 border-b-2 font-medium text-sm transition"
                >
                  자기소개서
                </button>
                <button
                  @click="activeTab = 'pdf'"
                  :class="activeTab === 'pdf' ? 'border-slate-600 text-slate-600' : 'border-transparent text-gray-500 hover:text-slate-600'"
                  class="pb-3 border-b-2 font-medium text-sm transition flex items-center gap-2"
                >
                  <Download :size="16" />
                  PDF
                </button>
              </div>
            </div>

            <!-- Resume Tab -->
            <div v-if="activeTab === 'resume'" class="space-y-8">
              <!-- PDF Files List -->
              <div v-if="portfolios.length > 0">
                <h3 class="text-base font-semibold text-slate-600 mb-4">
                  첨부 파일 <span class="text-gray-500 font-normal">{{ portfolios.length }}개</span>
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="file in portfolios" :key="file.id" class="border border-gray-200 rounded-lg p-4">
                    <div
                      class="bg-white border border-gray-200 rounded p-3 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer"
                      @click="activeTab = 'pdf'"
                    >
                      <div class="flex items-center gap-2 min-w-0">
                        <div class="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                          <FileText :size="16" class="text-red-600" />
                        </div>
                        <span class="text-sm text-slate-600 truncate">{{ file.originalFilename }}</span>
                      </div>
                      <Download :size="16" class="text-gray-400 ml-2 flex-shrink-0" @click.stop="downloadFile(file)" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Career -->
              <div v-if="resumeData.careers.length > 0">
                <h3 class="text-base font-semibold text-slate-600 mb-4">경력사항</h3>
                <div class="space-y-3">
                  <div v-for="career in resumeData.careers" :key="career.id" class="p-4 bg-white border border-gray-200 rounded">
                    <div class="flex justify-between items-start mb-2">
                      <h4 class="font-semibold text-slate-600">{{ career.companyName }}</h4>
                      <span class="text-sm text-gray-500">
                        {{ career.startDate }} - {{ career.endDate || '현재' }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">{{ career.position }}</p>
                  </div>
                </div>
              </div>

              <!-- Education -->
              <div v-if="resumeData.educations.length > 0">
                <h3 class="text-base font-semibold text-slate-600 mb-4">학력사항</h3>
                <div class="space-y-3">
                  <div v-for="education in resumeData.educations" :key="education.id" class="p-4 bg-white border border-gray-200 rounded">
                    <h4 class="font-semibold text-slate-600 mb-1">{{ education.schoolName }}</h4>
                    <p class="text-sm text-gray-600">{{ education.major }} ({{ education.degree }})</p>
                  </div>
                </div>
              </div>

              <!-- Certificates -->
              <div v-if="resumeData.certificates.length > 0">
                <h3 class="text-base font-semibold text-slate-600 mb-4">자격증</h3>
                <div class="space-y-2">
                  <div v-for="cert in resumeData.certificates" :key="cert.id" class="flex justify-between items-center p-3 bg-white border border-gray-200 rounded">
                    <span class="text-sm text-slate-600 font-medium">{{ cert.name }}</span>
                    <span class="text-sm text-gray-500">{{ cert.acquiredDate }}</span>
                  </div>
                </div>
              </div>

              <!-- Languages -->
              <div v-if="resumeData.languages.length > 0">
                <h3 class="text-base font-semibold text-slate-600 mb-4">어학능력</h3>
                <div class="space-y-3">
                  <div v-for="lang in resumeData.languages" :key="lang.id" class="p-4 bg-white border border-gray-200 rounded">
                    <div class="flex justify-between items-start mb-2">
                      <h4 class="font-semibold text-slate-600">{{ lang.languageName }}</h4>
                      <span class="text-sm text-gray-500">{{ lang.testDate }}</span>
                    </div>
                    <div class="text-sm text-gray-600 space-y-1">
                      <p>{{ lang.testName }}: {{ lang.grade }}</p>
                      <p>회화 수준: {{ lang.speakingLevel }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Skills -->
              <div v-if="resumeData.resumeSkills.length > 0">
                <h3 class="text-base font-semibold text-slate-600 mb-4">보유 스킬</h3>
                <div class="flex flex-wrap gap-2">
                  <span v-for="skill in resumeData.resumeSkills" :key="skill.id" class="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm">
                    {{ skill.name }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Cover Letter Tab -->
            <div v-if="activeTab === 'coverLetter'" class="space-y-6">
              <div v-if="coverLetterDescriptions.length > 0">
                <div v-for="description in coverLetterDescriptions" :key="description.id" class="mb-6">
                  <h3 class="text-base font-semibold text-slate-600 mb-2">
                    {{ description.coverLetterTitle }}
                  </h3>
                  <div class="p-4 bg-white border border-gray-200 rounded">
                    <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {{ description.description }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else class="p-4 bg-white border border-gray-200 rounded text-center text-gray-500">
                작성된 자기소개서가 없습니다.
              </div>
            </div>

            <!-- PDF Tab -->
            <div v-if="activeTab === 'pdf'">
              <!-- 🔧 수정: resumeData.id (이력서 ID)를 전달 -->
              <PdfViewer v-if="resumeData && portfolios.length > 0" :resume-id="resumeData.id" />
              <div v-else class="text-center py-8 text-gray-500">
                PDF 파일이 없습니다.
              </div>
            </div>
          </div>
        </div>

        <!-- Right Timeline -->
        <div class="w-96 bg-white border-l border-gray-200 overflow-y-auto hidden lg:block flex-shrink-0">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-slate-600">활동 내역</h3>
            </div>
            <div class="space-y-1">
              <div v-for="(item, index) in timelineItems" :key="item.id">
                <div v-if="index === 0 || item.date !== timelineItems[index - 1]?.date" class="text-xs font-semibold text-gray-500 mb-2 mt-6 first:mt-0">
                  {{ item.date }}
                </div>
                <div class="flex gap-3 pb-4">
                  <div class="flex flex-col items-center">
                    <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User :size="14" class="text-gray-500" />
                    </div>
                    <div v-if="index !== timelineItems.length - 1" class="w-px h-full bg-gray-200 my-1"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between mb-1">
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-semibold text-slate-600">{{ item.title }}</h4>
                        <p class="text-xs text-gray-500">{{ item.subtitle }}</p>
                      </div>
                      <span class="text-xs text-gray-400 ml-2 flex-shrink-0">{{ item.time }}</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">{{ item.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 로딩 중 -->
    <div v-else class="flex-1 flex items-center justify-center">
      <p>데이터를 불러오는 중입니다...</p>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
