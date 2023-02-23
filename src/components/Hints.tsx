import { useState, useEffect, RefObject } from "react";
import cn from "classnames";

type Props = {
  formRef: RefObject<HTMLFormElement>;
  hints: string[];
  currentSelected: number;
  onClickHint(value: string): void;
};

export default function Hints({
  formRef,
  hints,
  currentSelected,
  onClickHint,
}: Props) {
  const [styles, setStyles] = useState({});

  useEffect(() => {
    const formEl = formRef.current;

    if (formEl == null) return;

    const recalculateStyles = () => {
      const formRect = formEl.getBoundingClientRect();

      setStyles({
        bottom: `${window.innerHeight - formRect.bottom + formRect.height}px`,
        height: `${hints.length * 24}px`,
      });
    };
    const scrollListener = () => recalculateStyles();

    recalculateStyles();

    window.addEventListener("scroll", scrollListener, { passive: true });

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [formRef, hints]);

  return (
    <div className="fixed left-0 w-full" style={styles}>
      {hints.map((value, i) => (
        <div
          className={cn(
            "font-bold select-none text-center text-blue-300",
            i === currentSelected && "text-blue-400",
          )}
          key={i}
          onClick={() => onClickHint(value)}
        >
          {value}
        </div>
      ))}
    </div>
  );
}
