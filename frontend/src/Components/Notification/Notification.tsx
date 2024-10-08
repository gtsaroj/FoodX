import React, { useState } from "react";

interface Notification {
  uid: string;
  message: string;
  time: string; // Format: "YYYY-MM-DD HH:mm:ss"
  title: string;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      uid: "1",
      message: "Your order has been shipped!",
      time: "2024-10-08 10:00:00",
      title: "Order Update",
    },
    {
      uid: "2",
      message: "New promotional offer available!",
      time: "2024-10-08 09:30:00",
      title: "Promotion",
    },
    {
      uid: "3",
      message: "Your profile has been updated successfully.",
      time: "2024-10-07 15:00:00",
      title: "Profile Update",
    },
    // Add more notifications as needed
  ]);

  const handleClose = (uid: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.uid !== uid)
    );
  };

  return (
    <div className="p-4 w-[400px] min-h-40 bg-[var(--primary-color)]  rounded-xl ">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      <div className="w-full h-[350px] pr-4 scrollbar-custom">
        {notifications.length === 0 ? (
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
                onClick={() => handleClose(notification.uid)}
                aria-label="Close notification"
              >
                &times; {/* Close icon */}
              </button>
            </div>
          ))
        )}
      </div>
      {/* <button
        className={`w-full text-end text-[13px] hover:underline ${
          notifications.length > 0 ? "visible" : "hidden"
        }`}
      >
        View more
      </button> */}
    </div>
  );
};

export default NotificationPage;
