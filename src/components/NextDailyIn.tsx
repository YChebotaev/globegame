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
      setTime(`${h}:${m}:${s}`);

      t = setTimeout(update, 1000);
    };

    t = setTimeout(update, 1000);

    return () => {
      clearTimeout(t);
    };
  }, []);

  return (
    <div className="border-4 border-sky-300 dark:border-slate-700 bg-sky-100 dark:bg-slate-900 drop-shadow-xl w-fit inset-x-0 py-4 px-4 rounded-md space-y-2 mx-auto">
      <p className="text-sm text-center text-gray-500 dark:text-gray-300">
        {localeList[locale]["NextDailyIn"].replace("{time}", time)}
      </p>
    </div>
  );
}
