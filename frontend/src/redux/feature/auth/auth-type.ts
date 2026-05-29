export interface User {
  uuid: string
  email: string | null
  name: string | null
}

export interface AuthState {
  user: User | null
  token: string
  loading: boolean
  error: string | null
  status: "pending" | "succeed" | "rejected"
}