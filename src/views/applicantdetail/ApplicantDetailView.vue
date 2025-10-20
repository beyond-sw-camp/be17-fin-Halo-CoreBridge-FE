<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { User, FileText, Download } from 'lucide-vue-next';
import ApplicantSidebar from '@/components/Applicant/ApplicantSidebar.vue';

// Types
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

interface Career {
  id: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
}

interface Education {
  id: number;
  schoolName: string;
  major: string;
  degree: string;
}

interface Certificate {
  id: number;
  name: string;
  acquiredDate: string;
}

interface Language {
  id: number;
  languageName: string;
  testName: string;
  grade: string;
  speakingLevel: string;
  testDate: string;
}

interface Skill {
  id: number;
  name: string;
}

interface Portfolio {
  id: number;
  name: string;
  url: string;
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

// Active Tab
const activeTab = ref<'resume' | 'coverLetter'>('resume');

// Mock Data
const applicant = ref<ApplicantInfo>({
  id: 1,
  name: '최태오',
  email: 'to.choi@ninehire.com',
  phone: '01999999999',
  appliedDate: '2025.09.29 (17일 전)',
  position: '[생활] 채용솔루션 UI/UX디자이너 모집',
  status: '회상 면접',
  statusColor: 'blue'
});

const careers = ref<Career[]>([
  {
    id: 1,
    companyName: '네이버',
    position: 'UI/UX 디자이너',
    startDate: '2022.03',
    endDate: '2024.08'
  },
  {
    id: 2,
    companyName: '카카오',
    position: '프로덕트 디자이너',
    startDate: '2020.01',
    endDate: '2022.02'
  }
]);

const educations = ref<Education[]>([
  {
    id: 1,
    schoolName: '서울대학교',
    major: '시각디자인학과',
    degree: '학사'
  }
]);

const certificates = ref<Certificate[]>([
  {
    id: 1,
    name: '컴퓨터그래픽스운용기능사',
    acquiredDate: '2019.06'
  },
  {
    id: 2,
    name: 'GTQ 1급',
    acquiredDate: '2018.12'
  }
]);

const languages = ref<Language[]>([
  {
    id: 1,
    languageName: '영어',
    testName: 'TOEIC',
    grade: '950',
    speakingLevel: '상',
    testDate: '2024.05'
  }
]);

const skills = ref<Skill[]>([
  { id: 1, name: 'Figma' },
  { id: 2, name: 'Sketch' },
  { id: 3, name: 'Adobe XD' },
  { id: 4, name: 'Photoshop' },
  { id: 5, name: 'Illustrator' },
  { id: 6, name: 'Prototyping' }
]);

const portfolios = ref<Portfolio[]>([
  {
    id: 1,
    name: '샘플 포트폴리오_최태오.pdf',
    url: '/files/portfolio1.pdf'
  },
  {
    id: 2,
    name: '샘플 이력서_최태오.pdf',
    url: '/files/resume.pdf'
  }
]);

const coverLetter = ref<string>(`Mobile & Web UI Design 및 서비스 구축 전반을 도맡아 왔습니다. 또한 Web, Android, IOS 실무 경험, 디자인 업무와 관련한 툴을 3년 이상 다뤄왔습니다.

간단한 자기 소개를 해주세요

안녕하십니까. 안젠하십니까. 안젠하십니까. 안정하십니까. 안정하십니까.`);

const recruiterNotes = ref<RecruiterNote[]>([
  {
    id: 1,
    author: 'Halo',
    content: '포트폴리오 검토 완료. UI 완성도가 매우 높음. 다음 단계 면접 진행 예정.',
    createdAt: '2025. 10. 14 오전 11:05'
  },
  {
    id: 2,
    author: 'Halo',
    content: '경력사항 확인 완료. 대기업 경험 보유.',
    createdAt: '2025. 10. 01 오후 3:45'
  }
]);

const timelineItems = ref<TimelineItem[]>([
  {
    id: 1,
    title: '지원자 단계 이동',
    subtitle: 'Halo 님이 실행',
    description: '접수 >> 화상 면접 단계로 이동',
    date: '2025. 10. 14',
    time: '오전 11:05'
  },
  {
    id: 2,
    title: '지원자 단계 이동',
    subtitle: 'Halo 님이 실행',
    description: '과제 평가 >> 검수 단계로 이동',
    date: '2025. 10. 14',
    time: '오전 9:14'
  },
  {
    id: 3,
    title: '지원자 단계 이동',
    subtitle: 'Halo 님이 실행',
    description: '회신 면접 >> 과제 평가 단계로 이동',
    date: '2025. 10. 01',
    time: '오후 3:45'
  },
  {
    id: 4,
    title: '지원자 단계 이동',
    subtitle: 'Halo 님이 실행',
    description: '과제 평가 >> 회신 면접 단계로 이동',
    date: '2025. 10. 01',
    time: '오후 3:45'
  },
  {
    id: 5,
    title: '지원자 단계 이동',
    subtitle: 'Halo 님이 실행',
    description: '과제 평가 >> 회신 면접 단계로 이동',
    date: '2025. 09. 29',
    time: '발표일'
  }
]);

// Methods
const downloadFile = (file: Portfolio) => {
  console.log('파일 다운로드:', file.name);
};

const addRecruiterNote = (content: string) => {
  recruiterNotes.value.unshift({
    id: Date.now(),
    author: 'Halo',
    content: content,
    createdAt: new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(/\. /g, '. ')
  });
};

// Lifecycle
onMounted(() => {
  console.log('지원자 상세 정보 로드');
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Left Sidebar -->
    <ApplicantSidebar
      :applicant="applicant"
      :recruiter-notes="recruiterNotes"
      @add-note="addRecruiterNote"
    />

    <!-- Center Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Header -->
      <div class="bg-white border-b border-gray-200 px-6 py-3">
        <div class="flex items-center gap-2 text-sm">
          <span class="text-gray-500">지원자 관리</span>
          <span class="text-gray-400">></span>
          <span class="text-slate-600">{{ applicant.position }}</span>
        </div>
      </div>

      <!-- Content Area with Right Sidebar -->
      <div class="flex flex-1 overflow-hidden min-w-0">
        <!-- Main Content -->
        <div class="flex-1 overflow-y-auto overflow-x-auto p-6 min-w-0">
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
              </div>
            </div>

            <!-- Resume Tab -->
            <div v-if="activeTab === 'resume'" class="space-y-8">
              <!-- PDF Files -->
              <!-- PDF Files -->
              <div>
                <h3 class="text-base font-semibold text-slate-600 mb-4">PDF 파일 미리보기
                  <span class="text-gray-500 font-normal">{{ portfolios.length }}개</span>
                </h3>

                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div class="border border-gray-200 rounded-lg p-4" v-if="portfolios[0]">
                    <h4 class="text-sm font-semibold text-slate-600 mb-3">포트폴리오</h4>
                    <div class="bg-white border border-gray-200 rounded p-3 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer"
                         @click="downloadFile(portfolios[0])">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                          <FileText :size="16" class="text-red-600" />
                        </div>
                        <span class="text-sm text-slate-600">{{ portfolios[0].name }}</span>
                      </div>
                      <Download :size="16" class="text-gray-400" />
                    </div>
                  </div>

                  <div class="border border-gray-200 rounded-lg p-4" v-if="portfolios[1]">
                    <h4 class="text-sm font-semibold text-slate-600 mb-3">이력서</h4>
                    <div class="bg-white border border-gray-200 rounded p-3 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer"
                         @click="downloadFile(portfolios[1])">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                          <FileText :size="16" class="text-red-600" />
                        </div>
                        <span class="text-sm text-slate-600">{{ portfolios[1].name }}</span>
                      </div>
                      <Download :size="16" class="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

<!--                &lt;!&ndash; Additional Files &ndash;&gt;-->
<!--                <div v-if="portfolios[0]">-->
<!--                  <h4 class="text-sm font-semibold text-slate-600 mb-3">문서 파일</h4>-->
<!--                  <div class="space-y-2">-->
<!--                    <div class="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded hover:bg-gray-50 transition cursor-pointer"-->
<!--                         @click="downloadFile(portfolios[0])">-->
<!--                      <FileText :size="18" class="text-gray-400" />-->
<!--                      <span class="text-sm text-slate-600 flex-1">{{ portfolios[0].name }}</span>-->
<!--                      <Download :size="16" class="text-gray-400" />-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->

<!--                <div class="mt-6" v-if="portfolios[1]">-->
<!--                  <h4 class="text-sm font-semibold text-slate-600 mb-3">이력서</h4>-->
<!--                  <div class="space-y-2">-->
<!--                    <div class="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded hover:bg-gray-50 transition cursor-pointer"-->
<!--                         @click="downloadFile(portfolios[1])">-->
<!--                      <FileText :size="18" class="text-gray-400" />-->
<!--                      <span class="text-sm text-slate-600 flex-1">{{ portfolios[1].name }}</span>-->
<!--                      <Download :size="16" class="text-gray-400" />-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->



              <!-- Career -->
              <div>
                <h3 class="text-base font-semibold text-slate-600 mb-4">경력사항</h3>
                <div class="space-y-3">
                  <div v-for="career in careers" :key="career.id" class="p-4 bg-white border border-gray-200 rounded">
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
              <div>
                <h3 class="text-base font-semibold text-slate-600 mb-4">학력사항</h3>
                <div class="space-y-3">
                  <div v-for="education in educations" :key="education.id" class="p-4 bg-white border border-gray-200 rounded">
                    <h4 class="font-semibold text-slate-600 mb-1">{{ education.schoolName }}</h4>
                    <p class="text-sm text-gray-600">{{ education.major }} ({{ education.degree }})</p>
                  </div>
                </div>
              </div>

              <!-- Certificates -->
              <div>
                <h3 class="text-base font-semibold text-slate-600 mb-4">자격증</h3>
                <div class="space-y-2">
                  <div v-for="cert in certificates" :key="cert.id" class="flex justify-between items-center p-3 bg-white border border-gray-200 rounded">
                    <span class="text-sm text-slate-600 font-medium">{{ cert.name }}</span>
                    <span class="text-sm text-gray-500">{{ cert.acquiredDate }}</span>
                  </div>
                </div>
              </div>

              <!-- Languages -->
              <div>
                <h3 class="text-base font-semibold text-slate-600 mb-4">어학능력</h3>
                <div class="space-y-3">
                  <div v-for="lang in languages" :key="lang.id" class="p-4 bg-white border border-gray-200 rounded">
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
              <div>
                <h3 class="text-base font-semibold text-slate-600 mb-4">보유 스킬</h3>
                <div class="flex flex-wrap gap-2">
                  <span v-for="skill in skills" :key="skill.id" class="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm">
                    {{ skill.name }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Cover Letter Tab -->
            <div v-if="activeTab === 'coverLetter'">
              <div>
                <h3 class="text-base font-semibold text-slate-600 mb-4">직무 경험</h3>
                <div class="p-4 bg-white border border-gray-200 rounded">
                  <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ coverLetter }}</p>
                </div>
              </div>

              <div class="mt-8">
                <h3 class="text-base font-semibold text-slate-600 mb-4">간단한 자기 소개를 해주세요</h3>
                <div class="p-4 bg-white border border-gray-200 rounded">
                  <p class="text-sm text-gray-700 leading-relaxed">안녕하십니까.</p>
                </div>
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
                <!-- Date header -->
                <div v-if="index === 0 || item.date !== timelineItems[index - 1]?.date"
                     class="text-xs font-semibold text-gray-500 mb-2 mt-6 first:mt-0">
                  {{ item.date }}
                </div>

                <!-- Timeline item -->
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
