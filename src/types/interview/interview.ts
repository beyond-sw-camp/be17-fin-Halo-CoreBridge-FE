export interface InterviewModalData {
  resumeId: number | undefined
  stageId: number | undefined
  stageName: string | undefined
  userName: string | undefined
}

export interface Interviewer {
  name: string
  email: string
}

export interface Interviewers {
  interviewers: Interviewer[]
}

export interface InterviewCreateForm {
  startDate: string
  startTime: string
  duration: number | string
  description: string
  location: string
  interviewType: string
  resumeId: number | undefined
  recruiterProcessId: number | undefined
}

export interface InterviewCreateFormErrors {
  startDate: string
  startTime: string
  duration: string
  description: string
  location: string
  interviewType: string
  resumeId: string
  recruiterProcessId: string
  global: string
}

export interface Interview {
  id: number
  name: string
  startDateTime: string
  duration: string
  process: string
  interviewType: interviewType
  location: string
  interviewStatus: interviewStatus
  description: string
  interviewers: Interviewer[]
}

export interface interviewType {
  code: string
  label: string
}

export interface interviewStatus {
  code: string
  label: string
}

export interface InterviewListResponse {
  interviews: Interview[]
  totalElements: number
  totalPages: number
  currentPage: number
}

export interface InterviewParam {
  status: string | undefined
  type: string | undefined
  page: number
  search: string | undefined
}
