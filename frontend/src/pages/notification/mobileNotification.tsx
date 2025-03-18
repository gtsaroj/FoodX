import { useNotification, useViewPort } from "@/hooks";
import { Icons } from "@/utils";
import { NotificationCard, NotificationLoader } from "@/components";
import { useNavigate } from "react-router-dom";
import { Empty } from "@/commons";
import { useEffect } from "react";
import { Error } from "@/commons";
import { useInView } from "react-intersection-observer";

export const MobileNotification = () => {
  const { isVisible } = useViewPort();
  const {
    hasMore,
    fetchData,
    data,
    fetchNextPage,
    isError,
    isLoading,
    currentDoc,
  } = useNotification({ isOpen: isVisible });

  const { ref, inView } = useInView({
    rootMargin: "0px 0px 100px 0px",
    threshold: [1],
  });

  useEffect(() => {
    if (inView && hasMore) {
      fetchNextPage({
        pageParam: {
          currentFirstDoc: currentDoc?.currentFirstDoc,
          currentLastDoc: currentDoc?.currentLastDoc,
        },
      });
    }
  }, [inView, fetchNextPage]);

  const navigate = useNavigate();

  return (
    <div
      id="notification"
      className="w-full flex flex-col items-start justify-start gap-10 py-5 px-2"
    >
      <div className="w-full fixed top-0 right-0 left-0  py-4 z-[100] bg-white flex  items-center justify-between">
        <button onClick={() => navigate(-1)}>
          <Icons.arrowLeft />
        </button>
        <h1 className=" font-semibold text-[16px] text-[var(--secondary-text)] sm:text-[20px] ">
          Notications
        </h1>
        <div></div>
      </div>
      <div className="w-full pt-16 flex flex-col items-start justify-start gap-5">
        {isError ? (
          <Error
            button={{
              onClick: () => fetchNextPage(),
              title: "Refresh",
            }}
            message={"Something went wrong"}
            title="Error"
          />
        ) : isLoading ? (
          <NotificationLoader />
        ) : fetchData.length <= 0 ? (
          <Empty title="You don't have any notification" />
        ) : (
          fetchData?.map((notification) => (
            <NotificationCard
              key={notification.id}
              isLoading={isLoading}
              notification={notification}
            />
          ))
        )}
      </div>
      <div className="w-full " ref={ref}>
        {isLoading && fetchData.length > 0 && <NotificationLoader />}
      </div>
    </div>
  );
};
