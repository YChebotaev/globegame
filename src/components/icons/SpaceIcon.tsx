type Props = {
  isDarkMode: boolean
}

export default function SpaceIcon({ isDarkMode }: Props) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21,9a1,1,0,0,0-1,1v3H4V10a1,1,0,0,0-2,0v4a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V10A1,1,0,0,0,21,9Z"
        fill={isDarkMode ? "#ffffff" : "#000000"}
      />
    </svg>
  );
}
