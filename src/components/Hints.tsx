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

    const formRect = formEl.getBoundingClientRect();

    setStyles({
      bottom: `${window.innerHeight - formRect.bottom + formRect.height}px`,
      height: `${hints.length * 24}px`,
    });
  }, [formRef, hints]);

  useEffect(() => {
    if (hints.length === 0) {
      document.body.style.removeProperty("overflow");
    } else {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [hints]);

  if (hints.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        width: "100%",
        maxHeight: 24 * 3 + "px",
        overflow: "hidden",
        overflowY: "scroll",
        ...styles,
      }}
    >
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
