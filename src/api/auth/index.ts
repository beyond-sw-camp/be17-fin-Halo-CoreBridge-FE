import api from '@/plugins/axiosInterceptor'

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

export default {
  sendAuthCodeToEmail,
  verifyEmailCode,
}
