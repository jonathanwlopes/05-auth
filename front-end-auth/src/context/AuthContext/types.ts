import { ReactNode } from "react"

export type SignInCredentials = {
  email: string
  password: string
}

export interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>
  isAuthenticated: boolean
}

export interface AuthProviderProps {
  children: ReactNode
}
