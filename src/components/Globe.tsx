import ReactGlobe, { GlobeMethods } from "react-globe.gl";
import {
  useEffect,
  useContext,
  useRef,
  MutableRefObject,
  RefObject,
} from "react";
import { langNameMap } from "../i18n/langNameMap";
import { LocaleContext } from "../i18n/LocaleContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Guesses, Stats } from "../lib/localStorage";
import List from "./List";
import StatisticModal from "./modal/StatisticModal";
import { useMediaQuery } from "react-responsive";
import ZoomControl from "./ZoomControl";
import NextDailyIn from "./NextDailyIn";
import WinInfo from "./WinInfo";

type Props = {
  isDarkMode: boolean;
  isBlindMode: boolean;
  graphicData: [];
  countries: { features: any[] };
  angle: { lat: 60; lng: 60; altitude: 2.5 };
  guesses: string[];
  globeRef: MutableRefObject<GlobeMethods>;
  practiceMode: boolean;
  win: boolean;
  handlePractice: Function;
  r_country: number;
  storedStats: Stats;
  storeStats: Function;
  setIsStatsModalOpen: Function;
  setMsg: Function;
  openWin: boolean;
  setOpenWin(value: boolean): void;
  onPlayAgain: Function;
  onStatisticClose: Function;
  showWinInfo: boolean;
};

