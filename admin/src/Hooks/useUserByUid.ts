import { useQuery } from "react-query";
import { getUserByUid } from "../Utility/user.utils";

export const useUserByUid = (uid: string) => {
  return useQuery([`user`, uid], () => getUserByUid(uid), {
    cacheTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
