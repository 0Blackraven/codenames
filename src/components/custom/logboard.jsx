import { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedList } from "../magicui/animated-list";


const [notifications, setNotifications] = useState([
  { name: "System", description: "Welcome to the game!" },
  { name: "System", description: "You are the spymaster!" },
]);

Socket.on("notification", (notification, username) => {
  setNotifications((prevNotifications) => [
    ...prevNotifications,
    { name: username, description: notification }
  ]); 
});




const Notification = ({ name, description}) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-transparent",
        // dark styles
        "transform-gpu dark:bg-transparent ",
        )}
    >
      <div className="flex flex-row items-center gap-3">
        
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <h1 className="text-sm sm:text-medium">{name}</h1>
            <h1 className="mx-1">:</h1>
            <p className="text-sm font-normal dark:text-white/60">
                {description}
            </p>
          </figcaption>
        </div>
      </div>
    </figure>
  );
};

export function Logboard({
  className,
}) {
  return (
    <div className="flex flex-col justify-center items-center border-2 border-gray-200 rounded-lg w-[40rem] mx-auto">
        <div
        className={cn(
            "relative flex flex-col overflow-hidden p-2",
            className,
        )}
        >
        <AnimatedList>
            {notifications.map((item, idx) => (
            <Notification {...item} key={idx} />
            ))}
        </AnimatedList>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
        </div>
    </div>
  );
}
