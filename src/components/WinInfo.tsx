import { useContext } from "react";
import { ShareIcon } from "@heroicons/react/24/outline";
import localeList from "../i18n/messages";
import { LocaleContext } from "../i18n/LocaleContext";
import { Stats } from "../lib/localStorage";
import useClipboard from "../hooks/useClipboard";

type Props = {
  countryName: string;
  storedStats: Stats;
  onPlayAgain(): void;
};

export default function WinInfo({
  countryName,
  storedStats,
  onPlayAgain,
}: Props) {
  const { locale } = useContext(LocaleContext);
  const { copyToClipboard, renderMsg } = useClipboard({ storedStats });

  return (
    <div className="flex align-center justify-center">
      <div>
        <div className="font-bold text-4xl text-blue-400 select-none text-center">
          {countryName}!
        </div>
        <div className="flex align-center justify-center gap-2">
          <button
            type="button"
            className="bg-indigo-600 mt-2 inline-flex w-32 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-2 text-center font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white sm:text-sm"
            onClick={copyToClipboard}
          >
            <ShareIcon className="mr h-6 w-6 dark:stroke-white grow transp" />
            {localeList[locale]["Stats9"]}
          </button>
          <button
            type="button"
            className="bg-indigo-600 mt-2 inline-flex w-32 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-2 text-center font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white sm:text-sm whitespace-nowrap"
            onClick={onPlayAgain}
          >
            {localeList[locale]["PlayAgain"]}
          </button>
        </div>
      </div>
      {renderMsg()}
    </div>
  );
}
