// src/types/resume/index.ts
// 백엔드와 완벽하게 일치하는 타입 정의 (2025-04-05 기준)

export interface Career {
  id?: number;
  companyName: string;
  position: string;
  startDate: string;  // YYYY-MM-DD
  endDate: string | null;  // YYYY-MM-DD 또는 null
}

export interface Certificate {
  id?: number;
  name: string;
  acquiredDate: string;  // YYYY-MM-DD
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
  testDate: string;  // YYYY-MM-DD
}

export interface OverseasExperience {
  id?: number;
  type: string;
  country: string;
  startDate: string;  // YYYY-MM-DD
  endDate: string;  // YYYY-MM-DD
  note: string;
}

export interface ResumeSkill {
  id?: number;
  name: string;
}

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
  coverLetterTitle: string;
}

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

export interface ResumeUpdateRequest {
  description: string;
  careers?: Career[];
  certificates?: Certificate[];
  educations?: Education[];
  languages?: Language[];
  overseasExperiences?: OverseasExperience[];
  resumeSkills?: ResumeSkill[];
}

export interface ResumeResponse {
  id: number;
  appliedAt: string;
  description: string;
  jobPostingId: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  pdf: PdfResponse | null;
  careers: Career[];
  certificates: Certificate[];
  educations: Education[];
  languages: Language[];
  overseasExperiences: OverseasExperience[];
  resumeSkills: ResumeSkill[];
}

export interface PdfResponse {
  id: number;
  originalFilename: string;
  savedPath: string;
  contentType: string;
  fileSize: number;
  resumeId: number;
  fileUrl: string;
}

export interface BaseResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface UserResumeInfo {
  name: string;
  email: string;
  gender: string;
  phone: string;
  birth: string;  // YYYY-MM-DD
}

export interface CoverLetterTitle {
  id: number;
  title: string;
  subTitle: string;
}

export interface CoverLetterTitleResponse {
  id: number;
  jobPostingId: number;
  title: string;
  displayOrder: number;
}
