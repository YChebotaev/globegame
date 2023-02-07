import { useState, useEffect, RefObject } from "react";

type Props = {
  formRef: RefObject<HTMLFormElement>;
  hints: string[];
  onClickHint(value: string): void;
};

export default function Hints({ formRef, hints, onClickHint }: Props) {
  const [styles, setStyles] = useState({});

  useEffect(() => {
    const formEl = formRef.current;

    if (formEl == null) return;

    const formRect = formEl.getBoundingClientRect();

    setStyles({
      bottom: `${window.innerHeight - formRect.bottom + formRect.height}px`,
      height: `${hints.length * 40}px`,
    });
  }, [formRef, hints]);

  if (hints.length === 0) return null

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        width: "100%",
        maxHeight: (40 * 3) + 'px',
        overflow: 'hidden',
        overflowY: 'scroll',
        ...styles,
      }}
    >
      {hints.map((value, i) => (
        <div
          className="font-bold text-4xl text-blue-300 select-none text-center"
          key={i}
          onClick={() => onClickHint(value)}
        >
          {value}
        </div>
      ))}
    </div>
  );
}
