import React from "react";
import toast from "react-hot-toast";
import { makeRequest } from "../../makeRequest";
import { resetCart } from "../../reducer/product.reducer";
import { signOutUser } from "../../firebase/Authentication";
import { authLogout } from "../../reducer/user.reducer";
import Cookies from "js-cookie";
import { addLogs } from "../../services/log.services";
import dayjs from "dayjs";
import { resetOrder } from "../../reducer/order.reducer";
import { resetFavourite } from "../../reducer/favourite.reducer";
import { useAppDispatch, useAppSelector } from "../../hooks/useActions";

interface UseLogoutReturn {
  loading: boolean;
  logout: () => void;
}

export const useLogout = (): UseLogoutReturn => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector();

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
          detail: ` ${auth.userInfo.fullName} was logged out at ${currentDate} `,
          userId: auth.userInfo.uid,
          userRole: auth.userInfo.role,
        });
        dispatch(resetOrder());
        dispatch(authLogout());
        dispatch(resetCart());
        dispatch(resetFavourite());
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
