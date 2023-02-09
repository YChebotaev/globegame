export type Locale =
  | "en-CA"
  | "es-MX"
  | "pt-BR"
  | "de-DE"
  | "fr-FR"
  | "hu-HU"
  | "it-IT"
  | "pl-PL"
  | "sv-SE";

export type Messages = {
  name: string;
  helpTitle: string;
  help1: string;
  help2: string;
  help3: string;
  France: string;
  Nepal: string;
  Mongolia: string;
  "South Korea": string;
  Aux1: string;
  Loading: string;
  GameTitle: string;
  Game1: string;
  Game2: string;
  Game3: string;
  Game4: string;
  Game5: string;
  Game6: string;
  Game7: string;
  Game8: string;
  StatsTitle: string;
  Stats1: string;
  Stats2: string;
  Stats3: string;
  Stats4: string;
  Stats5: string;
  Stats6: string;
  Stats7: string;
  Stats8: string;
  Stats9: string;
  Stats10: string;
  Stats11: string;
  Stats12: string;
  SettingsTitle: string;
  Settings1: string;
  Settings2: string;
  Settings3: string;
  Settings4: string;
  Settings5: string;
  Settings7: string;
  Settings9: string;
  Settings10: string;
  Answer: string;
  Closest: string;
  Guessed: string;
  PracticeMode: string;
  PracticeExit: string;
  PracticeNew: string;
  PlayAgain: string;
  SortBy: string;
  SortByGuesses: string;
  SortByDistance: string;
  Clipboard: string;
  Victory: string;
  Guesses: string;
  GuessesFlags: string;
  Daily: string;
  NextDailyIn: string;
};

export type LocaleMessages = Record<Locale, Messages>;
