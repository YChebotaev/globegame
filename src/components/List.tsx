import React, {
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { GlobeMethods } from "react-globe.gl";
import { FormattedMessage } from "react-intl";
import { LocaleContext } from "../i18n/LocaleContext";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
//import { isMobile } from 'react-device-detect';
import { useMediaQuery } from "react-responsive";
import localeList from "../i18n/messages";
import { langNameMap } from "../i18n/langNameMap";
import { CircleFlag } from "react-circle-flags";

type Props = {
  guesses: string[];
  graphicData: any;
  r_country: number;
  countries: { features: any[] };
  globeRef: React.MutableRefObject<GlobeMethods>;
};

function reorderGuesses(
  guesses: string[],
  graphicData: any,
  r_country: number,
  countries: { features: any[] },
) {
  return [...guesses].sort((a, b) => {
    const answerName = countries.features[r_country].ADMIN;

    if (isNaN(graphicData[a]) || isNaN(graphicData[b])) {
      return -1;
    }

    if (a === answerName) {
      return -1;
    } else if (b === answerName) {
      return 1;
    } else {
      return graphicData[a] - graphicData[b];
    }
  });
}

export default function List({
  guesses,
  graphicData,
  r_country,
  countries,
  globeRef,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [orderedGuesses, setOrderedGuesses] = useState(
    reorderGuesses(guesses, graphicData, r_country, countries),
  );

  const [showList, setShowList] = useState(false);
  const { locale } = useContext(LocaleContext);
  const langName = langNameMap[locale];

  useEffect(() => {
    setOrderedGuesses(
      reorderGuesses(guesses, graphicData, r_country, countries),
    );
  }, [guesses, graphicData, r_country]);

  useEffect(() => {
    const clickListener = (e: MouseEvent) => {
      const listEl = ref.current;

      if (listEl == null) return;
      if (showList === false) return;

      if (!listEl.contains(e.target as HTMLElement)) {
        setShowList(false);
      }
    };

    setTimeout(() => {
      document.addEventListener("click", clickListener, { passive: true });
    }, 0);

    return () => {
      document.removeEventListener("click", clickListener);
    };
  }, [showList]);

  function formatKm(m: number, miles: boolean) {
    const METERS_PER_MILE = 1.60934;
    const BIN = 10;
    const value = miles ? m / METERS_PER_MILE : m;
    if (value < BIN) return " < " + BIN;

    const rounded = Math.round(value / BIN) * BIN;
    // const max = min + BIN;
    const format = (num: number) =>
      num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return ` ${format(rounded)}`;
  }

  function getFromName(name: string) {
    for (var i = 0; i < countries.features.length; i++) {
      const { NAME, NAME_LONG, ABBREV, ADMIN, BRK_NAME, NAME_SORT, ISO_A3 } =
        countries.features[i].properties;

      if (
        ADMIN?.toLowerCase() === name ||
        ISO_A3?.toLowerCase() === name ||
        NAME?.toLowerCase() === name ||
        NAME_LONG?.toLowerCase() === name ||
        BRK_NAME?.toLowerCase() === name ||
        ABBREV?.toLowerCase() === name ||
        NAME_SORT?.toLowerCase() === name ||
        ABBREV.replace(/\./g, "")?.toLowerCase() === name ||
        NAME.replace(/-/g, " ")?.toLowerCase() === name
      ) {
        return i;
      }
    }
    return -1;
  }

  function turnToCountry(e: SyntheticEvent, idx: string) {
    console.log(idx);
    e.stopPropagation();
    var c_id = getFromName(idx.toLocaleLowerCase());
    var angle = {
      lng:
        (countries.features[c_id].bbox[0] + countries.features[c_id].bbox[2]) /
        2,
      lat:
        (countries.features[c_id].bbox[1] + countries.features[c_id].bbox[3]) /
        2,
    };
    if (countries.features[c_id].properties.ADMIN === "Russia") {
      angle = { lng: 97, lat: 64 };
    }
    globeRef.current.pointOfView(angle, 300);
  }

  const closest = orderedGuesses[0];
  const farthest = orderedGuesses[orderedGuesses.length - 1];

  const [isSortedByDistance, setIsSortedByDistance] = useState(true);
  const guessesToDisplay = isSortedByDistance ? orderedGuesses : guesses;

  //const isMobile2 = isMobile && useMediaQuery({ query: `(max-width: 760px)` });
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  if (!showList) {
    return (
      <div
        onClick={(e) => setShowList(!showList)}
        className={
          "word-list flex" +
          (isMobile
            ? " top-12 p-2 right-1 left-1"
            : " top-0.5 w-6/12 left-1/2 -translate-x-1/2")
        }
        style={!isMobile ? { maxWidth: "430px" } : {}}
      >
        {guessesToDisplay.length === 0 ? (
          <p className="mx-auto dark:text-white">
            {localeList[locale]["GuessesFlags"]}
          </p>
        ) : (
          <div className="relative inline-block bottom-2 w-full pr-6">
            <ul className="grid hide-list mt-0.5 justify-between">
              {guessesToDisplay.slice(0, 12).map((guess, idx) => {
                var c_id = getFromName(guess.toLocaleLowerCase());
                const { NAME_LEN, ABBREV, NAME, FLAG } =
                  countries.features[c_id].properties;

                var flag = (FLAG || "").toLocaleLowerCase();

                let name = NAME_LEN >= 10 ? ABBREV : NAME;
                if (locale !== "en-CA") {
                  name = countries.features[c_id].properties[langName];
                }

                return (
                  <li className="flex items-center mb-4 mx-1" key={idx}>
                    <button
                      onClick={(e) => turnToCountry(e, guess)}
                      className="flex cursor-pointer"
                    >
                      <CircleFlag
                        cdnUrl="/flags/"
                        countryCode={flag.toLowerCase()}
                        height={20}
                        className="w-6 py-1"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <ChevronDownIcon
          stroke="currentColor"
          className="h-6 w-6 stroke-white absolute top-2 right-2"
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={
        "word-list z-10 expand-list select-none cursor-pointer" +
        (isMobile
          ? " top-12 p-2 right-1 left-1"
          : " top-0.5 w-3/12 left-1/2 -translate-x-1/2")
      }
      style={!isMobile ? { width: "440px" } : {}}
    >
      {orderedGuesses.length > 0 && (
        <p className="text-center text-gray-300">
          <span className="text-base">
            <FormattedMessage id="SortBy" />{" "}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSortedByDistance(false);
            }}
            className="mt-2 transp"
          >
            <span
              className={
                "text-base pointer " + (!isSortedByDistance ? "underline" : "")
              }
            >
              <FormattedMessage id="SortByGuesses" />
            </span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSortedByDistance(true);
            }}
            className="mt-2 ml-2 transp"
          >
            <span
              className={
                "text-base pointer " + (isSortedByDistance ? "underline" : "")
              }
            >
              <FormattedMessage id="SortByDistance" />
            </span>
          </button>
        </p>
      )}
      <ul className="grid auto-cols-auto justify-between mt-6">
        {guessesToDisplay.map((guess, idx) => {
          //countries.features.map((guess, idx) => {
          var c_id = getFromName(guess.toLocaleLowerCase());
          //var c_id = idx;
          const { NAME_LEN, ABBREV, NAME, FLAG } =
            countries.features[c_id].properties;

          var flag = (FLAG || "").toLocaleLowerCase();

          let name = NAME_LEN >= 10 ? ABBREV : NAME;
          if (locale !== "en-CA") {
            name = countries.features[c_id].properties[langName];
          }

          return (
            <li className="my-1" key={idx}>
              <button
                onClick={(e) => turnToCountry(e, guess)}
                className="flex cursor-pointer transp"
              >
                <CircleFlag
                  cdnUrl="/flags/"
                  countryCode={flag.toLowerCase()}
                  height={20}
                  className="w-6"
                />
                <span className="ml-2 text-md text-left">{name}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {closest && farthest && !isNaN(graphicData[closest]) && (
        <div className="mt-6">
          <div className="flex items-center space-x-1">
            <p className="text-base text-gray-300 mx-auto mt-auto mb-2">
              <FormattedMessage id="Game8" />:
              {formatKm(graphicData[closest], true)} miles /
              {formatKm(graphicData[closest], false)} km
            </p>
          </div>
        </div>
      )}

      <ChevronUpIcon
        onClick={(e) => setShowList(!showList)}
        stroke="currentColor"
        className="h-6 w-6 stroke-white close"
      />
    </div>
  );
}
