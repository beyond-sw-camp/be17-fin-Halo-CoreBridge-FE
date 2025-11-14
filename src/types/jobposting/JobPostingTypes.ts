import type { EnumMember, EnumType } from 'typescript'

/**
 * 채용공고 생성 폼 (POST /api/jobPostings)
 */
export interface RecruitProcessCreate {
  name: string
  color: string
  orderIdx: number
}

export interface questionaryCreateForm {
  title: string
  subtitle: string
}

export interface JobPostingCreateRequest {
  title: string
  employmentType: string | null
  careerType: string | null
  minExperience?: number
  maxExperience?: number
  positionLevel?: string
  location: string
  applyStartDate: string
  applyEndDate: string
  hireEndDate: string
  headcount: number
  summary: string
  responsibilities: string
  requirements: string
  preferred: string
  techStack: string[]
  recruitProcess: RecruitProcessCreate[]
  coverLetterTitles: questionaryCreateForm[]
  salaryType: string | null
  salaryMin?: number
  salaryMax?: number
  salaryNegotiable?: boolean
  workingHours: string
  benefits: string
  departmentId: number | null
  contactName: string
  contactEmail: string
  additionalInfo?: string
  interviewers: number[]
}

export interface JobPostingDetailResponse {
  id: number
  title: string

  // 기본 정보
  employmentType: string // "정규직" | "계약직" | "인턴" 등
  careerType: string // "신입" | "경력" | "무관"
  minExperience: number | null
  maxExperience: number | null
  positionLevel: string | null
  location: string

  // 날짜
  applyStartDate: string // "yyyy-MM-dd HH:mm:ss"
  applyEndDate: string // "yyyy-MM-dd HH:mm:ss"
  hireEndDate: string // "yyyy-MM-dd HH:mm:ss"

  // 모집 인원
  headcount: number

  // 직무 관련
  summary: string
  responsibilities: string
  requirements: string
  preferred: string

  // 기술 스택
  techStack: string[]

  // 채용 프로세스
  recruitProcess: RecruitProcessEdit[]

  // 자기소개서 질문
  coverLetterTitles: CoverLetterTitleEdit[]

  // 급여 정보
  salaryType: string // "연봉" | "시급" 등
  salaryMin: number | null
  salaryMax: number | null
  salaryNegotiable: boolean

  // 근무 조건
  workingHours: string
  benefits: string

  // 부서/담당자 정보
  departmentName: string
  contactName: string
  contactEmail: string

  // 기타
  additionalInfo: string | null
}

// ================================
// 🎯 채용 프로세스 타입
// ================================
export interface RecruitProcessEdit {
  id: number
  name: string
  colorCode: ColorCode // 색상 정보 객체
  orderIdx: number
}

// ================================
// 🎯 색상 정보 타입
// ================================
export interface ColorCode {
  name: string // "BLUE" | "ORANGE" | ...
  label: string // "파랑" | "주황" | ...
  code: string // "blue-500"
}

// ================================
// 🎯 자기소개서 질문 타입
// ================================
export interface CoverLetterTitleEdit {
  id: number
  title: string
  subtitle: string
  jobPostingId: number
}

/**
 * 특정 채용공고에 대한 프로세스 정리
 * 전체 응답 데이터 정보
 */

export interface ProcessSummary {
  stageName: String
  count: number
  orderIndex: number
}

export interface JobPostingListResponse {
  id: number
  title: string
  summaryText: string
  departmentName: string
  employmentType: string
  careerType: string
  status: string
  hireEndDate: string
  dday: string
  applicantCount: number
  progressPercent: number
  processSummaries: ProcessSummary[]
}

/**
 * 채용공고 상세 정보 (상세 조회용)
 */
export interface JobPostingDetail {
  id: number
  title: string
  description: string
  department: string
  employmentType: string
  skills: string[]
  applyStartDate: string
  applyEndDate: string
}

export interface JobPostingPublic {
  id: number
  title: string
  summary: string
  experience: string
  location: string
  deadline: string
  department: string
  views: number
}

export interface PublicJobSearchRequest {
  keyword?: string
  careerType?: string
  techStacks?: string[]
  page: number
  size: number
}

export interface PublicJobSearchResponse {
  jobs: JobPostingPublic[]
  totalElements: number
  last: false
}

