import { makeRequest } from "./makeRequest";
import { useEffect, useState } from "react";
import { ProductType } from "./models/productMode";
import { RootState, Store } from "./Reducer/Store";
import { authLogout } from "./Reducer/authReducer";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

export const UseFetch = (url: string) => {
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ProductType[]>();
  const authUser = useSelector((state: RootState) => state.root.auth);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setLoading(true);
        console.log(authUser.success);
        if (!authUser.success) {
          return setLoading(true);
        }
        const refresToken = Cookies.get("refreshToken");
        if (!refresToken) {
          Store.dispatch(authLogout())
        }
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
          return setLoading(true);
        }
        const response = await makeRequest.get(url);
        const responseData = await response.data.data.products;
        setLoading(false);
        setData(responseData);
      } catch (err: any) {
        setError(err);
        console.error(`failed while getting data from server => ${err}`);
        if (err === "You have not access, please login again...") {
          Store.dispatch(authLogout());
        }
      }
    };

    fetchApiData();
  }, [url]);

  return { error, data, loading };
};
