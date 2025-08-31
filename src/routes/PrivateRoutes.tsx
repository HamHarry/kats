import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRoutesProps {
  isAuthented: boolean;
}

const PrivateRoutes: React.FC<PrivateRoutesProps> = ({ isAuthented }) => {
  if (isAuthented) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
};

export default PrivateRoutes;
