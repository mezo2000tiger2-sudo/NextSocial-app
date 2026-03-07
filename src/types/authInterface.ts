export interface SuccesLogin {
  success: boolean
  message: string
  data: DataInterface
}
export interface FailedLogin {
  success: boolean
  message: string
  errors: string
}

export interface DataInterface {
  token: string
  tokenType: string
  expiresIn: string
  user: UserInterface
}

export interface UserInterface {
  _id: string
  name: string
  username: string
  email: string
  photo: string
  cover: string
}
