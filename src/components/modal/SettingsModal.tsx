import React from 'react';
import { useState, useContext, useEffect } from 'react';
import Dropdown from 'react-dropdown';

import Modal from './Modal.jsx'
import { Toggle } from '../Toggle.jsx'
import './dropdown.css'

import { LocaleContext } from "../../i18n/LocaleContext";
import localeList from "../../i18n/messages";
import { Locale } from "../../lib/locale";

type Props = {
  handleDarkMode: Function;
  isDarkMode: boolean;
  handleBlindMode: Function;
  isBlind: boolean;
  isSettingsModalOpen: boolean;
  isPractice: boolean;
  isHints: boolean;
  handlePractice: Function;
  handleHints: Function;
  setIsSettingsModalOpen: (value: boolean) => void;
}

const SettingsModal = ({
  handleDarkMode,
  isDarkMode,
  handleBlindMode,
  isBlind,
  isSettingsModalOpen,
  isPractice,
  isHints,
  handlePractice,
  handleHints,
  setIsSettingsModalOpen
}: Props) => {
  const { locale } = useContext(LocaleContext);

  const langMap = {
    "en-CA": "English",
    "de-DE": "Deutsch",
    "es-MX": "Español",
    "fr-FR": "Français",
    "it-IT": "Italiano",
    "hu-HU": "Magyar",
    "pl-PL": "Polski",
    "pt-BR": "Português",
    "sv-SE": "Swedish",
  };

  const languages = Object.keys(localeList) as Locale[];

  const localeContext = useContext(LocaleContext);
  const [selected, setSelected] = useState<Locale>(localeContext.locale);

  useEffect(() => {
    
    var loc = document.getElementById('root')?.getAttribute('lan');

    setSelected(
      localStorage.getItem('lang')
        ? localStorage.getItem('lang') as Locale
        : loc as Locale)
  },[]);

  useEffect(() => {
    if (localeContext.setLocale) {
      localeContext.setLocale(selected);
    }
  }, [selected, localeContext]);

  function setLang(value : string) {
    localStorage.setItem('lang', value)
    setSelected(value as Locale)
  }

  let option: any[] = []
  languages.map((lang, idx) => {
    option.push({value: lang, label: langMap[lang]})
  })

  return (
    <Modal active={isSettingsModalOpen} setActive={setIsSettingsModalOpen}>

      <h3 className='modal-text'>{localeList[locale]["SettingsTitle"]}</h3>

      <div className='inline'>
        <p className='leading-none text-gray-500 text-gray-300' >{localeList[locale]["Settings7"]}</p>
      </div>
      <div className='align-right'>
        <Dropdown options={option} arrowClassName="top-3.5 right-2.5" controlClassName="bg-white pt-2 pr-12 pl-2 pb-2" menuClassName="bg-gray-300 w-full" onChange={(e) => setLang(e.value)} value={selected} placeholder="Select an option" />
      </div>
      <br className="clearBoth" />
      <hr></hr>

      <div className='inline'>
        <p className='leading-none text-gray-500 text-gray-300'>{localeList[locale]["Settings2"]}</p>
      </div>
      <div className='align-right'>
        <Toggle setActive={handleDarkMode} isActive={isDarkMode} />
      </div>
      <br className="clearBoth" />
      <hr></hr>

      <div className='inline'>
        <p className='leading-none text-gray-500 text-gray-300'>{localeList[locale]["Settings3"]}</p>
      </div>
      <div className='align-right'>
        <Toggle setActive={handleBlindMode} isActive={isBlind} />
      </div>
      <br className="clearBoth" />
      <hr></hr>

      <div className='inline'>
        <p className='leading-none text-gray-500 text-gray-300'>{localeList[locale]["Settings9"]}</p>
      </div>
      <div className='align-right'>
        <Toggle setActive={handlePractice} isActive={isPractice} />
      </div>
      <br className="clearBoth" />
      <hr></hr>

      <div className='inline'>
        <p className='leading-none text-gray-500 text-gray-300'>{localeList[locale]["Settings10"]}</p>
      </div>
      <div className='align-right'>
        <Toggle setActive={handleHints} isActive={isHints} />
      </div>
      <br className="clearBoth" />

    </Modal>
  );
}

export default SettingsModal;