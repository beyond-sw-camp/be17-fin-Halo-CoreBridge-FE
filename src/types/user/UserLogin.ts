export interface UserLogin {
  email: string
  password: string
}

export interface UserLoginError {
  email: string
  password: string
  global: string
}

export interface UserLoginResponse {
  name: string
  role: string
}