export default function Globe({
  isDarkMode,
  isBlindMode,
  graphicData,
  countries,
  angle,
  guesses,
  globeRef,
  practiceMode,
  win,
  handlePractice,
  r_country,
  storedStats,
  storeStats,
  setIsStatsModalOpen,
  setMsg,
  openWin,
  setOpenWin,
  onPlayAgain,
  onStatisticClose,
  showWinInfo,
}: Props) {
  const { locale } = useContext(LocaleContext);
  const today = new Date().toLocaleDateString("en-CA");

  const [storedGuesses, storeGuesses] = useLocalStorage<Guesses>("guesses", {
    countries: [],
  });

  const [storedPrGuesses, storePrGuesses] = useLocalStorage<Guesses>(
    "pr_guesses",
    {
      countries: [],
    },
  );

  useEffect(() => {
    if (guesses.length > 0) {
      globeRef.current.pointOfView(angle, 250);
    }
    if (!practiceMode) {
      storeGuesses({ countries: guesses });
    } else {
      storePrGuesses({ countries: guesses });
    }
  }, [angle, guesses, globeRef]);

  useEffect(() => {
    const controls: any = globeRef.current.controls();

    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;

    const t = setTimeout(() => {
      globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 });
    }, 400);

    return () => {
      clearTimeout(t);
    };
  }, [globeRef]);

  const containerRef = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    const controls: any = globeRef.current.controls();
    const containerEl = containerRef.current;

    const listener = () => {
      controls.autoRotate = false;
    };

    containerEl.addEventListener("mouseup", listener, { passive: true });
    containerEl.addEventListener("touchend", listener, { passive: true });

    return () => {
      containerEl.removeEventListener("mouseup", listener);
      containerEl.removeEventListener("touchend", listener);
    };
  }, [globeRef]);

  useEffect(() => {
    if (win && storedStats.lastWin !== today && !practiceMode) {
      const lastWin = today;
      const gamesWon = storedStats.gamesWon + 1;
      const streakBroken = dateDiffInDays(storedStats.lastWin, lastWin) > 1;
      const currentStreak = streakBroken ? 1 : storedStats.currentStreak + 1;
      const maxStreak =
        currentStreak > storedStats.maxStreak
          ? currentStreak
          : storedStats.maxStreak;
      const usedGuesses = [...storedStats.usedGuesses, guesses.length];
      const chunks = [];
      for (let i = 0; i < guesses.length; i += 8) {
        chunks.push(guesses.slice(i, i + 8));
      }
      const newStats = {
        lastWin,
        gamesWon,
        currentStreak,
        maxStreak,
        usedGuesses,
      };

      storeStats(newStats);

      setTimeout(() => setOpenWin(true), 1500);
    }
  }, [win, guesses, storeStats, storedStats, practiceMode]);

  function polygonColor(obj: any) {
    var dist = graphicData[obj.properties.ADMIN];

    if ((!dist || isNaN(dist)) && dist !== 0) {
      return dist;
    }

    var color = "rgba(255, 255, 255, 1)";
    if (isBlindMode) {
      return gradColor(
        { red: 0, green: 0, blue: 0 },
        { red: 255, green: 255, blue: 255 },
        Math.min(dist / 5800, 1),
      );
    }

    if (dist < 10) {
      return "rgba(170, 0, 0, 1)";
    }
    if (dist < 500) {
      color = gradColor(
        { red: 190, green: 10, blue: 10 },
        { red: 255, green: 128, blue: 0 },
        Math.min(dist / 500, 1),
      );
    } else {
      color = gradColor(
        { red: 255, green: 128, blue: 0 },
        { red: 255, green: 255, blue: 255 },
        Math.min((dist - 500) / 6000, 1),
      );
    }
    return color;
  }

  function gradColor(color1: any, color2: any, pr: number) {
    var diffRed = color2.red - color1.red;
    var diffGreen = color2.green - color1.green;
    var diffBlue = color2.blue - color1.blue;

    var gradient = {
      red: Math.floor(color1.red + diffRed * pr),
      green: Math.floor(color1.green + diffGreen * pr),
      blue: Math.floor(color1.blue + diffBlue * pr),
    };

    return (
      "rgba(" +
      gradient.red +
      "," +
      gradient.green +
      "," +
      gradient.blue +
      ", 1)"
    );
  }

  function polygonLabel(obj: any) {
    var d = obj.properties;
    return `<b>${d.ADMIN}</b>`;
  }

  function dateDiffInDays(day1: string, day2: string) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const a = new Date(day1);
    const b = new Date(day2);
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    const diff = Math.floor((utc2 - utc1) / MS_PER_DAY);
    return diff;
  }

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const size = isMobile ? 320 : 420;
  // const marTop = isMobile ? "14vh" : "0px";

  const extraStyle = {
    width: `${size}px`,
    clipPath: `circle(${size / 2}px at ${size / 2}px ${size / 2}px)`,
  };

  const showStats =
    countries.features[r_country] &&
    ((win && practiceMode) || (!practiceMode && storedStats.lastWin === today));

  return (
    <div
      className="m-auto grow-1"
      style={{
        width: `${size}px`,
        height: `${size + (showWinInfo ? 110 : 0)}px`,
      }}
    >
      {showStats && (
        <StatisticModal
          isStatsModalOpen={openWin}
          setIsStatsModalOpen={setOpenWin}
          storedStats={storedStats}
          win={true}
          practiceMode={practiceMode}
          c_name={countries.features[r_country].properties.ADMIN}
          g_length={guesses.length}
          handlerPractice={handlePractice}
          onClose={onStatisticClose}
          createCountryInfoLink={() => {
            const countryProps = countries.features[r_country].properties;
            const localeCountryName = countryProps[langNameMap[locale]];

            if (locale === "en-CA") {
              return `${localeCountryName}`.toLowerCase();
            } else {
              return `${locale.slice(0, 2)}/${localeCountryName}`.toLowerCase();
            }
          }}
        />
      )}

      <div
        className="gues"
        style={{ width: `${size}px` /*, marginTop: marTop */ }}
      >
        <div
          ref={containerRef}
          onClick={() => setMsg("")}
          style={extraStyle}
          className="mx-auto clip"
        >
          <ReactGlobe
            ref={globeRef}
            width={size}
            height={size}
            globeImageUrl={isDarkMode ? "earth-night.webp" : "earth-day.jpg"}
            atmosphereColor={isDarkMode ? "lightskyblue" : "rgba(63, 201, 255)"}
            backgroundColor="#00000000"
            polygonsData={countries.features.filter((d) =>
              guesses.includes(d.properties.ADMIN),
            )}
            polygonCapColor={polygonColor}
            polygonLabel={polygonLabel}
          />
        </div>

        {isMobile && <ZoomControl globeRef={globeRef} />}
        {showWinInfo && (
          <div style={{ margin: "10px auto" }}>
            <WinInfo
              countryName={countries.features[r_country].properties.ADMIN}
              storedStats={storedStats}
              onPlayAgain={onPlayAgain as () => void}
            />
          </div>
        )}
        {win && !openWin && !practiceMode && <NextDailyIn />}
      </div>
      <List
        guesses={guesses}
        graphicData={graphicData}
        r_country={r_country}
        countries={countries}
        globeRef={globeRef}
      />
    </div>
  );
}
