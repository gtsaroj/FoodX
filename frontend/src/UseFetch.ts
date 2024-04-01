import { makeRequest } from "./makeRequest";
import { useEffect, useState } from "react";
import { ProductType } from "./models/productMode";
import { Store } from "./Reducer/Store";
import { authLogout } from "./Reducer/authReducer";

export const UseFetch = (url: string) => {
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ProductType[]>();

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setLoading(true);
        const response = await makeRequest.get(url);
        const responseData = response.data.data.products;
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
