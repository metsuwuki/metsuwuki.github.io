type NavIconProps = {
  name: "home" | "kagami" | "shield" | "users" | "ban";
  className?: string;
};

export default function NavIcon({ name, className }: NavIconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      {icons[name]}
    </svg>
  );
}

const icons: Record<NavIconProps["name"], JSX.Element> = {
  home: (
    <>
      <path d="M3.4 9.6C3.4 8.1 3.4 7.35 3.76 6.72C4.11 6.08 4.76 5.68 6.07 4.87L7.45 4.01C8.62 3.29 9.2 2.93 10 2.93C10.8 2.93 11.38 3.29 12.55 4.01L13.93 4.87C15.24 5.68 15.89 6.08 16.24 6.72C16.6 7.35 16.6 8.1 16.6 9.6V11.04C16.6 13.78 16.6 15.15 15.76 16C14.93 16.85 13.58 16.85 10.9 16.85H9.1C6.42 16.85 5.07 16.85 4.24 16C3.4 15.15 3.4 13.78 3.4 11.04V9.6Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12.25 14.3H7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  kagami: (
    <>
      <path d="M4.2 14.6H15.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.1 14.6V9.2H13.9V14.6M5.1 9.2H14.9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M11.9 5.2A2.9 2.9 0 1 0 11.9 10.8A2.25 2.25 0 1 1 11.9 5.2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </>
  ),
  shield: <path d="M10 3.8L15 5.7V9.3C15 12.33 12.92 15.1 10 16.2C7.08 15.1 5 12.33 5 9.3V5.7L10 3.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />,
  users: (
    <>
      <circle cx="7.6" cy="7.1" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.7 15.1C4.15 12.85 5.57 11.65 7.6 11.65C9.63 11.65 11.05 12.85 11.5 15.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12.2 5.45C13.28 5.72 14.08 6.7 14.08 7.86C14.08 8.98 13.34 9.93 12.32 10.24M12.95 12.02C14.55 12.38 15.6 13.44 16 15.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  ban: (
    <>
      <circle cx="10" cy="10" r="6.1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.9 14.1L14.1 5.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  )
};
