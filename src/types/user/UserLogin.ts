export interface UserLogin {
  email: string
  password: string
}

export interface UserLoginError {
  email: string
  password: string
  global: string
}
