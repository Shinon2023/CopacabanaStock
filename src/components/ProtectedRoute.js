import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component }) => {
  const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";
  return isLoggedIn ? <Component /> : <Navigate to="/pleaselogin"/>;
};

export default ProtectedRoute;
