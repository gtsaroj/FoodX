import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top whenever the pathname changes (route changes)
    window.scrollTo(0, 0);
  }, [pathname]);
};

export default useScrollToTop;
