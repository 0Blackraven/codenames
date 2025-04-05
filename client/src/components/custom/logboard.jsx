import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { AnimatedList } from "../magicui/animated-list";
import { Socket } from "../../socket";

const Notification = ({ name, description }) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-transparent",
        "transform-gpu dark:bg-transparent",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
            <p className="text-sm font-normal dark:text-white/60">{description}</p>
          </figcaption>
        </div>
      </div>
    </figure>
  );
};

export function Logboard({ className }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNotification = (notification,) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {description: notification},
      ]);
    };
    const handleReconnectedLogs = (logs) => {
      setNotifications(logs.map(log => ({description: log })));
    };

    Socket.on("notification", handleNotification);
    Socket.on("reconnectedlogs", handleReconnectedLogs);

    // Cleanup to avoid duplicate listeners
    return () => {
      Socket.off("reconnectedlogs", handleReconnectedLogs);
      Socket.off("notification", handleNotification);
    };
  }, [notifications]); // Empty dependency array ensures this runs only once

  return (
    <div className={cn("justify-center items-center border-2 border-gray-200 lg:rounded-lg mx-auto",className)}>
      <div className={cn("overflow-hidden", className)}>
        <AnimatedList>
          {notifications.map((item, idx) => (
            <Notification {...item} key={idx} />
          ))}
        </AnimatedList>
        {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div> */}
      </div>
    </div>
  );
}
