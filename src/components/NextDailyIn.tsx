import { useContext, useState, useEffect } from "react";
import { LocaleContext } from "../i18n/LocaleContext";
import localeList from "../i18n/messages";
import { endOfToday, differenceInSeconds } from "date-fns";

export default function NextDailyIn() {
  const { locale } = useContext(LocaleContext);
  const [time, setTime] = useState("00:00");

  useEffect(() => {
    let t: NodeJS.Timeout;
    const update = () => {
      const now = new Date();
      const diffInSecs = differenceInSeconds(endOfToday(), now);
      const h = Math.floor(diffInSecs / 3600);
      const m = Math.floor((diffInSecs % 3600) / 60);
      const s = (diffInSecs % 3600) % 60;
      const hStr = String(h).padStart(2, "0");
      const mStr = String(m).padStart(2, "0");
      const sStr = String(s).padStart(2, "0");

      setTime(`${hStr}:${mStr}:${sStr}`);

      t = setTimeout(update, 1000);
    };

    update();

    return () => {
      clearTimeout(t);
    };
  }, []);

  return (
    <div
      className="absolute bg-sky-100 dark:bg-slate-900 drop-shadow-xl w-fit inset-x-0 py-2 px-2 rounded-lg space-y-2 mx-auto select-none"
      style={{ top: 150, width: 250, borderRadius: 30 }}
    >
      <p className="text-sm font-bold text-center text-gray-500 dark:text-gray-300">
        {localeList[locale]["NextDailyIn"]}
      </p>
      <p className="text-2xl font-bold text-center text-gray-500 dark:text-gray-300">
        {time}
      </p>
    </div>
  );
}
