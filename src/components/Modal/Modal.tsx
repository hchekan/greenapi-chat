import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@icons/close.svg?react";
import styles from "./Modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.container}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <CloseIcon className={styles.icon} onClick={onClose}/>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
