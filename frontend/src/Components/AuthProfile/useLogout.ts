import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { makeRequest } from "../../makeRequest";
import { resetCart } from "../../Reducer/product.reducer";
import { signOutUser } from "../../firebase/Authentication";
import { authLogout } from "../../Reducer/user.reducer";
import Cookies from "js-cookie";
import { RootState } from "../../Store";
import { addLogs } from "../../Services/log.services";
import dayjs from "dayjs";
import { resetOrder } from "../../Reducer/order.reducer";
import { resetFavourite } from "../../Reducer/favourite.reducer";

interface UseLogoutReturn {
  loading: boolean;
  logout: () => void;
}

export const useLogout = (): UseLogoutReturn => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.root.auth.userInfo);

  const logout = async () => {
    const toastLoader = toast.loading("Logging out, please wait...");
    const currentDate = dayjs().toISOString();

    setLoading(true);
    try {
      const response = await makeRequest.post("/users/logout");

      if (response.status === 200) {
        await signOutUser();
        await addLogs({
          action: "logout",
          date: currentDate,
          detail: ` ${user.fullName} was logged out at ${currentDate} `,
          userId: user.uid,
          userRole: user.role,
        });
         dispatch(resetOrder())
        dispatch(authLogout());
        dispatch(resetCart());
      dispatch(resetFavourite())
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        toast.dismiss(toastLoader);
        toast.success("Logged out successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error logging out. Please try again.");
      // throw new Error("Error logging out." + error);
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
};
