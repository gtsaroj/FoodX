import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "./Store";
import { useEffect } from "react";
import { UserRole } from "./models/user.model";

interface PrivateRouteProp {
  userRole: string[];
}

const PrivateRoute: React.FC<PrivateRouteProp> = ({ userRole }) => {
  const location = useLocation();

  const auth = useSelector((state: RootState) => state.root.auth);

  useEffect(() => {}, [auth.userInfo, auth.success]);

  return auth.success ? (
    userRole.includes(auth.userInfo.role as UserRole["role"]) ? (
      <Outlet />
    ) : (
      <div>Unauthorized Access</div>
    )
  ) : (
    <Navigate to={"/login"} state={location} replace></Navigate>
  );
};

export default PrivateRoute;
