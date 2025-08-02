export type TLoginAuth = {
  email: string
  password: string
}

export type TRegisterAuth = {
  fullName: string
  phone: string
  email: string
  password: string
  confirmPassword: string
}

export type TUserRole = {
  id: string
  code: string
  name: string
}

export type TUser = {
  id: string
  created_at: string
  created_by: string | null
  updated_at: string
  updated_by: string | null
  active: boolean
  avatar: string | null
  birthday: string | null
  email: string
  full_name: string
  gender: string | null
  phone: string
  role: TUserRole
}

export type TGetUsersResponse = {
  status: string
  statusCode: number
  message: string
  data: TUser[]
}
