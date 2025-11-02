<script setup lang="ts">
import { ref, inject, type Ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // useRoute 임포트
import { Plus, Search, X, Upload } from 'lucide-vue-next';
import type {
  Career,
  Certificate,
  Education,
  Language,
  OverseasExperience,
  ResumeSkill,
  ResumeCreateRequest,
  ResumeUpdateRequest,
  ResumeResponse,
  CoverLetterDescriptionRequest,
  CoverLetterDescriptionResponse
} from '@/types/resume/ResumeTypes';
import { getCoverLetterTitles } from '@/api/jobposting';
import { createCoverLetterDescriptions, getCoverLetterDescriptions } from '@/api/resume';

// Layout에서 제공하는 탭 컨트롤
const currentTab = inject<Ref<number>>('currentTab');
const goToTab = inject<(tabId: number) => void>('goToTab');

// Vue Router의 useRoute 훅 사용
const route = useRoute();

// Props (수정 모드일 때 기존 데이터 전달)
interface Props {
  resumeData?: ResumeResponse;
  mode?: 'create' | 'update';
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create'
});

// 🔥 NEW: 로딩 상태
const isLoadingUserInfo = ref(false);

// 기본 인적사항
const nameKo = ref('');
const gender = ref('male');
const birthDate = ref('');
const phone = ref('');
const email = ref('');

// 자기소개서 질문 목록
interface CoverLetterTitle {
  id: number;
  title: string;
  subTitle: string;
}
const coverLetterTitles = ref<CoverLetterTitle[]>([]);
// 자기소개서 내용 (질문 ID에 매핑)
const coverLetterDescriptions = ref<Record<number, CoverLetterDescriptionRequest>>({});

// 백엔드 타입에 맞춘 데이터
const educations = ref<Education[]>([
  {
    schoolName: '',
    major: '',
    degree: '고졸'
  },
  {
    schoolName: '',
    major: '',
    degree: '학사'
  }
]);

const careers = ref<Career[]>([
  {
    companyName: '',
    position: '',
    startDate: '',
    endDate: null
  }
]);

const certificates = ref<Certificate[]>([]);
const languages = ref<Language[]>([]);
const overseasExperiences = ref<OverseasExperience[]>([]);
const resumeSkills = ref<ResumeSkill[]>([]);

// 파일
const resumeFile = ref<File | null>(null);
const portfolioFile = ref<File | null>(null);

// 🔥 NEW: 유저 기본 정보 조회 함수
const fetchUserInfo = async () => {
  try {
    isLoadingUserInfo.value = true;

    const response = await fetch('/api/users/resume-info', {
      method: 'GET',
      credentials: 'include', // 쿠키 포함
    });

    if (!response.ok) {
      throw new Error('유저 정보 조회 실패');
    }

    const result = await response.json();

    // BaseResponse 구조: { success, code, message, results }
    if (result.success && result.results) {
      const userInfo = result.results;

      // 유저 정보로 폼 초기화
      nameKo.value = userInfo.name || '';
      email.value = userInfo.email || '';
      phone.value = userInfo.phone || '';
      birthDate.value = userInfo.birth ? formatDate(userInfo.birth) : '';
      gender.value = userInfo.gender === '남성' ? 'male' : 'female';
    }
  } catch (error) {
    console.error('유저 정보 조회 에러:', error);
    alert('유저 정보를 불러오는데 실패했습니다.');
  } finally {
    isLoadingUserInfo.value = false;
  }
};

// 날짜 포맷 함수 (yyyy-mm-dd → yyyy.mm.dd)
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

// 기존 데이터 로드 (수정 모드)
if (props.mode === 'update' && props.resumeData) {
  educations.value = props.resumeData.educations.length > 0 ? props.resumeData.educations : educations.value;
  careers.value = props.resumeData.careers.length > 0 ? props.resumeData.careers : careers.value;
  certificates.value = props.resumeData.certificates;
  languages.value = props.resumeData.languages;
  overseasExperiences.value = props.resumeData.overseasExperiences;
  resumeSkills.value = props.resumeData.resumeSkills;
}

