import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectTo = user.role === "admin" ? "/admin" : "/employee";
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}
