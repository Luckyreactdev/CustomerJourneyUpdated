import React from "react"
import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"

const PublicRoute = ({ children }) => {
  const { accessToken } = useSelector((state) => state.account)
  const isLoggedIn = accessToken ? true : false
  const location = useLocation()
  const { from } = location.state || {}
  return !isLoggedIn ? children : <Navigate to={from ? from : "/"} />
}

export default PublicRoute
