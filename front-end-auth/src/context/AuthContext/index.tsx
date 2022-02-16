import { createContext, useContext } from "react"
import { AuthContextData, AuthProviderProps, SignInCredentials } from "./types"

const AuthContext = createContext({} as AuthContextData)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const isAuthenticated = false

  async function signIn({ email, password }: SignInCredentials) {
    console.log({ email, password })
  }

  return <AuthContext.Provider value={{ isAuthenticated, signIn }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const _context = useContext(AuthContext)
  return _context
}
