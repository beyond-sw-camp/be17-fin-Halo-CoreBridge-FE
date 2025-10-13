export interface UserForm {
  email: string
  password: string
  name: string
  gender: string
  birth: string
  phone: string
}

export interface UserFormErrors {
  email: string
  password: string
  name: string
  gender: string
  birth: string
  phone: string
  confirmPassword: string
  verificationCode: string
  terms: string
}
