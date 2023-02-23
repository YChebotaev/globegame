import { useState, useEffect, useMemo } from 'react'
import { Locale } from '../lib/locale';
import { langNameMap } from '../i18n/langNameMap'

type Props = {
  isHints: boolean;
  value: string
  locale: Locale
  countries: { features: never[] }
}

export default function useHints({
  isHints,
  value,
  locale,
  countries
}: Props) {
  const lowercasedValue = value.toLowerCase()
  const [currentSelected, setCurrentSelected] = useState(-1);
  const hints = useMemo(() => {
    const hints: string[] = [];

    if (isHints && lowercasedValue !== "") {
      for (let { properties } of countries.features) {
        const langName = langNameMap[locale];
        const name = Reflect.get(properties, langName ?? "ADMIN") as string;
        const postalName = Reflect.get(properties, "POSTAL") as string
        const abbrevName = (Reflect.get(properties, "ABBREV") as string).replace(/\./g, '');

        if (
          name.toLowerCase().startsWith(lowercasedValue)
          || postalName.toLowerCase().startsWith(lowercasedValue)
          || abbrevName.toLowerCase().startsWith(lowercasedValue)
        ) {
          hints.push(name);
        }
      }
    }

    return hints;
  }, [lowercasedValue, locale, countries.features, isHints]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowUp":
          e.preventDefault()

          setCurrentSelected((currentSelected) => {
            const nextSelected = currentSelected - 1

            if (nextSelected <= -1) {
              return hints.length - 1
            } else {
              return nextSelected
            }
          });
          break;
        case "ArrowDown":
          e.preventDefault()

          setCurrentSelected((currentSelected) => (currentSelected + 1) % hints.length);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hints]);

  useEffect(() => {
    setCurrentSelected(-1)
  }, [hints])

  return {
    hints,
    currentSelected
  }
}
