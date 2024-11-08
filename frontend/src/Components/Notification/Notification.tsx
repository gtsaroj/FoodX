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
import { GiRingingBell } from "react-icons/gi";
import { ChevronDown } from "lucide-react";
import { getRemainingTime } from "../../Utility/date.utility";
import toast from "react-hot-toast";
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
    const toastLoader = toast.loading("Loading...");
    try {
      await deleteNotification({ id: id });
      setNotifications((prev) => {
        return prev.filter((notification) => notification.id !== id);
      });
    } catch (error) {
      throw new Error("Error while remove notifcation " + error);
    } finally {
      toast.dismiss(toastLoader);
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
  closeNotification,
}) => {
  const [openId, setOpenId] = useState<string>("");

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  return (
    <div
      key={notification.uid}
      className="relative flex flex-col p-2 mb-4 bg-[var(--light-foreground)] rounded-lg shadow-md border border-[var(--dark-border)] transition-transform duration-150"
    >
      {/* Notification Header */}
      <div
        // onClick={() => handleToggle(notification.id)}
        className="flex items-center justify-between cursor-pointer w-full"
      >
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 p-2 rounded-full flex items-center justify-center text-white">
            {/* Placeholder icon or notification type icon */}
            <GiRingingBell className="text-white size-5 " />
          </div>
          <div>
            <h4 className="text-[15px] font-semibold">{notification.title}</h4>
            <p className="text-xs text-[var(--dark-secondary-text)]">
              {notification.id}
            </p>
          </div>
        </div>
        <button onClick={() => closeNotification(notification.id)}>
          <span className="text-red-500 tracking-widest font-semibold  text-[12px]">
            X
          </span>
        </button>
      </div>

      {/* Notification Message */}
      <p
        className={`text-sm text-gray-400 mt-2 transition-all duration-300 overflow-hidden ${
          openId === notification.id
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        {notification.message}
      </p>

      {/* Chevron Icon and Time */}
      <div className="flex justify-between items-center pt-2 text-xs text-[var(--dark-secondary-text)]">
        <button
          onClick={() => handleToggle(notification.id)}
          className="transition-transform"
        >
          <ChevronDown
            className={`${openId === notification.id ? "rotate-180" : ""}`}
          />
        </button>
        <span>
          {getRemainingTime(dayjs.unix(notification?.createdAt._seconds))} ago
        </span>
      </div>
    </div>
  );
};
