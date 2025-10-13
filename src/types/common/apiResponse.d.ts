declare global {
  interface ApiResponse<T = unknown> {
    success: boolean
    code: number
    message: string
    results: T
  }
}

export {}
