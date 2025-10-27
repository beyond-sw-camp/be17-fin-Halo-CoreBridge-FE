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
 * 채용공고 요약 정보 (목록 조회용)
 */
export interface JobPostingSummary {
  id: number
  title: string
  department: string
  employmentType: string
  applyEndDate: string
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
