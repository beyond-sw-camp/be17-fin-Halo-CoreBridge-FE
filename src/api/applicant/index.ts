import api from '@/plugins/axiosInterceptor'

export const getMyPage = async (): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined
  }

  const url = `/api/applicant/mypage`

  await api
    .get(url)
    .then((res) => {
      console.log(res)
      data = res.data as ApiResponse
    })
    .catch((error) => {
      console.log(error)
      data = error.response.data as ApiResponse
    })

  return data
}