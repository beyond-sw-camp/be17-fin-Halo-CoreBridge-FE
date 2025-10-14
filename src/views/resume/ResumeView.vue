<script setup lang="ts">
import { ref, inject, type Ref } from 'vue';
import { Plus, Search, X, Upload } from 'lucide-vue-next';

// Layout에서 제공하는 탭 컨트롤
const currentTab = inject<Ref<number>>('currentTab');
const goToTab = inject<(tabId: number) => void>('goToTab');

// 지원 정보
const jobCategory = ref('');
const department = ref('');
const location = ref('');

// 기본 인적사항
const nameKo = ref('');
const nameEn = ref('');
const gender = ref('male');
const birthDate = ref('');
const nationality = ref('대한민국(한국)');
const phone = ref('');
const phoneType = ref('domestic');
const additionalPhone = ref('');
const email = ref('');
const postalCode = ref('');
const address1 = ref('');
const address2 = ref('');

// 병역
const militaryStatus = ref('');
const militaryRank = ref('');
const militaryStartDate = ref('');
const militaryEndDate = ref('');

// 보훈
const veteranStatus = ref('해당 없음');

// 학력
interface Education {
  id: number;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  status: string;
}

const educations = ref<Education[]>([
  {
    id: 1,
    school: '',
    major: '',
    degree: '학사',
    startDate: '',
    endDate: '',
    status: '졸업'
  }
]);

// 경력
interface Career {
  id: number;
  company: string;
  position: string;
  department: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

const careers = ref<Career[]>([
  {
    id: 1,
    company: '',
    position: '',
    department: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: ''
  }
]);

// 자격증
interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;
}

const certificates = ref<Certificate[]>([]);

// 자기소개서
const motivation = ref('');
const strengths = ref('');
const experience = ref('');

// 파일
const resumeFile = ref<File | null>(null);
const portfolioFile = ref<File | null>(null);

// Methods
const searchPostalCode = () => {
  alert('우편번호 검색 기능');
};

const saveTemporary = () => {
  alert('임시 저장되었습니다.');
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
    id: Date.now(),
    school: '',
    major: '',
    degree: '학사',
    startDate: '',
    endDate: '',
    status: '졸업'
  });
};

const removeEducation = (id: number) => {
  educations.value = educations.value.filter(edu => edu.id !== id);
};

const addCareer = () => {
  careers.value.push({
    id: Date.now(),
    company: '',
    position: '',
    department: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: ''
  });
};

const removeCareer = (id: number) => {
  careers.value = careers.value.filter(career => career.id !== id);
};

const addCertificate = () => {
  certificates.value.push({
    id: Date.now(),
    name: '',
    issuer: '',
    issueDate: ''
  });
};

