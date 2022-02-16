import { ReactNode } from "react"

export type User = {
  email: string
  permissions: string[]
  roles: string[]
}

export type SignInCredentials = {
  email: string
  password: string
}

export interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>
  user: User | undefined
  isAuthenticated: boolean
}

export interface AuthProviderProps {
  children: ReactNode
}
