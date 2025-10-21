export interface PasswordChange {
  password: string
  token: string | undefined
}

export interface PasswordChangeErrors {
  password: string
  passwordConfirm: string
  global: string
}
