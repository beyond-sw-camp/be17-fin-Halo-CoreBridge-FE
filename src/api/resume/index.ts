import api from '@/plugins/axiosInterceptor'
import type {
  ResumeCreateRequest,
  ResumeUpdateRequest,
  ResumeResponse,
  CoverLetterDescriptionRequest,
  CoverLetterDescriptionResponse,
} from '@/types/resume/ResumeTypes'

export const getApplicantsList = async (id: number): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined
  }
  const url = `/api/jobposts/${id}/applies`

  await api
    .get(url)
    .then((res) => {
      console.log(res)
      data = res.data
    })
    .catch((error) => {
      console.log(error)
      data = error.response.data as ApiResponse
    })

  return data
}

export const createResume = async (
  resumeData: ResumeCreateRequest,
  file?: File,
): Promise<number> => {
  const formData = new FormData()
  formData.append('resume', new Blob([JSON.stringify(resumeData)], { type: 'application/json' }))
  if (file) {
    formData.append('file', file)
  }

  const response = await api.post<number>('/api/applies', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const getResume = async (resumeId: number): Promise<ResumeResponse> => {
  const response = await api.get<ResumeResponse>(`/api/applies/${resumeId}`)
  return response.data
}

export const updateResume = async (
  resumeId: number,
  resumeData: ResumeUpdateRequest,
): Promise<void> => {
  await api.patch(`/api/applies/${resumeId}`, resumeData)
}

export const deleteResume = async (resumeId: number): Promise<void> => {
  await api.delete(`/api/applies/${resumeId}`)
}

export const createCoverLetterDescriptions = async (
  jobpostId: number,
  resumeId: number,
  descriptions: CoverLetterDescriptionRequest[],
): Promise<number[]> => {
  const response = await api.post<number[]>(
    `/api/jobposts/${jobpostId}/applies/${resumeId}/cover-letter-descriptions`,
    descriptions,
  )
  return response.data
}

export const getCoverLetterDescriptions = async (
  resumeId: number,
  jobPostingId: number,
): Promise<CoverLetterDescriptionResponse[]> => {
  const response = await api.get<CoverLetterDescriptionResponse[]>(
    `/api/applies/${resumeId}/cover-letter-descriptions`,
    {
      params: { jobPostingId },
    },
  )
  return response.data
}
