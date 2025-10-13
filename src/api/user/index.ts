import api from '@/plugins/axiosInterceptor'
import type { UserForm } from '@/types/user/UserForm'

const requestSignup = async (req: UserForm): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url: string = '/api/users'

  await api
    .post(url, req)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.response.data as ApiResponse
    })

  return data
}

export default {
  requestSignup,
}