const removeCertificate = (id: number) => {
  certificates.value = certificates.value.filter(cert => cert.id !== id);
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

const submitApplication = () => {
  alert('지원서가 제출되었습니다.');
};
</script>

<template>
  <!-- 기본내용 탭 -->
  <div v-if="currentTab === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div class="space-y-12">
      <!-- 지원 사항 -->
      <section>
        <h2 class="text-lg font-semibold text-slate-600 mb-6 pb-3 border-b-2 border-slate-600">
          지원 사항
        </h2>
        <div class="space-y-4">
          <p class="text-sm text-gray-600 mb-4">
            ⓘ 지원사항을 사실에 기반하여 작성해 주시기 바랍니다.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                지원회사 <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="jobCategory"
                placeholder="비즈테크코아"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                1차팀 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  v-model="department"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none text-sm"
                >
                  <option value="" disabled>HR</option>
                  <option value="개발팀">개발팀</option>
                  <option value="디자인팀">디자인팀</option>
                  <option value="기획팀">기획팀</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                지역 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  v-model="location"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none text-sm"
                >
                  <option value="" disabled>서울</option>
                  <option value="서울">서울</option>
                  <option value="경기">경기</option>
                  <option value="인천">인천</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-center pt-2">
            <button
              type="button"
              class="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Plus class="w-4 h-4" />
              추가
            </button>
          </div>
        </div>
      </section>

      <!-- 기본 사항 (LG 배치대로) -->
      <section>
        <h2 class="text-lg font-semibold text-slate-600 mb-6 pb-3 border-b-2 border-slate-600">
          기본 사항
        </h2>
        <div class="space-y-6">
          <p class="text-sm text-gray-600">
            ⓘ 기본사항을 사실에 기반하여 작성해 주시기 바랍니다.
          </p>

          <!-- Row 1: 성명(한글), 성명(영문) -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                성명(한글) <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="nameKo"
                placeholder="김철수"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                성명(영문) <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="nameEn"
                placeholder="Kim Ryunhwan"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
              />
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
                    class="w-4 h-4 text-slate-600 focus:ring-slate-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">남성</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="gender"
                    value="female"
                    class="w-4 h-4 text-slate-600 focus:ring-slate-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">여성</span>
                </label>
              </div>
              <p class="text-xs text-gray-500 mt-2">* 병역사항을 확인할 시에만 사용됩니다.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                생년월일 <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="birthDate"
                placeholder="1998.11.11"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <!-- Row 3: 국적, 이메일 -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                국적 <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-2">
                <input
                  type="text"
                  v-model="nationality"
                  class="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  @click="searchPostalCode"
                  class="px-4 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Search class="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                v-model="email"
                placeholder="fbxghjksdlove@gmail.com"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <!-- Row 4: 휴대전화번호, 추가 연락처 -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                휴대전화번호 <span class="text-red-500">*</span>
              </label>
              <input
                type="tel"
                v-model="phone"
                placeholder="010-5498-7544"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
              />
              <div class="flex items-center gap-2 mt-2">
                <input type="radio" v-model="phoneType" value="domestic" class="w-4 h-4" />
                <label class="text-sm text-gray-700">국내</label>
                <input type="radio" v-model="phoneType" value="overseas" class="w-4 h-4 ml-4" />
                <label class="text-sm text-gray-700">해외</label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                추가 연락처 <span class="text-red-500">*</span>
              </label>
              <input
                type="tel"
                v-model="additionalPhone"
                placeholder="추가로 입력해주세요"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <!-- Row 5: 주소 (전체 너비) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              본 주소 <span class="text-red-500">*</span>
            </label>
            <div class="space-y-2">
              <div class="flex gap-2">
                <input
                  type="text"
                  v-model="postalCode"
                  placeholder="10265"
                  class="w-32 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  @click="searchPostalCode"
                  class="px-4 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Search class="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  v-model="address1"
                  placeholder="경기도 고양시 덕양구 · · · (주소 검색 후)"
                  class="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
              <input
                type="text"
                v-model="address2"
                placeholder="아이파크123"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- 병역 -->
      <section>
        <h2 class="text-lg font-semibold text-slate-600 mb-6 pb-3 border-b-2 border-slate-600">
          병역
        </h2>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                병역구분 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  v-model="militaryStatus"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none text-sm"
                >
                  <option value="" disabled>군필</option>
                  <option value="군필">군필</option>
                  <option value="미필">미필</option>
                  <option value="면제">면제</option>
                  <option value="해당없음">해당없음</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                계급 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  v-model="militaryRank"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none text-sm"
                >
                  <option value="" disabled>병장</option>
                  <option value="병장">병장</option>
                  <option value="상병">상병</option>
                  <option value="일병">일병</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              복무기간 <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-3 items-center">
              <input
                type="text"
                v-model="militaryStartDate"
                placeholder="2025.05"
                class="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
              />
              <span class="text-gray-500">~</span>
              <input
                type="text"
                v-model="militaryEndDate"
                placeholder="2025.08"
                class="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- 보훈 -->
      <section>
        <h2 class="text-lg font-semibold text-slate-600 mb-6 pb-3 border-b-2 border-slate-600">
          보훈
        </h2>
        <div class="space-y-4">
          <p class="text-sm text-gray-600">
            ⓘ 보훈사항을 사실에 기반하여 작성해 주시기 바랍니다.
          </p>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              보훈 여부 <span class="text-red-500">*</span>
            </label>
            <div class="relative w-1/2">
              <select
                v-model="veteranStatus"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none text-sm"
              >
                <option value="해당 없음">해당 없음</option>
                <option value="해당">해당</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Footer Buttons -->
    <div class="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
      <button
        @click="saveTemporary"
        class="px-8 py-2.5 text-slate-600 bg-white border border-slate-600 rounded-md hover:bg-gray-50 transition-colors font-medium"
      >
        임시저장
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

  <!-- 상세경력/자격 탭 -->
  <div v-else-if="currentTab === 1" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div class="space-y-12">
      <!-- 학력 -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-600 pb-3 border-b-2 border-slate-600 flex-1">학력</h2>
        </div>
        <div class="space-y-4">
          <div
            v-for="(edu, index) in educations"
            :key="edu.id"
            class="p-6 border border-gray-200 rounded-lg"
          >
            <!-- 헤더 추가 -->
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-slate-600">학력 {{ index + 1 }}</span>
              <button
                v-if="educations.length > 1"
                @click="removeEducation(edu.id)"
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
                  v-model="edu.school"
                  placeholder="서울대학교"
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
                  placeholder="컴퓨터공학"
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
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  졸업상태 <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="edu.status"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                >
                  <option value="졸업">졸업</option>
                  <option value="재학">재학</option>
                  <option value="휴학">휴학</option>
                  <option value="졸업예정">졸업예정</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  입학일 <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="edu.startDate"
                  placeholder="2020.03"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  졸업일 <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="edu.endDate"
                  placeholder="2024.02"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-center pt-2">
            <button
              @click="addEducation"
              class="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Plus class="w-4 h-4" />
              추가
            </button>
          </div>
        </div>
      </section>

      <!-- 경력 -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-600 pb-3 border-b-2 border-slate-600 flex-1">경력</h2>
        </div>
        <div class="space-y-4">
          <div
            v-for="career in careers"
            :key="career.id"
            class="p-6 border border-gray-200 rounded-lg relative"
          >
            <button
              v-if="careers.length > 1"
              @click="removeCareer(career.id)"
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
                    v-model="career.company"
                    placeholder="네이버"
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
                    placeholder="시니어 개발자"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    부서 <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="career.department"
                    placeholder="개발팀"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    재직기간 <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-2 items-center">
                    <input
                      type="text"
                      v-model="career.startDate"
                      placeholder="2020.01"
                      class="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                    />
                    <span class="text-gray-500">~</span>
                    <input
                      type="text"
                      v-model="career.endDate"
                      placeholder="2023.12"
                      :disabled="career.isCurrent"
                      class="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="career.isCurrent"
                    class="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
                  />
                  <span class="text-sm text-gray-700">현재 재직중</span>
                </label>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  주요 업무
                </label>
                <textarea
                  v-model="career.description"
                  rows="4"
                  placeholder="담당했던 주요 업무를 입력해주세요"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                ></textarea>
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
            v-for="cert in certificates"
            :key="cert.id"
            class="p-6 border border-gray-200 rounded-lg relative"
          >
            <button
              @click="removeCertificate(cert.id)"
              class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <X class="w-5 h-5" />
            </button>
            <div class="grid grid-cols-3 gap-6">
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
                  발급기관 <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="cert.issuer"
                  placeholder="한국산업인력공단"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  취득일 <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="cert.issueDate"
                  placeholder="2023.06"
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
    <h2 class="text-xl font-semibold text-slate-600 mb-6 pb-3 border-b-2 border-slate-600">교육 이력</h2>
    <div class="text-center py-12 text-gray-500">
      교육 이력 정보를 입력해주세요
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
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          지원동기 <span class="text-red-500">*</span>
        </label>
        <p class="text-xs text-gray-500 mb-3">당사에 지원한 이유와 입사 후 회사에서 이루고 싶은 목표를 기술해 주십시오.</p>
        <textarea
          v-model="motivation"
          rows="10"
          placeholder="내용을 입력해주세요"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
        ></textarea>
        <div class="text-right text-xs text-gray-500 mt-1">{{ motivation.length }} / 1000</div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          자신의 강점 <span class="text-red-500">*</span>
        </label>
        <p class="text-xs text-gray-500 mb-3">직무 수행을 위한 본인의 강점을 자유롭게 기술해 주십시오.</p>
        <textarea
          v-model="strengths"
          rows="10"
          placeholder="내용을 입력해주세요"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
        ></textarea>
        <div class="text-right text-xs text-gray-500 mt-1">{{ strengths.length }} / 1000</div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          주요경험 <span class="text-red-500">*</span>
        </label>
        <p class="text-xs text-gray-500 mb-3">자신의 역량을 보여줄 수 있는 프로젝트, 대외활동 등 주요 경험을 기술해 주십시오.</p>
        <textarea
          v-model="experience"
          rows="10"
          placeholder="내용을 입력해주세요"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
        ></textarea>
        <div class="text-right text-xs text-gray-500 mt-1">{{ experience.length }} / 1000</div>
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
          이력서 <span class="text-red-500">*</span>
        </label>
        <p class="text-xs text-gray-500 mb-3">
          본 공고는 자유로운 이력서를 업로드하실 수 있습니다.<br>
          ex) 기존 개인이 작성한 이력서
        </p>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Upload class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-sm text-gray-600 mb-3">
            파일을 드래그하거나 클릭하여 업로드하세요
          </p>
          <input
            type="file"
            @change="handleFileUpload($event, 'resume')"
            accept=".pdf"
            class="hidden"
            id="resume-upload"
          />
          <label
            for="resume-upload"
            class="inline-block px-6 py-2.5 text-sm text-slate-600 border border-gray-300 rounded-md hover:bg-gray-50 transition cursor-pointer"
          >
            파일 선택
          </label>
          <p v-if="resumeFile" class="mt-4 text-sm text-green-600 font-medium">
            ✓ {{ resumeFile.name }}
          </p>
        </div>
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
            accept=".pdf,.jpg,.jpeg,.png"
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
