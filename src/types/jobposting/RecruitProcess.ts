import type { ColorCodeResponse } from '@/types/common/ColorCode.ts'

export interface RecruitProcess {
  id: number
  name: string
  colorCode: ColorCodeResponse
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

export interface RecruitProcessEditForm {
  id: number | undefined
  name: string | undefined
  colorCode: string | undefined
  jobPostingId: number | undefined
}

export interface RecruitProcessDeleteForm {
  id: number | undefined
}
