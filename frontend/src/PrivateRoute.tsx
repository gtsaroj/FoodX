import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, persistor } from "./Reducer/Store";
import { useNavigate } from "react-router-dom";

const PrivateRoute = () => {
  const [ShowContent, SetShowContent] = useState<boolean>(true);
 const navigate = useNavigate()
  const loginUser = useSelector((state: RootState) => state.root.loginAuth);
  const signin = useSelector((state: RootState) => state.root.loginAuth);


  useEffect(() => {
    loginUser.success || signin.success
      ? SetShowContent(true)
      : SetShowContent(false);

  }, [loginUser, signin]);



  return (
    ShowContent ? <Outlet /> : navigate("/login")
  )
  
};

export default PrivateRoute;
