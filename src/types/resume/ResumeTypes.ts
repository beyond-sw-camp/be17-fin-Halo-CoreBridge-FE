// 🔥 백엔드와 일치하도록 날짜 타입을 string으로 통일

export interface Career {
  id?: number;
  companyName: string;
  position: string;
  startDate: string;  // 🔥 FIXED: YYYY-MM-DD 형식
  endDate: string | null;  // 🔥 FIXED: YYYY-MM-DD 형식 또는 null
}

export interface Certificate {
  id?: number;
  name: string;
  acquiredDate: string;  // 🔥 FIXED: YYYY-MM-DD 형식
}

export interface Education {
  id?: number;
  schoolName: string;
  major: string;
  degree: string;
}

export interface Language {
  id?: number;
  name: string;
  testName: string;
  languageName: string;
  grade: string;
  speakingLevel: string;
  testDate: string;  // 🔥 FIXED: YYYY-MM-DD 형식
}

export interface OverseasExperience {
  id?: number;
  type: string;
  country: string;
  startDate: string;  // 🔥 FIXED: YYYY-MM-DD 형식
  endDate: string;  // 🔥 FIXED: YYYY-MM-DD 형식
  note: string;
}

export interface ResumeSkill {
  id?: number;
  name: string;
}

// 🔥 NEW: 자기소개서 항목별 DTO
export interface CoverLetterDescriptionRequest {
  description: string;
  resumeId: number;
  coverLetterTitleId: number;
}

export interface CoverLetterDescriptionResponse {
  id: number;
  description: string;
  resumeId: number;
  coverLetterId: number;
}

// 🔥 이력서 생성 요청 DTO
export interface ResumeCreateRequest {
  description: string;
  jobPostingId: number;
  careers?: Career[];
  certificates?: Certificate[];
  educations?: Education[];
  languages?: Language[];
  overseasExperiences?: OverseasExperience[];
  resumeSkills?: ResumeSkill[];
}

// 🔥 이력서 수정 요청 DTO
export interface ResumeUpdateRequest {
  description: string;
  careers?: Career[];
  certificates?: Certificate[];
  educations?: Education[];
  languages?: Language[];
  overseasExperiences?: OverseasExperience[];
  resumeSkills?: ResumeSkill[];
}

// 🔥 이력서 조회 응답 DTO
export interface ResumeResponse {
  id: number;
  appliedAt: string;
  description: string;
  jobPostingId: number;
  userId: number;
  careers: Career[];
  certificates: Certificate[];
  educations: Education[];
  languages: Language[];
  overseasExperiences: OverseasExperience[];
  resumeSkills: ResumeSkill[];
}

// 🔥 NEW: BaseResponse 타입 정의
export interface BaseResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 🔥 NEW: 유저 정보 응답 타입
export interface UserResumeInfo {
  name: string;
  email: string;
  gender: string;
  phone: string;
  birth: string;  // YYYY-MM-DD 형식
}

export interface CoverLetterTitle {
  id: number;
  title: string;
  subTitle: string;  // 🔥 이 속성 추가!
}
