import React from "react";
import { createPortal } from "react-dom";
import createContainer from "../createContainer";
import { Color } from "../utils";
import type { ColorType } from "../utils";
import Close from "./close.svg?react";

import "./Notification.scss";

const container = createContainer();

const TIME_TO_DELETE = 300;
const TIME_TO_CLOSE = 4000;

export interface NotificationProps {
  color?: ColorType;
  autoClose?: boolean;
  onDelete: () => void;
  children: React.ReactNode;
}

export default function Notification({
  color = Color.info,
  autoClose = false,
  onDelete,
  children,
}: NotificationProps) {
  const [isClosing, setIsClosing] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (isClosing) {
      const timeoutId = setTimeout(onDelete, TIME_TO_DELETE);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isClosing, onDelete]);

  React.useEffect(() => {
    if (autoClose) {
      const timeoutId = setTimeout(() => setIsClosing(true), TIME_TO_CLOSE);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [autoClose]);

  return createPortal(
    <div className={"react-notify " + (isClosing ? "react-notify-shrink" : "")}>
      <div
        className={
          "react-notification react-notification-" +
          color +
          " react-notification-" +
          (!isClosing ? "slideIn " : "slideOut ")
        }
      >
        {children}

        <button
          onClick={() => setIsClosing(true)}
          className="react-notification-closeButton"
          type="button"
        >
          <Close height={16} />
        </button>
      </div>
    </div>,
    container
  );
}