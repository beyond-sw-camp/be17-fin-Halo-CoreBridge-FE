import api from '@/plugins/axiosInterceptor'
import type {
  ResumeCreateRequest,
  ResumeUpdateRequest,
  BaseResponse,
  ResumeResponse,
  CoverLetterDescriptionRequest,
  CoverLetterDescriptionResponse,
} from '@/types/resume/ResumeTypes'

// ============================================
// Resume API (기존 - 하위 호환성 유지)
// ============================================

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
  jobpostId: number,
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

export const getResume = async (
  jobPostingId: number,
  resumeId: number,
): Promise<ResumeResponse> => {
  const response = await api.get<ResumeResponse>(
    `/api/jobposts/${jobPostingId}/applies/${resumeId}`,
  )
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

// ============================================
// Resume API (수정된 버전 - 백엔드 경로와 일치)
// ============================================

/**
 * 이력서 생성 (백엔드 경로 수정 버전)
 * @param jobpostId - 공고 ID (경로에 포함)
 * @param resumeData - 이력서 데이터
 * @param file - 첨부 파일 (선택)
 */
export const createResumeV2 = async (
  jobpostId: number,
  resumeData: ResumeCreateRequest,
  file?: File,
): Promise<number> => {
  const formData = new FormData()
  formData.append('resume', new Blob([JSON.stringify(resumeData)], { type: 'application/json' }))
  if (file) {
    formData.append('file', file)
  }

  const response = await api.post<number>(
    `/api/jobposts/${jobpostId}/applies`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}

/**
 * 이력서 수정 (백엔드 경로 수정 버전)
 * @param jobpostId - 공고 ID (경로에 포함)
 * @param resumeId - 이력서 ID
 * @param resumeData - 수정할 데이터
 */
export const updateResumeV2 = async (
  jobpostId: number,
  resumeId: number,
  resumeData: ResumeUpdateRequest,
): Promise<void> => {
  await api.patch(
    `/api/jobposts/${jobpostId}/applies/${resumeId}`,
    resumeData
  )
}

/**
 * 이력서 삭제 (백엔드 경로 수정 버전)
 * @param jobpostId - 공고 ID (경로에 포함)
 * @param resumeId - 이력서 ID
 */
export const deleteResumeV2 = async (
  jobpostId: number,
  resumeId: number
): Promise<void> => {
  await api.delete(`/api/jobposts/${jobpostId}/applies/${resumeId}`)
}

/**
 * 자소서 조회 (백엔드 경로 수정 버전)
 * @param jobpostId - 공고 ID (경로에 포함)
 * @param resumeId - 이력서 ID
 * @param jobPostingId - 쿼리 파라미터용 공고 ID
 */
export const getCoverLetterDescriptionsV2 = async (
  jobpostId: number,
  resumeId: number,
  jobPostingId: number,
): Promise<CoverLetterDescriptionResponse[]> => {
  const response = await api.get<CoverLetterDescriptionResponse[]>(
    `/api/jobposts/${jobpostId}/applies/${resumeId}/cover-letter-descriptions`,
    {
      params: { jobPostingId },
    },
  )
  return response.data
}

// ============================================
// Resume API (새로 추가)
// ============================================

/**
 * 자소서 제목 목록 조회
 * @param jobpostId - 공고 ID
 */
export const getCoverLetterTitles = async (
  jobpostId: number,
): Promise<CoverLetterTitleResponse[]> => {
  const response = await api.get<CoverLetterTitleResponse[]>(
    `/api/jobposts/${jobpostId}/applies/cover-letter-titles`,
  )
  return response.data
}

/**
 * 이력서 목록 조회
 * @param jobpostId - 공고 ID
 */
export const getResumeList = async (jobpostId: number): Promise<ResumeResponse[]> => {
  const response = await api.get<ResumeResponse[]>(
    `/api/jobposts/${jobpostId}/applies`
  )
  return response.data
}

// ============================================
// PDF API (기존)
// ============================================

// PDF 다운로드
export const downloadPdf = async (resumeId: number): Promise<Blob> => {
  const response = await api.get(`/api/pdfs/download/${resumeId}`, {
    responseType: 'blob',
  })
  return response.data
}

// PDF 미리보기 URL 생성
export const getPdfViewUrl = (resumeId: number): string => {
  // axios 인터셉터를 거치지 않고 직접 URL 반환
  // 인증 쿠키는 자동으로 전송됨
  return `${api.defaults.baseURL}/api/pdfs/view/${resumeId}`
}

// PDF 미리보기 (Blob으로 받기)
export const viewPdf = async (resumeId: number): Promise<Blob> => {
  const response = await api.get(`/api/pdfs/view/${resumeId}`, {
    responseType: 'blob',
  })
  return response.data
}

// ============================================
// PDF API (수정된 버전 - 백엔드 경로와 일치)
// ============================================

/**
 * PDF 다운로드 (백엔드 경로 수정 버전)
 * 경로: /api/pdf/download/{resumeId} (s 제거)
 */
export const downloadPdfV2 = async (resumeId: number): Promise<Blob> => {
  const response = await api.get(`/api/pdf/download/${resumeId}`, {
    responseType: 'blob',
  })
  return response.data
}

/**
 * PDF 미리보기 URL 생성 (백엔드 경로 수정 버전)
 * 경로: /api/pdf/view/{resumeId} (s 제거)
 */
export const getPdfViewUrlV2 = async (resumeId: number): Promise<string> => {
  const blob = await downloadPdfV2(resumeId);
  return URL.createObjectURL(blob);
}

/**
 * PDF 미리보기 Blob (백엔드 경로 수정 버전)
 * 경로: /api/pdf/view/{resumeId} (s 제거)
 */
export const viewPdfV2 = async (resumeId: number): Promise<Blob> => {
  const response = await api.get(`/api/pdf/view/${resumeId}`, {
    responseType: 'blob',
  })
  return response.data
}

// ============================================
// 타입 정의 (ResumeTypes.ts에 추가 필요)
// ============================================
export interface CoverLetterTitleResponse {
  id: number
  jobPostingId: number
  title: string
  displayOrder: number
}

// ============================================
// Resume Search API (Elasticsearch)
// ============================================

/**
 * 이력서 검색 (Elasticsearch)
 * @param jobpostId - 공고 ID
 * @param params - 검색 파라미터
 */
export const searchApplicants = async (
  jobpostId: number,
  params: {
    keyword?: string
    degree?: string
    skills?: string[]
    companyName?: string
    certificateName?: string
    country?: string
    page?: number
    size?: number
    sortBy?: string
    sortDirection?: string
  }
): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined
  }

  try {
    const response = await api.post(`/api/jobposts/${jobpostId}/applies/search`, params)
    data = response.data
  } catch (error: any) {
    console.error('Search error:', error)
    data = error.response?.data || data
  }

  return data
}
