import { useEffect, useRef } from "react";
import { BackspaceIcon } from "@heroicons/react/24/outline";
import SpaceIcon from "../icons/SpaceIcon";
import EnterIcon from "../icons/EnterIcon";
import keyboardList from '../../i18n/keyboards'

import { Key } from "./Key";

const DELETE_TEXT = <BackspaceIcon width={48} />; // 'Delete';
const ENTER_TEXT = <EnterIcon />; // 'Enter';
const SPACE_TEXT = <SpaceIcon />; // 'Space';

type Props = {
  locale: keyof typeof keyboardList
  onChar: (value: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  onSpace: () => void;
  isRevealing?: boolean;
};

export const Keyboard = ({
  locale,
  onChar,
  onDelete,
  onEnter,
  onSpace,
  isRevealing,
}: Props) => {
  const deleteIntervalRef = useRef<NodeJS.Timer>()
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
        onEnter();
      } else if (e.code === "Space") {
        onSpace();
      } else {
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
            window.removeEventListener("keyup", keyUpListener);
          }
        };

        window.addEventListener("keyup", keyUpListener, { passive: true });

        onDelete();
      }
    };

    window.addEventListener("keyup", keyUpListener, { passive: true });
    window.addEventListener("keydown", keyDownListener, { passive: true });

    return () => {
      window.removeEventListener("keyup", keyUpListener);
      window.removeEventListener("keydown", keyDownListener);
    };
  }, [onEnter, onDelete, onChar]);

  function onStartDelete() {
    const i = setInterval(() => onDelete(), 150)

    Reflect.set(deleteIntervalRef, 'current', i)

    onDelete()
  }

  function onEndDelete() {
    clearInterval(deleteIntervalRef.current)
  }

  return (
    <div>
      <div className="mb-1 flex justify-center">
        {keyboardList[locale][0].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={undefined}
            isRevealing={isRevealing}
          />
        ))}
      </div>
      <div className="mb-1 flex justify-center">
        {keyboardList[locale][1].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={undefined}
            isRevealing={isRevealing}
          />
        ))}
        <Key width={65.4} value="Space" onClick={onClick}>
          {SPACE_TEXT}
        </Key>
      </div>
      <div className="flex justify-center">
        <Key
          width={65.4}
          value="DELETE"
          // onClick={onClick}
          onMouseDown={onStartDelete}
          onMouseUp={onEndDelete}
        >
          {DELETE_TEXT}
        </Key>
        {keyboardList[locale][2].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={undefined}
            isRevealing={isRevealing}
          />
        ))}
        <Key width={65.4} value="ENTER" onClick={onClick}>
          {ENTER_TEXT}
        </Key>
      </div>
    </div>
  );
};
