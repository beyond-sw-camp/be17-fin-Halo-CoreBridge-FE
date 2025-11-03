import api from '@/plugins/axiosInterceptor'
import type { UserForm } from '@/types/user/UserForm'
import type { UserLogin, UserLoginResponse } from '@/types/user/UserLogin'

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

const requestLogin = async (req: UserLogin): Promise<ApiResponse<UserLoginResponse>> => {
  let data: ApiResponse<UserLoginResponse> = {
    success: false,
    code: 0,
    message: '',
    results: {} as UserLoginResponse,
  }

  const url: string = 'http://localhost:8080/login'

  await api
    .post(url, req)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.response.data as ApiResponse<UserLoginResponse>
    })

  return data
}

const requestLogout = async (): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url: string = '/api/users/logout'

  await api
    .post(url)
    .then((res) => {
      data = res.data as ApiResponse
    })
    .catch((error) => {
      data = error.response.data as ApiResponse
    })

  return data
}

export default {
  requestSignup,
  requestLogin,
  requestLogout
}
