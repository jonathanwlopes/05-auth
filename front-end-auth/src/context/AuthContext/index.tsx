import { createContext, useContext, useEffect, useState } from "react"
import Router from "next/router"
import { api } from "../../services/api"
import { setCookie, parseCookies, destroyCookie } from "nookies"
import { AuthContextData, AuthProviderProps, SignInCredentials, User } from "./types"

const AuthContext = createContext({} as AuthContextData)

export const signOut = () => {
  destroyCookie(undefined, "nextauth.token")
  destroyCookie(undefined, "nextauth.refreshToken")

  Router.push("/")
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies()

    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { email, permissions, roles } = response.data

          setUser({ email, permissions, roles })
        })
        .catch(() => {
          signOut()
        })
    }
  }, [])

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("/sessions", {
        email,
        password,
      })

      const { token, refreshToken, permissions, roles } = response.data

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      })

      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      })

      setUser({
        email,
        permissions,
        roles,
      })

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      Router.push("/dashboard")
    } catch (err) {
      console.log(err)
    }
  }

  return <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const _context = useContext(AuthContext)
  return _context
}
