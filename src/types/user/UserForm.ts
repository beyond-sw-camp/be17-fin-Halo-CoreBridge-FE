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

export interface UserForSystemForm {
  email: string
  name: string
  roleType: string
}

export interface UserForSystemFormErrors {
  email: string
  name: string
  roleType: string
  global: string
}
