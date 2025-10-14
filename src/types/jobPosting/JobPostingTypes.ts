/**
 * 채용공고 생성 폼 (POST /api/jobPostings)
 */
export interface JobPostingCreateForm {
  title: string
  description: string
  employmentType: string
  careerType: string
  minExperience?: number | null
  maxExperience?: number | null
  departmentId: number
  applyStartDate: string
  applyEndDate: string
  skills: string[]
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
