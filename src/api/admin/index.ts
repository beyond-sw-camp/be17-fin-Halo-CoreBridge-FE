import api from '@/plugins/axiosInterceptor'
import type { UserForSystemForm } from '@/types/user/UserForm'
import { useLoadingStore } from '@/store/useLoadingStore'

const loadingStore = useLoadingStore()

const requestAccountAdd = async (req: UserForSystemForm): Promise<ApiResponse> => {
  loadingStore.startLoading()

  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url: string = '/api/admin/users'

  await api
    .post(url, req)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.response.data as ApiResponse
    })

  loadingStore.stopLoading()
  return data
}

export default {
  requestAccountAdd,
}
