import { GetServerSideProps } from "next"
import { setupApiClient } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"

const Dashboard = () => {
  return (
    <>
      <h1>Metrics</h1>
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
}, {
  permissions: ['metrics.list'],
  roles: ['administrator']
})