// Methods
const saveTemporary = async () => {
  try {
    const tempData = {
      coverLetterDescriptions: coverLetterDescriptions.value,
      jobPostingId: props.jobPostingId,
      careers: careers.value,
      certificates: certificates.value,
      educations: educations.value,
      languages: languages.value,
      overseasExperiences: overseasExperiences.value,
      resumeSkills: resumeSkills.value
    };

    localStorage.setItem('tempResume', JSON.stringify(tempData));
    alert('임시 저장되었습니다.');
  } catch (error) {
    console.error('임시 저장 실패:', error);
    alert('임시 저장에 실패했습니다.');
  }
};

const nextStep = () => {
  if (goToTab && currentTab) {
    goToTab(currentTab.value + 1);
  }
};

const prevStep = () => {
  if (goToTab && currentTab) {
    goToTab(currentTab.value - 1);
  }
};

const addEducation = () => {
  educations.value.push({
    schoolName: '',
    major: '',
    degree: '석사'
  });
};

const removeEducation = (index: number) => {
  educations.value.splice(index, 1);
};

const addCareer = () => {
  careers.value.push({
    companyName: '',
    position: '',
    startDate: '',
    endDate: null
  });
};

const removeCareer = (index: number) => {
  careers.value.splice(index, 1);
};

const addCertificate = () => {
  certificates.value.push({
    name: '',
    acquiredDate: ''
  });
};

const removeCertificate = (index: number) => {
  certificates.value.splice(index, 1);
};

const addLanguage = () => {
  languages.value.push({
    name: '',
    testName: '',
    languageName: '',
    grade: '',
    speakingLevel: '',
    testDate: ''
  });
};

const removeLanguage = (index: number) => {
  languages.value.splice(index, 1);
};

const addOverseasExperience = () => {
  overseasExperiences.value.push({
    type: '',
    country: '',
    startDate: '',
    endDate: '',
    note: ''
  });
};

const removeOverseasExperience = (index: number) => {
  overseasExperiences.value.splice(index, 1);
};

const addSkill = () => {
  const skillName = prompt('스킬명을 입력하세요:');
  if (skillName) {
    resumeSkills.value.push({
      name: skillName
    });
  }
};

const removeSkill = (index: number) => {
  resumeSkills.value.splice(index, 1);
};

const handleFileUpload = (event: Event, type: 'resume' | 'portfolio') => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    if (type === 'resume') {
      resumeFile.value = target.files[0];
    } else {
      portfolioFile.value = target.files[0];
    }
  }
};

