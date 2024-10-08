import React, { useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import { Navigate } from "react-router-dom";
interface LoaderProp {
  url: string;
}

export const Loader: React.FC<LoaderProp> = ({ url }) => {
  const [loader, setLoader] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoader(false); // Toggling loader
    }, 500);
  
    return () => clearTimeout(timer);
  }, [url]);
  

  return loader ? (
    <div className="w-screen z-[10000000]   left-0 bg-[var(--popup-bg)] top-0 fixed h-screen ">
      <div className="w-screen h-screen  backdrop-blur-md flex items-center justify-center ">
        <BallTriangle
          color="blue"
          height={80}
          width={100}
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    </div>
  ) : (
    <Navigate to={`${url}`} replace />
  );
};
