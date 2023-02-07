import React, { useContext, useState, useEffect } from 'react';
import Modal from './Modal.jsx'

import { LocaleContext } from "../../i18n/LocaleContext";
import localeList from "../../i18n/messages";
import { isMobile } from "react-device-detect";
import { isFirefox } from "react-device-detect";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Stats } from '../../lib/localStorage';

import { ShareIcon } from '@heroicons/react/24/outline'
import Fade from './Fade';

type Props = {
    isStatsModalOpen: boolean;
    setIsStatsModalOpen: (value: boolean) => void;
    storedStats: Stats;
    practiceMode: boolean;
    win: boolean;
    c_name: string;
    g_length: number;
    handlerPractice: Function;
}

const StatisticModal = ({ isStatsModalOpen, setIsStatsModalOpen, storedStats, practiceMode, win, c_name, g_length, handlerPractice }: Props) => {

    const { locale } = useContext(LocaleContext);
    const today = new Date().toLocaleDateString("en-CA");

    const {
        gamesWon,
        lastWin,
        currentStreak,
        maxStreak,
        usedGuesses,
    } = storedStats;

    const sumGuesses = usedGuesses.reduce((a: number, b: number) => a + b, 0);
    const todaysGuesses = lastWin === today ? usedGuesses[usedGuesses.length - 1] : "--";
    const avgGuesses = Math.round((sumGuesses / usedGuesses.length) * 100) / 100;
    const showAvgGuesses = usedGuesses.length === 0 ? "--" : avgGuesses;

    const [showCopyMsg, setShowCopyMsg] = useState(false);
    const [msg, setMsg] = useState("");

    async function copyToClipboard() {
        const shareString = localeList[locale]["Clipboard"].replace('{X}', todaysGuesses+"");

        try {
            if ("canShare" in navigator && isMobile && !isFirefox) {
                await navigator.share({ title: "Plurality Stats", text: shareString });
                setMsg("Shared!");
                setShowCopyMsg(true);
                return setTimeout(() => setShowCopyMsg(false), 2000);
            } else if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(shareString);
                setMsg("Copied!");
                setShowCopyMsg(true);
                return setTimeout(() => setShowCopyMsg(false), 2000);
            } else {
                document.execCommand("copy", true, shareString);
                setMsg("Copied!");
                setShowCopyMsg(true);
                return setTimeout(() => setShowCopyMsg(false), 2000);
            }
        } catch (e) {
            setMsg("This browser cannot share");
            setShowCopyMsg(true);
            return setTimeout(() => setShowCopyMsg(false), 2000);
        }
    }

    return (
        <Modal active={isStatsModalOpen} setActive={setIsStatsModalOpen}>

            {win ?
            <div>
            <p className="text-center text-lg">{localeList[locale]["Victory"]}</p>
            <p className="text-center">{localeList[locale]["Game7"].replace('{answer}', c_name)}</p>
            <p className="text-center pb-6">{localeList[locale]["Guesses"] + " " + (!practiceMode ? todaysGuesses : g_length)}</p>
            </div> : ''}

            <h2 className='modal-text'>{localeList[locale]["StatsTitle"]}</h2>

            <div className='center'>

                <div className='stat-inline'>
                    <p className='text-base font-bold text-center text-white mt-4'>{lastWin === '1970-01-01' ? '--' : lastWin}</p>
                    <p className='text-xs text-center'>{localeList[locale]["Stats1"]}</p>
                    <br className="clearBoth"></br>
                </div>

                <div className='stat-inline'>
                    <p className='text-3xl font-bold text-center'>{todaysGuesses}</p>
                    <p className='text-xs text-center'>{localeList[locale]["Stats2"]}</p>
                    <br className="clearBoth"></br>
                </div>

                <div className='stat-inline'>
                    <p className='text-3xl font-bold text-center'>{gamesWon}</p>
                    <p className='text-xs text-center'>{localeList[locale]["Stats3"]}</p>
                    <br className="clearBoth"></br>
                </div>

                <div className='stat-inline'>
                    <p className='text-3xl font-bold text-center'>{currentStreak}</p>
                    <p className='text-xs text-center'>{localeList[locale]["Stats4"]}</p>
                    <br className="clearBoth"></br>
                </div>

                <div className='stat-inline'>
                    <p className='text-3xl font-bold text-center'>{maxStreak}</p>
                    <p className='text-xs text-center'>{localeList[locale]["Stats5"]}</p>
                    <br className="clearBoth"></br>
                </div>

                <div className='stat-inline'>
                    <p className='text-3xl font-bold text-center'>{showAvgGuesses}</p>
                    <p className='text-xs text-center'>{localeList[locale]["Stats6"]}</p>
                    <br className="clearBoth"></br>
                </div>

            </div>

            <div className='flex space-x-2 justify-center'>
            <button
                type="button"
                className="bg-indigo-600 mt-2 inline-flex w-32 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-2 text-center font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white sm:text-sm"
                onClick={copyToClipboard}>
                <ShareIcon className="mr h-6 w-6 dark:stroke-white grow transp" />
                {localeList[locale]["Stats9"]}
            </button>

            {(win && practiceMode) ?
            <button
                type="button"
                className="bg-indigo-600 mt-2 inline-flex w-32 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-2 text-center font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white sm:text-sm"
                onClick={()=>handlerPractice(true)}>
                {localeList[locale]["PlayAgain"]}
            </button> : ''}
            </div>
            <Fade
                show={showCopyMsg}
                background="border-4 border-sky-300 dark:border-slate-700
                            bg-sky-100 dark:bg-slate-900 drop-shadow-xl
                            absolute z-10 top-24 w-fit inset-x-0 mx-auto py-4 px-4 rounded-md space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-300">{msg}</p>
            </Fade>
        </Modal>
    );
}

export default StatisticModal;
