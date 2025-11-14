import api from '@/plugins/axiosInterceptor'
import type { PublicJobSearchResponse } from '@/types/jobposting/JobPostingTypes'
import type { PublicJobSearchRequest } from '@/types/publicjobposting/publicJobPostingTypes'
// 검색기능
export const searchPublicJobs = async (payload: PublicJobSearchRequest): Promise<ApiResponse<PublicJobSearchResponse>> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url = '/api/jobs/search'

  await api
    .post(url, payload)
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