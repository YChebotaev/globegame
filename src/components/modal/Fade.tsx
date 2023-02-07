import { useEffect, useState } from "react";

type Props = {
  show: boolean;
  children: any;
  background?: string;
  extdiv?: string;
  // preexist?: boolean;
};

export default function Fade({
  show,
  children,
  background,
  extdiv,
}: // preexist = false,
Props) {
  const [appear, setAppear] = useState(false);
  const [exist, setExist] = useState(false);

  useEffect(() => {
    if (show) {
      setExist(true);
      setTimeout(() => setAppear(true), 150);
    }
    if (!show) {
      setAppear(false);
      setTimeout(() => setExist(false), 150);
    }
  }, [show]);

  return exist ? (
    <div className={extdiv}>
      <div
        style={{
          transition: "all 250ms linear",
          opacity: appear ? "1" : "0",
        }}
        className={background}>
        {children}
      </div>
    </div>
  ) : null;
}
