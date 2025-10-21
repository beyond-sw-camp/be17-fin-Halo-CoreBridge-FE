export interface EmailForm {
  email: string
}

export interface EmailFormErrors {
  email: string
}

export interface EmailFindForm {
  name: string
  phone: string
}

export interface EmailFindFormErrors {
  name: string
  phone: string
  global: string
}

export interface EmailFindResponse {
  findEmail: string
}
