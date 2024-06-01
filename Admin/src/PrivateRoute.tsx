import { useSelector } from "react-redux";
import { RootState } from "./Reducer/Store";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface PrivateRouteProp {
  UserRole: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProp> = ({ UserRole }) => {
  const auth = useSelector((state: RootState) => state.root.auth);
  const [showContent, setShowContent] = useState<boolean>(false);

  const location = useLocation();
  

  useEffect(() => {
    auth.success ? setShowContent(true) : setShowContent(false);
  }, [auth.success, auth.userInfo]);
  

  return showContent ? (
    UserRole.includes(auth.userInfo?.role) ? (
      <Outlet />
    ) : (
      <div>Unauthorized Access</div>
    )
  ) : (
    <Navigate to={"/login"} state={location} replace />
  );
};
