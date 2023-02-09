import { useState, useContext } from "react";
import { isMobile, isFirefox } from "react-device-detect";
import localeList from "../i18n/messages";
import { LocaleContext } from "../i18n/LocaleContext";
import Fade from "../components/modal/Fade";
import { Stats } from "../lib/localStorage";

export default function useClipboard({ storedStats }: { storedStats: Stats }) {
  const today = new Date().toLocaleDateString("en-CA");
  const { locale } = useContext(LocaleContext);
  const [showCopyMsg, setShowCopyMsg] = useState(false);
  const [msg, setMsg] = useState("");
  const { lastWin, usedGuesses } = storedStats;
  const todaysGuesses =
    lastWin === today ? usedGuesses[usedGuesses.length - 1] : "--";

  async function copyToClipboard() {
    const shareString = localeList[locale]["Clipboard"].replace(
      "{X}",
      todaysGuesses + "",
    );

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

  return {
    showCopyMsg,
    msg,
    copyToClipboard,
    renderMsg() {
      return (
        <Fade
          show={showCopyMsg}
          background="border-4 border-sky-300 dark:border-slate-700
                            bg-sky-100 dark:bg-slate-900 drop-shadow-xl
                            absolute z-10 top-24 w-fit inset-x-0 mx-auto py-4 px-4 rounded-md space-y-2"
        >
          <p className="text-sm text-gray-500 dark:text-gray-300">{msg}</p>
        </Fade>
      );
    },
  };
}
