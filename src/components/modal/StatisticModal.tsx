import React, { useContext } from "react";
import Modal from "./Modal.jsx";

import { LocaleContext } from "../../i18n/LocaleContext";
import localeList from "../../i18n/messages";
import { Stats } from "../../lib/localStorage";
import useClipboard from "../../hooks/useClipboard";

import { ShareIcon } from "@heroicons/react/24/outline";

type Props = {
  isStatsModalOpen: boolean;
  setIsStatsModalOpen: (value: boolean) => void;
  storedStats: Stats;
  practiceMode: boolean;
  win: boolean;
  c_name: string;
  g_length: number;
  handlerPractice: Function;
  onClose?: Function;
  createCountryInfoLink?(): string;
};

const StatisticModal = ({
  isStatsModalOpen,
  setIsStatsModalOpen,
  storedStats,
  practiceMode,
  win,
  c_name,
  g_length,
  handlerPractice,
  onClose,
  createCountryInfoLink: propsCreateCountryInfoLink,
}: Props) => {
  const { locale } = useContext(LocaleContext);
  const today = new Date().toLocaleDateString("en-CA");

  const { gamesWon, lastWin, currentStreak, maxStreak, usedGuesses } =
    storedStats;

  const sumGuesses = usedGuesses.reduce((a: number, b: number) => a + b, 0);
  const todaysGuesses =
    lastWin === today ? usedGuesses[usedGuesses.length - 1] : "--";
  const avgGuesses = Math.round((sumGuesses / usedGuesses.length) * 100) / 100;
  const showAvgGuesses = usedGuesses.length === 0 ? "--" : avgGuesses;

  const { copyToClipboard, renderMsg } = useClipboard({ storedStats });

  function handleClose(value: boolean) {
    setIsStatsModalOpen(value);

    if (typeof onClose === "function") {
      onClose();
    }
  }

  function createCountryInfoLink() {
    if (typeof propsCreateCountryInfoLink === "function") {
      return propsCreateCountryInfoLink();
    } else {
      return "#";
    }
  }

  return (
    <Modal active={isStatsModalOpen} setActive={handleClose}>
      {win && (
        <div className="mb-5">
          <p className="text-center text-xl font-bold">
            {localeList[locale]["Victory"]}
          </p>
          <p className="text-center">
            {localeList[locale]["Game7"].replace("{answer}", c_name)}
          </p>
          <p className="text-center pb-6">
            {localeList[locale]["Guesses"] +
              " " +
              (!practiceMode ? todaysGuesses : g_length)}
          </p>
          <p className="text-center underline">
            <a href={createCountryInfoLink()}>{localeList[locale]["Learn"]}</a>
          </p>
        </div>
      )}

      <h2 className="modal-text">{localeList[locale]["StatsTitle"]}</h2>

      <div className="center">
        <div className="stat-inline">
          <p className="text-base font-bold text-center text-white mt-4">
            {lastWin === "1970-01-01" ? "--" : lastWin}
          </p>
          <p className="text-xs text-center">{localeList[locale]["Stats1"]}</p>
          <br className="clearBoth"></br>
        </div>

        <div className="stat-inline">
          <p className="text-3xl font-bold text-center">{todaysGuesses}</p>
          <p className="text-xs text-center">{localeList[locale]["Stats2"]}</p>
          <br className="clearBoth"></br>
        </div>

        <div className="stat-inline">
          <p className="text-3xl font-bold text-center">{gamesWon}</p>
          <p className="text-xs text-center">{localeList[locale]["Stats3"]}</p>
          <br className="clearBoth"></br>
        </div>

        <div className="stat-inline">
          <p className="text-3xl font-bold text-center">{currentStreak}</p>
          <p className="text-xs text-center">{localeList[locale]["Stats4"]}</p>
          <br className="clearBoth"></br>
        </div>

        <div className="stat-inline">
          <p className="text-3xl font-bold text-center">{maxStreak}</p>
          <p className="text-xs text-center">{localeList[locale]["Stats5"]}</p>
          <br className="clearBoth"></br>
        </div>

        <div className="stat-inline">
          <p className="text-3xl font-bold text-center">{showAvgGuesses}</p>
          <p className="text-xs text-center">{localeList[locale]["Stats6"]}</p>
          <br className="clearBoth"></br>
        </div>
      </div>

      <div className="flex space-x-2 justify-center">
        <button
          type="button"
          className="bg-indigo-600 mt-2 inline-flex w-32 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-2 text-center font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white sm:text-sm"
          onClick={copyToClipboard}
        >
          <div>
            <ShareIcon
              className="mr h-5 w-5 dark:stroke-white grow transp"
              width="24px"
              height="24px"
            />
          </div>
          {localeList[locale]["Stats9"]}
        </button>

        {win ? (
          <button
            type="button"
            className="bg-indigo-600 mt-2 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-2 text-center font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white sm:text-sm whitespace-nowrap"
            onClick={() => handlerPractice(true)}
          >
            {localeList[locale]["PlayAgain"]}
          </button>
        ) : (
          ""
        )}
      </div>
      {renderMsg()}
    </Modal>
  );
};

export default StatisticModal;
