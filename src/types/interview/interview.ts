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
