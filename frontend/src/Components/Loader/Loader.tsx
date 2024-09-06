import React, { useEffect } from "react";
import { RotatingLines } from "react-loader-spinner";

const Loader: React.FC = () => {
  return <div>Loader</div>;
};

export default Loader;

interface LoadingTextProp {
  isLoading: boolean;
  loadingFn?: () => void;
}
export const LoadingText: React.FC<LoadingTextProp> = ({
  isLoading,
  loadingFn,
}) => {
  useEffect(() => {
    const loadingTime = setTimeout(() => {
      if (isLoading) {
    loadingFn()
      }
    }, 700);

    return () => {
      clearTimeout(loadingTime);
    };
  }, [isLoading]);

  return (
    <div
      className={`w-screen h-screen backdrop-blur-sm brightness-50   left-0 top-0  z-[100]   flex items-center justify-center fixed ${
        isLoading ? "visible" : "invisible"
      } `}
    >
      <p className="text-[20px]  flex items-center justify-center gap-3 text-[var(--dark-text)] font-semibold ">
        <RotatingLines strokeColor="#10161f" width="30" />{" "}
        <span> Loading...Please wait!</span>
      </p>
    </div>
  );
};

export const LoadingContent: React.FC<LoadingTextProp> = ({
  isLoading,
  loadingFn,
}) => {
  console.log(isLoading);
  useEffect(() => {
    const loadingTime = setTimeout(() => {
      if (isLoading) {
        loadingFn();
      }
    }, 440);

    return () => {
      clearTimeout(loadingTime);
    };
  }, [isLoading]);

  return (
    <div
      className={`w-full  bg-[var(--light-foreground)] backdrop-blur-sm  left-0 top-0  z-[100]   flex items-center justify-center  ${
        isLoading ? "visible" : "invisible"
      } `}
    >
      <p className="text-[20px]  flex items-center justify-center gap-3 text-[var(--light-secondary-text)] font-semibold ">
        <RotatingLines strokeColor="var(--dark-secondary-text)" width="27" />{" "}
        <span> Loading...Please wait!</span>
      </p>
    </div>
  );
};
