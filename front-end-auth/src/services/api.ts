import axios, { AxiosError } from "axios"
import { GetServerSidePropsContext } from "next"
import { parseCookies, setCookie } from "nookies"
import { signOut } from "../context/AuthContext"
import { AuthTokenError } from "./errors/AuthTokenError"

interface FailedRequestQueueProps {
  onSuccess: (token: string) => void
  onFailure: (err: AxiosError) => void
}

let isRefreshing = false
let failedRequestQueue: FailedRequestQueueProps[] = []

type Context = undefined | GetServerSidePropsContext;

export function setupApiClient(ctx: Context = undefined) {
  let cookies = parseCookies(ctx)

  const api = axios.create({
    baseURL: "http://localhost:3333",
  })

  api.defaults.headers.common["Authorization"] = `Bearer ${cookies["nextauth.token"]}`

  api.interceptors.response.use(
    (response) => {
      return response
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (error.response.data?.code === "token.expired") {
          cookies = parseCookies(ctx)
          const { "nextauth.refreshToken": refreshToken } = cookies
          const originalConfig = error.config

          if (!isRefreshing) {
            isRefreshing = true

            api
              .post("/refresh", {
                refreshToken,
              })
              .then((response) => {
                const { token } = response.data

                setCookie(ctx, "nextauth.token", token, {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: "/",
                })

                setCookie(ctx, "nextauth.refreshToken", response.data.refreshToken, {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: "/",
                })

                api.defaults.headers.common["Authorization"] = `Bearer ${token}`

                failedRequestQueue.forEach((request) => request.onSuccess(token))
                failedRequestQueue = []
              })
              .catch((err) => {
                failedRequestQueue.forEach((request) => request.onFailure(err))
                failedRequestQueue = []

                if (typeof window !== "undefined") {
                  signOut()
                } else {
                  return Promise.reject(new AuthTokenError)
                }
              })
              .finally(() => {
                isRefreshing = false
              })
          }

          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              onSuccess: (token: string) => {
                if (!originalConfig.headers) return

                originalConfig.headers["Authorization"] = `Bearer ${token}`

                resolve(api(originalConfig))
              },

              onFailure: (err: AxiosError) => {
                reject(err)
              },
            })
          })
        } else {
          if (typeof window !== "undefined") {
            signOut()
          }
        }
      }

      return Promise.reject(error)
    }
  )

  return api
}
