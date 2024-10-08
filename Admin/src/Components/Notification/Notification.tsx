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

  const user = useSelector((state: RootState) => state.root.user.userInfo);

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
      if (response.length < 4) return setHasMore(false);
      setTotalData(response.length);
      setNotifications(response.notifications);
      setCurrentDoc({
        currentFirstDoc: response.currentFirstDoc,
        currentLastDoc: response.currentLastDoc,
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
        sort: "asc",
        direction: "next",
      });
    }
  }, [isOpen, user.uid]);

  return (
    <div className="p-4 w-[400px] min-h-40 bg-[var(--light-background)] border-[var(--dark-border)] border-[1px]  rounded-xl ">
      <h2 className="text-lg font-semibold text-white mb-4">Notifications</h2>
      <div
        id="notification"
        className="w-full h-[350px] flex items-center justify-center pr-4 scrollbar-custom"
      >
        <InfiniteScroll
          scrollableTarget={"notification"}
          hasMore={hasMore}
          dataLength={(totalData as number) || 0}
          next={() =>
            getNotification({
              currentFirstDoc: null || currentDoc?.currentFirstDoc,
              currentLastDoc: null || currentDoc?.currentLastDoc,
              pageSize: 5,
              sort: "desc",
              uid: user.uid as string,
              direction: "next",
            })
          }
          loader={
            loader && (
              <div className="w-full flex flex-col items-center pt-3 justify-center ">
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
          <NoticationContainer
            isLoading={loader}
            notifications={notifications}
            closeNotification={(id) =>
              setNotifications((prev) => [
                ...prev.filter((value) => value.id !== id),
              ])
            }
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};

interface NotificationProp {
  notifications: Notification[];
  closeNotification: (id: string) => void;
  isLoading: boolean;
}
const NoticationContainer: React.FC<NotificationProp> = ({
  notifications,
  closeNotification,
  isLoading,
}: {
  notifications: Notification[];
  closeNotification: (id: string) => void;
}) => {
  console.log(notifications);
  const removeNotification = async (id: string) => {
    try {
      await deleteNotification({ id: id });
      closeNotification(id);
    } catch (error) {
      throw new Error("Error while remove notifcation " + error);
    }
  };

  return notifications.length === 0 && !isLoading ? (
    <p className="text-gray-200  w-full  text-[18px] h-full flex items-center justify-center py-6">
      No notifications available.
    </p>
  ) : (
    notifications.map((notification) => (
      <div
        key={notification.uid}
        className="relative flex items-center p-4 mb-4 border rounded-lg shadow-lg bg-white text-gray-900"
      >
        <div className="flex-1">
          <h4 className="font-semibold">{notification.title}</h4>
          <p className="text-sm">{notification.message}</p>
          <p className="text-xs text-gray-500">{notification.time}</p>
        </div>
        <button
          className="ml-4 text-gray-500 hover:text-gray-700"
          onClick={() => removeNotification(notification.uid)}
          aria-label="Close notification"
        >
          &times; {/* Close icon */}
        </button>
      </div>
    ))
  );
};
