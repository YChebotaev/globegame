import React, { useEffect } from "react";
import "./modal.css";
import { XCircleIcon } from "@heroicons/react/24/outline";

const Modal = ({ active, setActive, children }) => {
  useEffect(() => {
    if (active) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.removeProperty('overflow');
    }
}, [active])

  return (
    <div
      className={
        "text-gray-900 dark:text-gray-100 " +
        (active ? "modal active" : "modal")
      }
      onClick={(e) => {
        setActive(false);
        e.stopPropagation();
      }}
    >
      <div
        className={
          "text-gray-900 dark:text-gray-100 sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle " +
          (active ? "modal_content active" : "modal_content")
        }
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <XCircleIcon
          stroke="currentColor"
          className="h-6 w-6 stroke-white grow close"
          onClick={(e) => setActive(false)}
        />
      </div>
    </div>
  );
};

export default Modal;
