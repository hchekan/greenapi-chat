import styles from "./MessageStatus.module.scss";
import SendIcon from "@icons/sendMes.svg?react";
import ReadIcon from "@icons/readMes.svg?react";
import clsx from "clsx";

interface MessageStatusProps {
  status: string;
  isOwn: boolean;
}

const MessageStatus = ({ status, isOwn }: MessageStatusProps) => {
  return (
    <>
      {isOwn && status !== "deleted" && (
        <span
          className={clsx(styles.messageStatus, {
            [styles.statusSend]: status === "send",
            [styles.statusDelivered]: status === "delivered",
            [styles.statusRead]: status === "read",
          })}
        >
          {(status === "delivered" || status === "sent") && (
            <SendIcon className={styles.icon} />
          )}
          {status === "read" && <ReadIcon className={styles.icon} />}
        </span>
      )}
    </>
  );
};

export default MessageStatus;
