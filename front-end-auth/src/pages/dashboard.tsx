import { GetServerSideProps } from "next"
import { useEffect } from "react"
import { Can } from "../components/Can"
import { useAuth } from "../context/AuthContext"
import { useCan } from "../hooks/useCan"
import { setupApiClient } from "../services/api"
import { api } from "../services/apiClient"
import { withSSRAuth } from "../utils/withSSRAuth"

const Dashboard = () => {
  const { user, signOut } = useAuth()

  useEffect(() => {
    api
      .get("/me")
      .then((response) => console.log(response))
      .catch((err) => console.log(err))
  }, [])

  return (
    <>
      <h1>Dashboard {user?.email}</h1>

      <button onClick={signOut}>Sign out</button>
      <Can permissions={["metrics.list"]}>
        <div>Métricas</div>
      </Can>
    </>
  )
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx)
  const response = await apiClient.get("/me")

  return {
    props: {},
  }
})
