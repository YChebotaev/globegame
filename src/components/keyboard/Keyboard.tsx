import { useEffect, useRef } from "react";
import { BackspaceIcon } from "@heroicons/react/24/outline";
import SpaceIcon from "../icons/SpaceIcon";
import EnterIcon from "../icons/EnterIcon";
import keyboardList from "../../i18n/keyboards";

import { Key } from "./Key";
import { Locale } from "../../lib/locale";

const DELETE_TEXT = <BackspaceIcon width={48} />;
const ENTER_TEXT = <EnterIcon />;
const SPACE_TEXT = <SpaceIcon />;

type Props = {
  locale: Locale;
  onChar: (value: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  onSpace: () => void;
  isRevealing?: boolean;
  disabled: boolean
};

export const Keyboard = ({
  locale,
  onChar,
  onDelete,
  onEnter,
  onSpace,
  isRevealing,
  disabled
}: Props) => {
  const deleteIntervalRef = useRef<NodeJS.Timer>();
  const onClick = (value: string) => {
    if (value === "ENTER") {
      onEnter();
    } else if (value === "DELETE") {
      onDelete();
    } else if (value === "Space") {
      onSpace();
    } else {
      onChar(value);
    }
  };

  useEffect(() => {
    const keyUpListener = (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        e.preventDefault();

        onEnter();
      } else if (e.code === "Space") {
        e.preventDefault();

        onSpace();
      } else {
        e.preventDefault();

        const key = e.key.toUpperCase();
        // TODO: check this test if the range works with non-english letters
        if (key.length === 1 && key >= "A" && key <= "Z") {
          onChar(key);
        }
      }
    };

    const keyDownListener = (e: KeyboardEvent) => {
      if (e.code === "Backspace") {
        const i = setInterval(() => onDelete(), 300);
        const keyUpListener = (e: KeyboardEvent) => {
          if (e.code === "Backspace") {
            clearInterval(i);

            window.removeEventListener("blur", blurListener);
            window.removeEventListener("keyup", keyUpListener);
          }
        };
        const blurListener = () => {
          clearInterval(i);
          window.removeEventListener("blur", blurListener);
          window.removeEventListener("keyup", keyUpListener);
        };

        window.addEventListener("keyup", keyUpListener);
        window.addEventListener("blur", blurListener, { passive: true });

        onDelete();
      }
    };

    window.addEventListener("keyup", keyUpListener);
    window.addEventListener("keydown", keyDownListener, { passive: true });

    return () => {
      window.removeEventListener("keyup", keyUpListener);
      window.removeEventListener("keydown", keyDownListener);
    };
  }, [onEnter, onDelete, onChar, onSpace]);

  function onStartDelete() {
    console.log("onStartDelete()");

    const i = setInterval(() => onDelete(), 150);

    Reflect.set(deleteIntervalRef, "current", i);

    onDelete();
  }

  function onEndDelete() {
    console.log("onEndDelete()");

    clearInterval(deleteIntervalRef.current);
  }

  return (
    <div className="select-none">
      <div className="mb-1 flex justify-center">
        {keyboardList[locale][0].map((key) => (
          <Key
            locale={locale}
            value={key}
            key={key}
            onClick={onClick}
            status={undefined}
            isRevealing={isRevealing}
            disabled={disabled}
          />
        ))}
      </div>
      <div className="mb-1 flex justify-center">
        {keyboardList[locale][1].map((key) => (
          <Key
            locale={locale}
            value={key}
            key={key}
            onClick={onClick}
            status={undefined}
            isRevealing={isRevealing}
            disabled={disabled}
          />
        ))}
        <Key
          locale={locale}
          width={65.4}
          value="Space"
          style={{ padding: 10 }}
          disabled={disabled}
          onClick={onClick}
        >
          {SPACE_TEXT}
        </Key>
      </div>
      <div className="mb-1 flex justify-center">
        <Key
          locale={locale}
          width={65.4}
          value="DELETE"
          style={{ padding: 10 }}
          disabled={disabled}
          onTouchStart={onStartDelete}
          onTouchEnd={onEndDelete}
          onMouseDown={onStartDelete}
          onMouseUp={onEndDelete}
        >
          {DELETE_TEXT}
        </Key>
        {keyboardList[locale][2].map((key) => (
          <Key
            locale={locale}
            value={key}
            key={key}
            onClick={onClick}
            status={undefined}
            disabled={disabled}
            isRevealing={isRevealing}
          />
        ))}
        <Key
          locale={locale}
          width={65.4}
          value="ENTER"
          style={{ padding: 10 }}
          disabled={disabled}
          onClick={onClick}
        >
          {ENTER_TEXT}
        </Key>
      </div>
      {keyboardList[locale][3] ? (
        <div className="flex justify-center">
          {keyboardList[locale][3].map((key) => (
            <Key
              locale={locale}
              value={key}
              key={key}
              onClick={onClick}
              status={undefined}
              disabled={disabled}
              isRevealing={isRevealing}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
