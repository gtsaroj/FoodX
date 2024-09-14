import React, { useEffect } from "react";
import { InfinitySpin, RotatingLines } from "react-loader-spinner";

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
        loadingFn && loadingFn();
      }
    }, 700);

    return () => {
      clearTimeout(loadingTime);
    };
  }, [isLoading]);

  return (
    <div
      className={`w-screen h-screen left-0 top-0  z-[100] dark:bg-[#080e18] bg-[var(--var(--body-bg))] flex items-center justify-center fixed ${
        isLoading ? "visible" : "invisible"
      } `}
    >
      <p className="text-[20px]  flex items-center justify-center gap-3 text-[var(--dark-text)] font-semibold ">
        <RotatingLines strokeColor="var(--dark-text)" width="30" />{" "}
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
        loadingFn && loadingFn();
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

export const Loader: React.FC<LoadingTextProp> = ({ isLoading, loadingFn }) => {
  useEffect(() => {
    const loadingTime = setTimeout(() => {
      if (isLoading) {
        loadingFn && loadingFn();
      }
    }, 700);

    return () => {
      clearTimeout(loadingTime);
    };
  }, [isLoading]);

  return (
    <div
      className={`w-screen h-screen left-0 top-0  z-[100] dark:bg-[#080e18] bg-[var(--var(--body-bg))] flex items-center justify-center fixed ${
        isLoading ? "visible" : "invisible"
      } `}
    >
      <p className="text-[20px]  flex items-center justify-center gap-3 text-[var(--dark-text)] font-semibold ">
        <InfinitySpin color="blue" width="200" />
      </p>
    </div>
  );
};
