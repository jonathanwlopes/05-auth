import { useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { api } from "../services/api"

const Dashboard = () => {
  const { user } = useAuth()

  useEffect(() => {
    api
      .get("/me")
      .then((response) => console.log(response))
      .catch((err) => console.log(err))
  }, [])

  return <h1>Dashboard {user?.email}</h1>
}

export default Dashboard
