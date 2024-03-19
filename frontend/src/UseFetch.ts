import { makeRequest } from "./makeRequest";
import { useEffect, useState } from "react";
import { ProductType } from "./models/productMode";

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
      }
    };

    fetchApiData();
  }, [url]);

  return { error, data, loading };
};
