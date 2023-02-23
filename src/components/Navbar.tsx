import { useContext } from "react";

import Dropdown from "react-dropdown";
import { LocaleContext } from "../i18n/LocaleContext";
import localeList from "../i18n/messages";
import { useMediaQuery } from "react-responsive";

import {
  ChartBarIcon,
  CogIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";

type Props = {
  setIsInfoModalOpen: (value: boolean) => void;
  setIsStatsModalOpen: (value: boolean) => void;
  setIsSettingsModalOpen: (value: boolean) => void;
  practiceHandler: (value: boolean) => void;
  isPractice: boolean;
};

export const Navbar = ({
  setIsInfoModalOpen,
  setIsStatsModalOpen,
  setIsSettingsModalOpen,
  practiceHandler,
  isPractice,
}: Props) => {
  const isMobile2 = useMediaQuery({ query: `(max-width: 760px)` });
  const { locale } = useContext(LocaleContext);

  return (
    <div
      className={isMobile2 ? "navbar" : "mx-auto w-11/12"}
      style={!isMobile2 ? { maxWidth: 660 } : {}}
    >
      <div className="navbar-center">
        <div className="left-icons ml-1 mt-1">
          <Dropdown
            className="text-xs"
            controlClassName="h-6 bg-white flex"
            placeholderClassName="font-bold ml-2 mr-7 my-auto"
            menuClassName="bg-white text-sm mt-1.5 w-max"
            arrowClassName="top-1.5 right-1"
            options={[
              {
                value: "false",
                label: localeList[locale]["Daily"],
              },
              {
                value: "true",
                label: localeList[locale]["Settings9"],
              },
            ]}
            onChange={(e) => {
              let prv = e.value === "true" ? true : false;
              if (prv !== isPractice) {
                practiceHandler(prv);
              }
            }}
            value={
              isPractice
                ? localeList[locale]["Settings9"]
                : localeList[locale]["Daily"]
            }
            placeholder="Select an option"
          />
        </div>

        <div className="content_center absolute w-full -z-10">
          {isMobile2 ? (
            <p className="text-center dark:text-white text-xl font-bold">
              Globle
            </p>
          ) : (
            ""
          )}
        </div>

        <div className="right-icons flex mr-1">
          <InformationCircleIcon
            stroke="currentColor"
            className="mx-2 h-6 w-6 stroke-white grow"
            viewBox="0 0 24 24"
            strokeWidth="2"
            onClick={() => setIsInfoModalOpen(true)}
          />
          <ChartBarIcon
            stroke="currentColor"
            className="mr h-6 w-6 stroke-white grow"
            viewBox="0 0 24 24"
            strokeWidth="2"
            onClick={() => setIsStatsModalOpen(true)}
          />
          <CogIcon
            stroke="currentColor"
            className="h-6 w-6 stroke-white grow"
            viewBox="0 0 24 24"
            strokeWidth="2"
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </div>
    </div>
  );
};
