import React from "react";
import Notification from "./Notification";
import type { ColorType } from "../utils";

export interface NotificationItem {
  id: number;
  color: ColorType;
  autoClose: boolean;
  children: React.ReactNode;
}

export type NotifyFunction = (options: {
  color: ColorType;
  autoClose: boolean;
  children: React.ReactNode;
}) => void;

export interface NotificationsManagerProps {
  setNotify: (notifyFn: NotifyFunction) => void;
}

function* idMakerNotify(): Generator<number, void, unknown> {
  let index = -1;
  while (true) {
    yield index--;
  }
}

const it = idMakerNotify();

export default function NotificationsManager({
  setNotify,
}: NotificationsManagerProps) {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);

  const createNotification: NotifyFunction = ({ color, autoClose, children }) => {
    setNotifications((prevNotifications) => {
      return [
        ...prevNotifications,
        {
          children,
          color,
          autoClose,
          id: it.next().value,
        },
      ];
    });
  };

  React.useEffect(() => {
    setNotify(createNotification);
  }, [setNotify]);

  const deleteNotification = (indexToDelete: number) => {
    setNotifications((prev) => 
      prev.filter((_, index) => index !== indexToDelete)
    );
  };

  return (
    <>
      {notifications.map(({ id, ...props }, index) => (
        <Notification
          key={id}
          onDelete={() => deleteNotification(index)}
          {...props}
        />
      ))}
    </>
  );
}