export interface Account {
  id: number
  email: string
  name: string
  roleType: string
  createdAt: string
}

export interface AccountListResponse {
  accounts: Account[]
  totalElements: number
  totalPages: number
  currentPage: number
}

export interface AccountParam {
  type: string | undefined
  page: number
  search: string | undefined
}

export interface AccountInifiniteScrollResponse {
  accounts: Account[]
  currentPage: number
  hasNext: boolean
}
