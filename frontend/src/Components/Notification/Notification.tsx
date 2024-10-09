import React, { useEffect, useState } from "react";
import {
  FetchNotification,
  Notification,
  ResponseNotification,
} from "../../models/notification.model";
import {
  deleteNotification,
  fetchNotifications,
} from "../../Services/notification.services";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import { RotatingLines } from "react-loader-spinner";
interface Notifications {
  isOpen: boolean;
}
export const NotificationPage: React.FC<Notifications> = ({ isOpen }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>();
  const [loader, setLoader] = useState<boolean>(false);

  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();

  const user = useSelector((state: RootState) => state.root.auth.userInfo);

  const getNotification = async ({
    uid,
    currentFirstDoc,
    currentLastDoc,
    pageSize,
    sort,
    direction,
  }: FetchNotification) => {
    setLoader(true);
    try {
      const response = (await fetchNotifications({
        uid,
        currentFirstDoc,
        currentLastDoc,
        pageSize,
        sort,
        direction,
      })) as ResponseNotification;
      setCurrentDoc({
        currentFirstDoc: response.currentFirstDoc,
        currentLastDoc: response.currentLastDoc,
      });
      if (response.notifications.length < 4) setHasMore(false);
      setTotalData(response.length);
      setNotifications((prev) => {
        return prev
          ? [
              ...prev,
              ...response.notifications.filter((notification) =>
                prev.every((value) => value.id !== notification.id)
              ),
            ]
          : response.notifications;
      });
    } catch (error) {
      setNotifications([]);
      console.log("Error while fetch notification " + error);
    }
    setLoader(false);
  };

  useEffect(() => {
    if (isOpen) {
      getNotification({
        uid: user.uid as string,
        currentFirstDoc: null,
        currentLastDoc: null,
        pageSize: 5,
        sort: "desc",
        direction: "next",
      });
    }
  }, [isOpen]);

  const removeNotification = async (id: string) => {
    try {
      await deleteNotification({ id: id });
      setNotifications((prev) => {
        return prev.filter((notification) => notification.id !== id);
      });
    } catch (error) {
      throw new Error("Error while remove notifcation " + error);
    }
  };

  return (
    <div className="p-4 sm:w-[400px] min-w-[330px] min-h-40  bg-[var(--light-background)] border-[var(--dark-border)] border-[1px]  rounded-xl ">
      <h2 className="mb-4 text-lg font-semibold">Notifications</h2>
      <div
        id="notification"
        className="w-full h-[350px] flex   justify-center pr-4 scrollbar-custom"
      >
        <InfiniteScroll
          scrollableTarget={"notification"}
          hasMore={hasMore}
          dataLength={(totalData as number) || 0}
          next={() =>
            getNotification({
              currentFirstDoc: currentDoc?.currentFirstDoc || null,
              currentLastDoc: currentDoc?.currentLastDoc || null,
              pageSize: 5,
              sort: "desc",
              uid: user.uid as string,
              direction: "next",
            })
          }
          loader={
            loader && (
              <div className="flex flex-col items-center justify-center w-full pt-3 ">
                {/* <Skeleton height={70} count={5} /> */}
                <div className="flex items-center justify-center gap-3">
                  <RotatingLines strokeColor="var(--dark-text)" width="27" />
                  <span className="text-[17px] text-[var(--dark-text)] tracking-wider ">
                    {" "}
                    loading...
                  </span>
                </div>
              </div>
            )
          }
        >
          {!loader && notifications?.length <= 0 ? (
            <p className="text-gray-200  w-full  mt-28 text-[18px] h-full flex items-center justify-center py-6">
              No notifications available.
            </p>
          ) : (
            notifications?.map((notification) => (
              <NoticationContainer
                key={notification.id}
                isLoading={loader}
                notification={notification}
                closeNotification={(id) => removeNotification(id)}
              />
            ))
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

interface NotificationProp {
  notification: Notification;
  closeNotification: (id: string) => void;
  isLoading: boolean;
}
const NoticationContainer: React.FC<NotificationProp> = ({
  notification,
  closeNotification,
}: {
  notification: Notification;
  closeNotification: (id: string) => void;
}) => {
  return (
    <div
      key={notification.uid}
      className="relative flex items-center w-full p-4 mb-4 text-gray-900 bg-white border rounded-lg shadow-lg"
    >
      <div className="flex-1">
        <h4 className="font-semibold">{notification.title}</h4>
        <p className="text-sm">{notification.message}</p>
        {/* <p className="text-xs text-gray-500">{notification.time}</p> */}
      </div>
      <button
        className="ml-4 text-gray-500 hover:text-gray-700"
        onClick={() => closeNotification(notification.id)}
        aria-label="Close notification"
      >
        &times; {/* Close icon */}
      </button>
    </div>
  );
};
