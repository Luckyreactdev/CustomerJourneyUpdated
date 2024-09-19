import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { accessToken } = useSelector((state) => state.account);
  const isLoggedIn = accessToken ? true : false;
  const location = useLocation();
  const { pathname } = location || {};

  if (!isLoggedIn) {
    // If the user is not authenticated, redirect to the login page,
    // preserving the current pathname for future reference.
    return <Navigate to="/signin" state={{ from: pathname }} replace={true} />;
  }

  // If the user is authenticated, render the protected content.
  return children;
};

export default PrivateRoute;
