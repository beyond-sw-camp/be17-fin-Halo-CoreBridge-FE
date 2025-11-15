export interface ProfileResponse {
  name: string
  email: string
  appliedCount: number
}

export interface AppliedJobResponse {
  jobPostingId: number
  jobTitle: string
  departmentName: string
  appliedDate: string
  currentStage: string
  process: string[]
}

export interface MyPageResponse {
  profile: ProfileResponse
  applications: AppliedJobResponse[]
}
