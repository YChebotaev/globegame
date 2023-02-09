import classnames from "classnames";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  value: string;
  width?: number;
  status?: string;
  onClick?: (value: string) => void;
  onMouseDown?(): void;
  onMouseUp?(): void;
  isRevealing?: boolean;
};

export const Key = ({
  children,
  status,
  width = 40,
  value,
  onClick,
  onMouseDown,
  onMouseUp,
  isRevealing,
}: Props) => {
  const keyDelayMs = 350 * 6;

  const classes = classnames(
    "xxshort:h-8 xxshort:w-8 xxshort:text-xxs xshort:w-10 xshort:h-10 flex short:h-12 h-14 items-center justify-center rounded mx-0.5 text-2xl font-bold cursor-pointer select-none dark:text-white",
    {
      "transition ease-in-out": isRevealing,
      "bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 active:bg-slate-400":
        !status,
      "bg-slate-400 dark:bg-slate-800 text-white": status === "absent",
      /*'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white':
        status === 'correct',
      'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white':
        status === 'present',*/
    },
  );

  const styles = {
    transitionDelay: isRevealing ? `${keyDelayMs}ms` : "unset",
    width: `${width}px`,
  };

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (typeof onClick === "function") {
      onClick(value);
    }
    event.currentTarget.blur();
  };

  return (
    <button
      style={styles}
      aria-label={`${value}${status ? " " + status : ""}`}
      className={classes}
      onClick={handleClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {children || value}
    </button>
  );
};
