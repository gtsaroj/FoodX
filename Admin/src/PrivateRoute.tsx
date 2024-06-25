import { useSelector } from "react-redux";
import { RootState } from "./Reducer/Store";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface PrivateRouteProp {
  UserRole: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProp> = ({ UserRole }) => {
  const auth = useSelector((state: RootState) => state.root.auth);

  useEffect(() => {}, [auth.success, auth?.userInfo]);

  return auth.success ? (
    UserRole.includes("admins") ? (
      <Outlet />
    ) : (
      <div>Unauthorized Access</div>
    )
  ) : (
    <Navigate to={"/login"} replace />
  );
};
