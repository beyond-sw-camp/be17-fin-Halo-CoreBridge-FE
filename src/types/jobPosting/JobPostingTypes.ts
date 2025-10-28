/**
 * 채용공고 생성 폼 (POST /api/jobPostings)
 */
export interface JobPostingCreateRequest {
  title: string
  employmentType: string
  careerType: string
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
  recruitProcess: string[]
  salaryType: string
  salaryMin?: number
  salaryMax?: number
  salaryNegotiable?: boolean
  workingHours: string
  benefits: string
  departmentId: number
  contactName: string
  contactEmail: string
  additionalInfo?: string
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
  location: string,
  deadline: string,
  department: string
  views: number
}

export interface JobPostingPublicResponse {
  jobs: JobPostingPublic[]
}
