import api from '@/plugins/axiosInterceptor'


// 부서 불러오기
export const getTechStack = async (): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined
  }

  const url = `/api/tech-stacks`

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