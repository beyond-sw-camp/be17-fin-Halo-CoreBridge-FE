import api from '@/plugins/axiosInterceptor'
import type { UserForSystemForm } from '@/types/user/UserForm'
import { useLoadingStore } from '@/store/useLoadingStore'
import type {
  AccountListResponse,
  AccountParam,
  AccountInifiniteScrollResponse,
} from '@/types/user/Account'

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

const requestAccounts = async (req: AccountParam): Promise<ApiResponse<AccountListResponse>> => {
  let data: ApiResponse<AccountListResponse> = {
    success: false,
    code: 0,
    message: '',
    results: {
      accounts: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
    },
  }

  const url: string = '/api/admin/users'

  await api
    .get(url, {
      params: {
        type: req.type !== '전체' ? req.type : undefined,
        page: req.page,
        search: req.search ? req.search : undefined,
      },
    })
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.response.data as ApiResponse<AccountListResponse>
    })

  return data
}

const requestDeleteAccount = async (id: number): Promise<ApiResponse> => {
  let data: ApiResponse = {
    success: false,
    code: 0,
    message: '',
    results: undefined,
  }

  const url: string = '/api/admin/users/' + id

  await api
    .delete(url)
    .then((res) => {
      data = res.data as ApiResponse
    })
    .catch((error) => {
      data = error.response.data as ApiResponse
    })

  return data
}

const requestInterviewerAccounts = async (
  req: AccountParam,
): Promise<ApiResponse<AccountInifiniteScrollResponse>> => {
  let data: ApiResponse<AccountInifiniteScrollResponse> = {
    success: false,
    code: 0,
    message: '',
    results: {
      accounts: [],
      currentPage: 0,
      hasNext: false,
    },
  }

  const url: string = '/api/interviewers/jobPosting'

  await api
    .get(url, {
      params: {
        type: undefined,
        page: req.page,
        search: req.search ? req.search : undefined,
      },
    })
    .then((res) => {
      data = res.data as ApiResponse<AccountInifiniteScrollResponse>
    })
    .catch((error) => {
      data = error.response.data as ApiResponse<AccountInifiniteScrollResponse>
    })

  return data
}

export default {
  requestAccountAdd,
  requestAccounts,
  requestDeleteAccount,
  requestInterviewerAccounts,
}
