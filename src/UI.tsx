
import React, { useEffect, useRef, useState } from 'react';
import { GlobeMethods } from 'react-globe.gl';
import Globe from './components/Globe'
import { Navbar } from './components/Navbar';
import InputField from './components/InputField'
import SettingsModal from './components/modal/SettingsModal';
import InfoModal from './components/modal/InfoModal';
import StatisticModal from './components/modal/StatisticModal';
import { Guesses } from "./lib/localStorage";
import { useLocalStorage } from "./hooks/useLocalStorage"
import { Stats } from './lib/localStorage'
import { t_id } from './lib/answer'

type Props = {
  graphicData: [],
  angle: { lat: 60, lng: 60, altitude: 2.5 };
  getCountries: (value: { features: never[] }) => void;
  places: string[];
  addPlace: (value: string) => string;
  setPlaces: (value: string[]) => string;
  win: boolean;
  setWin: Function;
  setRandCountry: Function;
  rand_country: number;
};

const UI = ({
  graphicData,
  angle,
  getCountries,
  places,
  addPlace,
  setPlaces,
  win,
  setWin,
  setRandCountry,
  rand_country,
}: Props) => {

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [msg, setMsg] = useState("Game3")

  useEffect(() => {
    console.log(msg);
  }, [msg]);

  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') !== 'dark'
      : prefersDarkMode
        ? true
        : false
  )

  const [isBlindMode, setIsBlindMode] = useState(
    localStorage.getItem('isBlind')
      ? localStorage.getItem('isBlind') === 'true' ? true : false : false)

  const [isPractice, setisPractice] = useState(
    localStorage.getItem('isPractice')
      ? localStorage.getItem('isPractice') === 'true' ? true : false : true)

  const [isHints, setIsHints] = useState(
    localStorage.getItem('isHints')
      ? localStorage.getItem('isHints') === 'true' ? true : false : true)

  const globeRef = useRef<GlobeMethods>(null!);
  const [ countries, setCountries ] = useState({ features: [] });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode]);

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', !isDark ? 'dark' : 'light')
  }

  const handleBlindMode = (isBlind: boolean) => {
    setIsBlindMode(isBlind)
    localStorage.setItem('isBlind', isBlind ? "true" : "false")
  }

  const [storedGuesses, storeGuesses] = useLocalStorage<Guesses>("guesses", {
    countries: [],
  });

  const [storedPrGuesses, storePrGuesses] = useLocalStorage<Guesses>("pr_guesses", {
    countries: [],
  });

  const firstStats = {
    gamesWon: 0,
    lastWin: new Date(0).toLocaleDateString("en-CA"),
    currentStreak: 0,
    maxStreak: 0,
    usedGuesses: [],
  };
  const [storedStats, storeStats] = useLocalStorage<Stats>(
    "statistics",
    firstStats
  );

  function handlePractice (practice: boolean) {

    if (!isPractice) {
      localStorage.setItem('r_country', rand_country+"");
      storeGuesses({countries: places});
    }
    console.log("123" + practice);
    setisPractice(practice);
    localStorage.setItem('isPractice', practice ? "true" : "false");

    if (practice) {

      var r_country = Math.round(Math.random() * 196);

      setWin(false);
      const rval = localStorage.getItem('pr_country');
      if (rval) {
        r_country = parseInt(rval);
        setRandCountry(r_country);
        var loadPlaces = storedPrGuesses.countries;
        var answ = setPlaces(loadPlaces);
        setMsg(answ);
      } else {
        localStorage.setItem('pr_country', r_country+"");
        setRandCountry(r_country);
        setPlaces([]);
      }

    } else {
      const rval = localStorage.getItem('r_country');
      var r_country = 102;
      if (rval) {
        r_country = parseInt(rval);
      }
      localStorage.setItem('pr_country', rand_country+"");
      setRandCountry(r_country);
      storePrGuesses({countries: places});
      var answ = setPlaces(storedGuesses.countries);
      setMsg(answ);
      setWin(storedStats.lastWin === (new Date().toLocaleDateString("en-CA")));
    }

  }

  function handleHints(isHints: boolean) {
    setIsHints(isHints)
    localStorage.setItem('isHints', isHints ? 'true' : 'false')
  }

  useEffect(() => {
    fetch('./data/country_data.json').then(res => res.json())
      .then(countries => {
        getCountries(countries);
        setCountries(countries);
      });
  }, []);

  function newPractice() {
    var r_country = Math.round(Math.random() * 196);
      if (win && isPractice) {
        localStorage.setItem('pr_country', r_country+"");
        storePrGuesses({countries: []});
        setPlaces([]);
        setRandCountry(r_country);
        setWin(false); 
      }
  }

  const loadGueses = useEffect(() => {

    if (!isPractice) {
      
    var today = new Date().toLocaleDateString("en-CA");
    if (localStorage.getItem('day')) {
      if (localStorage.getItem('day') !== today) {
        localStorage.removeItem('guesses');
        storeGuesses({countries: []});
        setPlaces([]);
        var r = t_id;
        localStorage.setItem('r_country', r+"");
        localStorage.setItem('day', today);
        setRandCountry(r);
        return;
      } else {
        places = storedGuesses.countries;
        var answ = setPlaces(places);
        setMsg(answ);

      }
    }
    
    localStorage.setItem('day', today);
    } else {
      const rval = localStorage.getItem('pr_country');
      var r_country = Math.round(Math.random() * 196);
      if (rval) {
        r_country = parseInt(rval);
      }
      setRandCountry(r_country);

      places = storedPrGuesses.countries;
      var answ = setPlaces(places);
      setMsg(answ);

    }

  }, [countries]);

  function handleSubmit(value: string) {

    return addPlace(value);

  }

  return (
    <div className="h-screen" onClick={() => { if (msg === "Game4" || msg === "Game3") setMsg("")}}>
      <Navbar
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
        practiceHandler={handlePractice}
        isPractice={isPractice}
      />

      <Globe
        isDarkMode={isDarkMode}
        isBlindMode={isBlindMode}
        graphicData={graphicData}
        countries={countries}
        angle={angle}
        guesses={places}
        globeRef={globeRef}
        practiceMode={isPractice}
        win={win}
        handlePractice={newPractice}
        r_country={rand_country}
        storedStats={storedStats}
        storeStats={storeStats}
        setIsStatsModalOpen={setIsStatsModalOpen}
        setMsg={setMsg}
      />
      <InputField
        handleSubmit={handleSubmit}
        setMsg={[msg, setMsg]}
        countries={countries}
      />

      <SettingsModal
        handleDarkMode={handleDarkMode}
        isDarkMode={isDarkMode}
        handleBlindMode={handleBlindMode}
        isBlind={isBlindMode}
        isSettingsModalOpen={isSettingsModalOpen}
        isPractice={isPractice}
        isHints={isHints}
        handlePractice={handlePractice}
        handleHints={handleHints}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
      />
      <InfoModal
        lastwin={storedStats.lastWin}
        isInfoModalOpen={isInfoModalOpen}
        setIsInfoModalOpen={setIsInfoModalOpen}
      />
      <StatisticModal
        isStatsModalOpen={isStatsModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        storedStats={storedStats}
        win={false}
        practiceMode={false}
        c_name={'Africa'}
        g_length={14}
        handlerPractice={()=>{}}
      />
      
    </div>
  );

}

export default UI;
