export interface RecruitProcess {
  id: number
  name: string
  colorCode: string
  orderIdx: number
}

export interface RecruitProcessRequest {
  recruit: string
}

export interface RecruitProcessResponse {
  recruitProcesses: RecruitProcess[]
}

export interface RecruitProcessForm {
  name: string
  colorCode: string | undefined
  jobPostingId: number
}

export interface RecruitProcessChangeOrderForm {
  processId: number | undefined
  jobPostingId: number | undefined
  fromIdx: number | undefined
  toIdx: number | undefined
}
