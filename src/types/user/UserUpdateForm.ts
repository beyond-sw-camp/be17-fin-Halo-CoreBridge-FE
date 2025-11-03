export interface PasswordChange {
  email: string | undefined
  password: string
  token: string | undefined
}

export interface PasswordChangeErrors {
  password: string
  passwordConfirm: string
  global: string
}
