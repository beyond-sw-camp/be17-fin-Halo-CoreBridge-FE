import api from '@/plugins/AxiosInterceptor'
import type { EmailForm } from '@/types/user/Email'
import type { PasswordChange } from '@/types/user/UserUpdateForm'

/**
 * 이메일 인증 코드 전송 api
 * @param {Object} req - 요청 객체
 * @returns
 */
const sendAuthCodeToEmail = async (req: { email: string }): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url: string = '/api/auth/email/verify-code'

  await api
    .get(url, { params: req })
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

/**
 * 이메일 인증 코드 검증 api
 * @param {Object} req - 요청 객체
 * @returns {Promise<ApiResponse>} - API 응답 객체
 */
const verifyEmailCode = async (req: { email: string; code: string }): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }
  const url: string = '/api/auth/email/verify-code'

  await api
    .post(url, req)
    .then((res) => {
      data = res.data as ApiResponse
    })
    .catch((error) => {
      data = error.response.data as ApiResponse
    })

  return data
}

const sendPasswordResetLink = async (req: EmailForm): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url: string = '/api/auth/find-password/link'

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

const resetPassword = async (req: PasswordChange): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url = '/api/auth/reset-password'

  await api
    .post(url, req)
    .then((res) => {
      data = res.data as ApiResponse
    })
    .catch((error) => {
      data = error.response.data as ApiResponse
    })

  return data
}

export default {
  sendAuthCodeToEmail,
  verifyEmailCode,
  sendPasswordResetLink,
  resetPassword,
}
