import type { GetServerSideProps, NextPage } from "next"
import { FormEvent, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { parseCookies } from "nookies"

import styles from "../styles/Home.module.css"
import { withSSRGuest } from "../utils/withSSRGuest"

const Home: NextPage = () => {
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const data = {
      email,
      password,
    }

    await signIn(data)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>
  )
}

export const getServerSideProps: GetServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})
export default Home
