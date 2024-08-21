import { makeRequest } from "./makeRequest";
import { useEffect, useState } from "react";
import { Product, ProductType } from "./models/product.model";
import { RootState, Store } from "./Store";
import { authLogout } from "./Reducer/user.reducer";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

const DelayRequestTime = <T>(fn: () => Promise<T>, time: number) => {
  return function executated() {
    setTimeout(async () => await fn(), time);
  };
};

export const UseFetch = (url: string) => {
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Product[]>();
  const authUser = useSelector((state: RootState) => state.root.auth);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
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
    // fetchApiData()
    const delay = DelayRequestTime(fetchApiData, 200);
    delay();
  }, [url, authUser.success]);

  return { error, data, loading };
};
