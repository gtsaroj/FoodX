import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "./Store";
import { useEffect } from "react";

interface PrivateRouteProp {
  userRole: string[];
}

const PrivateRoute: React.FC<PrivateRouteProp> = ({ userRole }) => {
  const location = useLocation();

  const auth = useSelector((state: RootState) => state.root.auth);

  useEffect(() => {}, [auth.userInfo, auth.success]);

  return auth.success ? (
    userRole.includes(auth.userInfo.role) ? (
      <Outlet />
    ) : (
      <div>Unauthorized Access</div>
    )
  ) : (
    <Navigate to={"/"} state={location} replace></Navigate>
  );
};

export default PrivateRoute;
