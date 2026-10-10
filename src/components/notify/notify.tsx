import React from "react";
import { createRoot } from "react-dom/client";
import NotificationsManager from "./NotificationsManager";
import type { NotifyFunction } from "./NotificationsManager";
import createContainer from "./createContainer";
import { Color } from "./utils";

const containerElement: HTMLElement = createContainer();
let notify: NotifyFunction | undefined;

const root = createRoot(containerElement);
root.render(
  <NotificationsManager
    setNotify={(notifyFn) => {
      notify = notifyFn;
    }}
  />
);

function triggerNotification(
  color: Color,
  children: React.ReactNode,
  autoClose?: boolean
) {
  if (!notify) {
    console.warn("Notification system is not initialized yet.");
    return;
  }
  
  notify({
    color,
    children,
    autoClose: autoClose ?? false,
  });
}

export function info(children: React.ReactNode, autoClose?: boolean): void {
  triggerNotification(Color.info, children, autoClose);
}

export function success(children: React.ReactNode, autoClose?: boolean): void {
  triggerNotification(Color.success, children, autoClose);
}

export function warning(children: React.ReactNode, autoClose?: boolean): void {
  triggerNotification(Color.warning, children, autoClose);
}

export function error(children: React.ReactNode, autoClose?: boolean): void {
  triggerNotification(Color.error, children, autoClose);
}