// 🔥 FIXED: 백엔드 API에 맞춘 제출 함수
const submitApplication = async () => {
  try {
    // 유효성 검사
    if (!validateForm()) {
      return;
    }

    const jobPostingId = Number(route.params.jobpostId); // 라우트 파라미터에서 jobPostingId 가져오기
    if (isNaN(jobPostingId)) {
      throw new Error('유효하지 않은 채용 공고 ID입니다.');
    }

    // DTOs를 JSON Blob으로 변환
    const resumeDto = {
      description: "자기소개서 내용은 별도 API로 처리됩니다.", // 더 이상 사용하지 않음
      jobPostingId: jobPostingId,
      careers: careers.value.filter(c => c.companyName && c.position).map(c => ({
        ...c,
        startDate: c.startDate ? `${c.startDate}T00:00:00` : '', // LocalDateTime 형식으로 변환
        endDate: c.endDate ? `${c.endDate}T00:00:00` : null // null이면 null, 아니면 LocalDateTime 형식으로 변환
      })),
      certificates: certificates.value.filter(c => c.name && c.acquiredDate).map(c => ({
        ...c,
        acquiredDate: c.acquiredDate ? `${c.acquiredDate}T00:00:00` : '' // LocalDateTime 형식으로 변환
      })),
      educations: educations.value.filter(e => e.schoolName && e.major),
      languages: languages.value.filter(l => l.languageName && l.testName).map(l => ({
        ...l,
        testDate: l.testDate ? `${l.testDate}T00:00:00` : '' // LocalDateTime 형식으로 변환
      })),
      overseasExperiences: overseasExperiences.value.filter(o => o.country && o.type).map(o => ({
        ...o,
        startDate: o.startDate ? `${o.startDate}T00:00:00` : '', // LocalDateTime 형식으로 변환
        endDate: o.endDate ? `${o.endDate}T00:00:00` : '', // LocalDateTime 형식으로 변환
        note: o.note || ''
      })),
      resumeSkills: resumeSkills.value.filter(s => s.name)
    };

    // 🔥 FormData 객체 생성
    const formData = new FormData();

    // 🔥 DTO를 Blob으로 변환하여 추가
    const dtoBlob = new Blob([JSON.stringify(resumeDto)], {
      type: 'application/json'
    });
    formData.append('resume', dtoBlob);

    // 파일 첨부 (있는 경우)
    if (resumeFile.value) {
      formData.append('file', resumeFile.value);
    }

    let response;
    let resumeId: number;

    if (props.mode === 'create') {
      // 🔥 FIXED: POST /api/jobposts/{jobpostId}/applies (multipart/form-data)
      response = await fetch(`/api/jobposts/${jobPostingId}/applies`, {
        method: 'POST',
        credentials: 'include', // 쿠키 포함 (인증용)
        body: formData
        // Content-Type은 브라우저가 자동으로 설정 (multipart/form-data; boundary=...)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '이력서 생성 실패');
      }
      resumeId = await response.json();

    } else {
      // 🔥 FIXED: PATCH /api/jobposts/{jobpostId}/applies/{resumeId} (JSON)
      if (!props.resumeData?.id) {
        throw new Error('이력서 ID가 없습니다.');
      }
      response = await fetch(`/api/jobposts/${jobPostingId}/applies/${props.resumeData.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeDto)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '이력서 수정 실패');
      }
      resumeId = props.resumeData.id; // 수정 모드에서는 기존 resumeId 사용
    }

    // 자기소개서 내용 저장/수정
    if (Object.keys(coverLetterDescriptions.value).length > 0) {
      await createCoverLetterDescriptions(jobPostingId, resumeId, Object.values(coverLetterDescriptions.value).map(desc => ({
        ...desc,
        resumeId: resumeId // resumeId를 각 description에 할당
      })));
    }

    // 포트폴리오 파일이 있다면 별도 업로드
    if (portfolioFile.value) {
      await uploadPortfolio(resumeId);
    }

    alert('지원서가 제출되었습니다.');
    // 성공 후 페이지 이동
    // window.location.href = '/applications';

  } catch (error: any) {
    console.error('제출 실패:', error);
    alert(error.message || '지원서 제출에 실패했습니다.');
  }
};

// 포트폴리오 업로드 함수 (PDF API 사용)
const uploadPortfolio = async (resumeId: number) => {
  if (!portfolioFile.value) return;

  const formData = new FormData();
  formData.append('file', portfolioFile.value);
  formData.append('pdf_directory', 'portfolios');
  formData.append('resumeId', String(resumeId));

  try {
    const response = await fetch('/api/pdf', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    if (!response.ok) {
      throw new Error('포트폴리오 업로드 실패');
    }
  } catch (error) {
    console.error('포트폴리오 업로드 실패:', error);
    // 포트폴리오 업로드 실패해도 이력서는 제출된 상태
    alert('포트폴리오 업로드에 실패했습니다. 나중에 다시 시도해주세요.');
  }
};

const validateForm = (): boolean => {
  // 기본 유효성 검사
  if (!nameKo.value || !email.value) {
    alert('필수 항목을 입력해주세요.');
    return false;
  }

  if (educations.value.length === 0 || !educations.value[0].schoolName) {
    alert('최소 하나의 학력 정보를 입력해주세요.');
    return false;
  }

  return true;
};

// 임시 저장된 데이터 불러오기
const loadTemporaryData = () => {
  const tempData = localStorage.getItem('tempResume');
  if (tempData) {
    const data = JSON.parse(tempData);
    coverLetterDescriptions.value = data.coverLetterDescriptions || [];
    careers.value = data.careers || careers.value;
    certificates.value = data.certificates || [];
    educations.value = data.educations || educations.value;
    languages.value = data.languages || [];
    overseasExperiences.value = data.overseasExperiences || [];
    resumeSkills.value = data.resumeSkills || [];
  }
};

// 🔥 NEW: 컴포넌트 마운트 시 유저 정보 및 자기소개서 질문 조회
onMounted(async () => {
  // 자기소개서 질문 목록 조회
  const jobPostingId = Number(route.params.jobpostId);

  console.log('=== ResumeView onMounted ===');
  console.log('jobPostingId:', jobPostingId);

  if (isNaN(jobPostingId)) {
    console.warn('jobPostingId가 유효하지 않아 자기소개서 질문을 불러올 수 없습니다.');
    alert('채용공고 정보를 찾을 수 없습니다.');
    return;
  }

  try {
    console.log('자기소개서 질문 조회 시작...');
    const response = await getCoverLetterTitles(jobPostingId);
    console.log('자기소개서 질문 응답:', response);

    if (response.success && response.results) {
      coverLetterTitles.value = response.results;
      console.log('불러온 질문들:', coverLetterTitles.value);

      // 자기소개서 내용 초기화
      coverLetterDescriptions.value = {}; // 기존 객체 초기화
      coverLetterTitles.value.forEach(title => {
        coverLetterDescriptions.value[title.id] = {
          description: '',
          resumeId: props.resumeData?.id || 0,
          coverLetterTitleId: title.id
        };
      });

      console.log('초기화된 descriptions:', coverLetterDescriptions.value);
    } else {
      console.error('API 응답 실패:', response);
      alert('자기소개서 질문을 불러오는데 실패했습니다.');
    }
  } catch (error) {
    console.error('자기소개서 질문 조회 에러:', error);
    alert('자기소개서 질문을 불러오는데 실패했습니다.');
  }

  if (props.mode === 'create') {
    // 생성 모드일 때만 유저 정보 조회
    await fetchUserInfo();

    // 임시 저장 데이터 확인
    const hasTempData = localStorage.getItem('tempResume');
    if (hasTempData && confirm('임시 저장된 데이터가 있습니다. 불러오시겠습니까?')) {
      loadTemporaryData();
    }
  } else if (props.mode === 'update' && props.resumeData?.id) {
    // 수정 모드일 때 기존 자기소개서 내용 조회
    try {
      const descriptions = await getCoverLetterDescriptions(props.resumeData.id, jobPostingId);
      if (descriptions) {
        coverLetterDescriptions.value = coverLetterTitles.value.map(title => {
          const existingDesc = descriptions.find(d => d.coverLetterId === title.id);
          return {
            description: existingDesc ? existingDesc.description : '',
            resumeId: props.resumeData?.id || 0,
            coverLetterTitleId: title.id
          };
        });
      }
    } catch (error) {
      console.error('자기소개서 내용 조회 실패:', error);
      alert('기존 자기소개서 내용을 불러오는데 실패했습니다.');
    }
  }
});
</script>

<template>
  <!-- 로딩 오버레이 -->
  <div v-if="isLoadingUserInfo" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg">
      <p class="text-lg">사용자 정보를 불러오는 중...</p>
    </div>
  </div>

  <!-- 기본내용 탭 -->
  <div v-if="currentTab === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div class="space-y-12">
      <!-- 기본 사항 -->
      <section>
        <h2 class="text-lg font-semibold text-slate-600 mb-6 pb-3 border-b-2 border-slate-600">
          기본 사항
        </h2>
        <div class="space-y-6">
          <p class="text-sm text-gray-600">
            ⓘ 기본사항은 회원가입 시 입력한 정보로 자동 입력됩니다.
          </p>

          <!-- Row 1: 성명(한글) -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                성명(한글) <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="nameKo"
                placeholder="김철수"
                readonly
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
              <p class="text-xs text-gray-500 mt-1">회원정보에서 수정 가능합니다</p>
            </div>
          </div>

          <!-- Row 2: 성별, 생년월일 -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                성별 <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-6 pt-2">
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="gender"
                    value="male"
                    disabled
                    class="w-4 h-4 text-slate-600"
                  />
                  <span class="ml-2 text-sm text-gray-700">남성</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="gender"
                    value="female"
                    disabled
                    class="w-4 h-4 text-slate-600"
                  />
                  <span class="ml-2 text-sm text-gray-700">여성</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                생년월일 <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="birthDate"
                placeholder="1998.11.11"
                readonly
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
            </div>
          </div>

          <!-- Row 3: 이메일 -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                v-model="email"
                placeholder="example@gmail.com"
                readonly
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
            </div>
          </div>

          <!-- Row 4: 휴대전화번호 -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                휴대전화번호 <span class="text-red-500">*</span>
              </label>
              <input
                type="tel"
                v-model="phone"
                placeholder="010-5498-7544"
                readonly
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Footer Buttons -->
    <div class="flex justify-end items-center mt-12 pt-8 border-t border-gray-200">
      <div class="flex gap-3">
        <button
          @click="saveTemporary"
          class="px-8 py-2.5 text-slate-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          임시저장
        </button>
        <button
          @click="nextStep"
          class="px-8 py-2.5 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors font-medium"
        >
          다음
        </button>
      </div>
    </div>
  </div>

  <!-- 상세경력/자격 탭 -->
  <div v-else-if="currentTab === 1" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div class="space-y-12">
      <!-- 경력 -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-600 pb-3 border-b-2 border-slate-600 flex-1">경력</h2>
        </div>
        <div class="space-y-4">
          <div
            v-for="(career, index) in careers"
            :key="index"
            class="p-6 border border-gray-200 rounded-lg relative"
          >
            <button
              v-if="careers.length > 1"
              @click="removeCareer(index)"
              class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <X class="w-5 h-5" />
            </button>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    회사명 <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="career.companyName"
                    placeholder="회사명"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    직위 <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="career.position"
                    placeholder="직위"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  재직기간 <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-2 items-center">
                  <input
                    type="date"
                    v-model="career.startDate"
                    placeholder="재직 시작일자 (YYYY-MM-DD)"
                    class="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                  />
                  <span class="text-gray-500">~</span>
                  <input
                    type="date"
                    v-model="career.endDate"
                    placeholder="퇴사일자 (재직중이면 비워두기)"
                    class="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-center pt-2">
            <button
              @click="addCareer"
              class="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Plus class="w-4 h-4" />
              추가
            </button>
          </div>
        </div>
      </section>

      <!-- 자격증 -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-600 pb-3 border-b-2 border-slate-600 flex-1">자격증</h2>
        </div>
        <div v-if="certificates.length === 0" class="text-center py-12 border border-gray-200 rounded-lg">
          <p class="text-gray-500 mb-4">자격증을 추가해주세요</p>
          <button
            @click="addCertificate"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Plus class="w-4 h-4" />
            추가
          </button>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="(cert, index) in certificates"
            :key="index"
            class="p-6 border border-gray-200 rounded-lg relative"
          >
            <button
              @click="removeCertificate(index)"
              class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <X class="w-5 h-5" />
            </button>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  자격증명 <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="cert.name"
                  placeholder="정보처리기사"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  취득일 <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  v-model="cert.acquiredDate"
                  placeholder="2023-06-01"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-center pt-2">
            <button
              @click="addCertificate"
              class="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Plus class="w-4 h-4" />
              추가
            </button>
          </div>
        </div>
      </section>

      <!-- 어학 -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-600 pb-3 border-b-2 border-slate-600 flex-1">어학</h2>
        </div>
        <div v-if="languages.length === 0" class="text-center py-12 border border-gray-200 rounded-lg">
          <p class="text-gray-500 mb-4">어학 능력을 추가해주세요</p>
          <button
            @click="addLanguage"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Plus class="w-4 h-4" />
            추가
          </button>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="(lang, index) in languages"
            :key="index"
            class="p-6 border border-gray-200 rounded-lg relative"
          >
            <button
              @click="removeLanguage(index)"
              class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <X class="w-5 h-5" />
            </button>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  언어명 <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="lang.languageName"
                  placeholder="영어"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  시험명 <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="lang.testName"
                  placeholder="TOEIC"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  등급/점수 <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="lang.grade"
                  placeholder="900"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  회화수준
                </label>
                <input
                  type="text"
                  v-model="lang.speakingLevel"
                  placeholder="상"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  취득일
                </label>
                <input
                  type="date"
                  v-model="lang.testDate"
                  placeholder="2023-06-01"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-center pt-2">
            <button
              @click="addLanguage"
              class="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Plus class="w-4 h-4" />
              추가
            </button>
          </div>
        </div>
      </section>

      <!-- 해외경험 -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-600 pb-3 border-b-2 border-slate-600 flex-1">해외경험</h2>
        </div>
        <div v-if="overseasExperiences.length === 0" class="text-center py-12 border border-gray-200 rounded-lg">
          <p class="text-gray-500 mb-4">해외경험을 추가해주세요</p>
          <button
            @click="addOverseasExperience"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Plus class="w-4 h-4" />
            추가
          </button>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="(exp, index) in overseasExperiences"
            :key="index"
            class="p-6 border border-gray-200 rounded-lg relative"
          >
            <button
              @click="removeOverseasExperience(index)"
              class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <X class="w-5 h-5" />
            </button>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  구분 <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="exp.type"
                  placeholder="유학, 어학연수, 근무 등"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  국가 <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="exp.country"
                  placeholder="미국"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  시작일 <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  v-model="exp.startDate"
                  placeholder="2020-01-01"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  종료일 <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  v-model="exp.endDate"
                  placeholder="2021-12-31"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  비고
                </label>
                <textarea
                  v-model="exp.note"
                  rows="2"
                  placeholder="추가 정보 입력"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="flex justify-center pt-2">
            <button
              @click="addOverseasExperience"
              class="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Plus class="w-4 h-4" />
              추가
            </button>
          </div>
        </div>
      </section>

      <!-- 스킬 -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-600 pb-3 border-b-2 border-slate-600 flex-1">스킬</h2>
        </div>
        <div class="border border-gray-200 rounded-lg p-6">
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="(skill, index) in resumeSkills"
              :key="index"
              class="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm"
            >
              {{ skill.name }}
              <button
                @click="removeSkill(index)"
                class="hover:text-red-500 transition"
              >
                <X class="w-4 h-4" />
              </button>
            </span>
          </div>
          <button
            @click="addSkill"
            class="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Plus class="w-4 h-4" />
            스킬 추가
          </button>
        </div>
      </section>
    </div>

    <!-- Footer Buttons -->
    <div class="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
      <button
        @click="prevStep"
        class="px-8 py-2.5 text-slate-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        이전
      </button>

      <div class="flex gap-3">
        <button
          @click="saveTemporary"
          class="px-8 py-2.5 text-slate-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          임시저장
        </button>
        <button
          @click="nextStep"
          class="px-8 py-2.5 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors font-medium"
        >
          다음
        </button>
      </div>
    </div>
  </div>

  <!-- 교육 탭 -->
  <div v-else-if="currentTab === 2" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div class="space-y-12">
      <!-- 학력 -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-600 pb-3 border-b-2 border-slate-600 flex-1">학력</h2>
        </div>
        <div class="space-y-4">
          <div
            v-for="(edu, index) in educations"
            :key="index"
            class="p-6 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-slate-600">
                {{ edu.degree === '고졸' ? '고등학교' : edu.degree === '학사' ? '대학교' : '기타 학력' }}
              </span>
              <button
                v-if="educations.length > 2"
                @click="removeEducation(index)"
                class="text-gray-400 hover:text-red-500 transition"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  학교명 <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="edu.schoolName"
                  :placeholder="edu.degree === '고졸' ? '○○고등학교' : '○○대학교'"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  전공 <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="edu.major"
                  :placeholder="edu.degree === '고졸' ? '인문계/자연계' : '컴퓨터공학'"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  학위 <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="edu.degree"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                >
                  <option value="고졸">고졸</option>
                  <option value="학사">학사</option>
                  <option value="석사">석사</option>
                  <option value="박사">박사</option>
                </select>
              </div>
            </div>
          </div>
          <div class="flex justify-center pt-2">
            <button
              @click="addEducation"
              class="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Plus class="w-4 h-4" />
              기타 학력 추가
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Footer Buttons -->
    <div class="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
      <button
        @click="prevStep"
        class="px-8 py-2.5 text-slate-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        이전
      </button>

      <div class="flex gap-3">
        <button
          @click="saveTemporary"
          class="px-8 py-2.5 text-slate-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          임시저장
        </button>
        <button
          @click="nextStep"
          class="px-8 py-2.5 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors font-medium"
        >
          다음
        </button>
      </div>
    </div>
  </div>

  <!-- 자기소개 탭 -->
  <div v-else-if="currentTab === 3" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div class="space-y-8">
      <div v-for="title in coverLetterTitles" :key="title.id">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ title.title }} <span class="text-red-500">*</span>
        </label>
        <p class="text-xs text-gray-500 mb-3">{{ title.subTitle || '내용을 입력해주세요.' }}</p>
        <textarea
          v-model="coverLetterDescriptions[title.id].description"
          rows="10"
          placeholder="내용을 입력해주세요"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
        ></textarea>
        <div class="text-right text-xs text-gray-500 mt-1">{{ coverLetterDescriptions[title.id]?.description.length || 0 }} / 1000</div>
      </div>
    </div>

    <!-- Footer Buttons -->
    <div class="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
      <button
        @click="prevStep"
        class="px-8 py-2.5 text-slate-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        이전
      </button>

      <div class="flex gap-3">
        <button
          @click="saveTemporary"
          class="px-8 py-2.5 text-slate-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          임시저장
        </button>
        <button
          @click="nextStep"
          class="px-8 py-2.5 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors font-medium"
        >
          다음
        </button>
      </div>
    </div>
  </div>

  <!-- 파일첨부 탭 -->
  <div v-else-if="currentTab === 4" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div class="space-y-8">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-800">
          ⓘ Halo는 보훈 등 사회적 배려 계층을 적극적으로 채용하기 위하여 별도의 절차를 운영할 수 있습니다.<br>
          관련 내용을 첨부해주시면 기회에 주시기 바랍니다.
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          포트폴리오
        </label>
        <p class="text-xs text-gray-500 mb-3">
          선택 : pdf 파일 업로드 가능 (최대 10MB)
        </p>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Upload class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <input
            type="file"
            @change="handleFileUpload($event, 'portfolio')"
            accept=".pdf"
            class="hidden"
            id="portfolio-upload"
          />
          <label
            for="portfolio-upload"
            class="inline-block px-6 py-2.5 text-sm text-slate-600 border border-gray-300 rounded-md hover:bg-gray-50 transition cursor-pointer"
          >
            파일 선택
          </label>
          <p v-if="portfolioFile" class="mt-4 text-sm text-green-600 font-medium">
            ✓ {{ portfolioFile.name }}
          </p>
        </div>
      </div>
    </div>

    <!-- Footer Buttons -->
    <div class="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
      <button
        @click="prevStep"
        class="px-8 py-2.5 text-slate-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        이전
      </button>

      <div class="flex gap-3">
        <button
          @click="saveTemporary"
          class="px-8 py-2.5 text-slate-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          임시저장
        </button>
        <button
          @click="submitApplication"
          class="px-8 py-2.5 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors font-medium"
        >
          제출
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
