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
import dayjs from "dayjs";
import { ChevronDown } from "lucide-react";
import { getRemainingTime } from "../../Utility/date.utility";
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
    <div className="p-2 sm:w-[400px] min-w-[330px] min-h-40  bg-[var(--light-foreground)] border-[var(--dark-border)] border-[1px]  rounded-xl ">
      <h2 className="px-6 py-4 mb-4 text-lg font-semibold">Notifications</h2>
      <div
        id="notification"
        className="w-full h-[350px] flex  scrollbar-custom   justify-center pr-4 "
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
              <div className="relative flex flex-col items-center justify-center w-full h-full pt-3 ">
                {/* <Skeleton height={70} count={5} /> */}
                <div className="flex items-center   w-full gap-2  min-[200px] h-full min-h-[200px] ">
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
}: {
  notification: Notification;
  closeNotification: (id: string) => void;
  isLoading: boolean;
}) => {
  const [openId, setOpenId] = useState<string>(""); // Track the currently open notification ID

  const handleToggle = (id: string) => {
    setOpenId((prev) =>
      prev === id ? "" : !prev ? id : prev !== id ? "" : ""
    );
  };

  console.log(openId);

  return (
    <div
      key={notification.uid}
      className="relative border-b-[1px] border-[var(--dark-border)] flex w-full bg-[var(--light-foreground)] items-start p-4 mb-4"
    >
      <div
        className={`sm:w-[280px] w-[230px] duration-150 flex flex-col gap-2.5`}
      >
        <div
          onClick={() => handleToggle(notification.id)}
          className="flex items-start justify-between w-full pr-1"
        >
          <div className="flex flex-col gap-1">
            <h4 className="tracking-wider text-[14px] sm:text-[15px]">
              {notification.title}
            </h4>
            <p className="text-xs text-[var(--dark-secondary-text)]">
              {notification.id}
            </p>
          </div>
        </div>
        <p
          className={`text-sm text-gray-400 duration-150 ${
            openId === notification.id
              ? "flex  opacity-[100]"
              : "hidden  opacity-0"
          }`}
        >
          {notification.message}
        </p>
      </div>
      <div className="flex flex-col items-start justify-center gap-1">
        <button onClick={() => handleToggle(notification.id)}>
          <ChevronDown
            className={`duration-200 ${
              notification.id === openId ? "rotate-180" : ""
            }`}
          />
        </button>
        <div className="flex w-[100px] bottom-1 right-0 absolute items-center justify-center text-xs text-[var(--dark-secondary-text)]">
          {getRemainingTime(dayjs.unix(notification?.createdAt._seconds))} ago
        </div>
      </div>
    </div>
  );
};
