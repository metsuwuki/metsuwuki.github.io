import type { SVGProps } from "react";

export type UiIconName =
  | "spark"
  | "grid"
  | "home"
  | "compass"
  | "heart"
  | "users"
  | "shield"
  | "slash"
  | "info"
  | "chat"
  | "cinema"
  | "bot"
  | "mic"
  | "lock"
  | "moon"
  | "device"
  | "gamepad"
  | "bell"
  | "warning"
  | "shieldCheck"
  | "discord"
  | "github";

type UiIconProps = SVGProps<SVGSVGElement> & {
  name: UiIconName;
};

export function UiIcon({ name, ...props }: UiIconProps) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  switch (name) {
    case "spark":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <path {...common} d="M12 3.5 13.9 8l4.6 1.9-4.6 1.9L12 16.5l-1.9-4.7L5.5 9.9 10.1 8 12 3.5Z" />
          <path {...common} d="M18.5 15.5 19.2 17l1.5.8-1.5.7-.7 1.5-.7-1.5-1.5-.7 1.5-.8.7-1.5Z" />
        </svg>
      );
    case "grid":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <rect {...common} x="4" y="4" width="6" height="6" rx="1.6" />
          <rect {...common} x="14" y="4" width="6" height="6" rx="1.6" />
          <rect {...common} x="4" y="14" width="6" height="6" rx="1.6" />
          <rect {...common} x="14" y="14" width="6" height="6" rx="1.6" />
        </svg>
      );
    case "home":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...props}>
          <path {...common} d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z" />
          <path {...common} strokeLinecap="round" d="M15 18H9" />
        </svg>
      );
    case "compass":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <circle {...common} cx="12" cy="12" r="8" />
          <path {...common} d="m14.8 9.2-2 5.6-5.6 2 2-5.6 5.6-2Z" />
        </svg>
      );
    case "heart":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <path
            {...common}
            d="M12 19.2 5.9 13a4 4 0 0 1 5.7-5.6L12 8l.4-.6A4 4 0 0 1 18 13l-6 6.2Z"
          />
        </svg>
      );
    case "users":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <path {...common} d="M9 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path {...common} d="M17 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
          <path {...common} d="M4.5 18.5a5.5 5.5 0 0 1 9 0" />
          <path {...common} d="M14.5 18.5a4.4 4.4 0 0 1 5 0" />
        </svg>
      );
    case "shield":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <path {...common} d="M12 4.5 18 7v4.8c0 3.7-2.2 6-6 7.7-3.8-1.7-6-4-6-7.7V7l6-2.5Z" />
        </svg>
      );
    case "slash":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <circle {...common} cx="12" cy="12" r="8" />
          <path {...common} d="m8.5 15.5 7-7" />
        </svg>
      );
    case "info":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <circle {...common} cx="12" cy="12" r="8" />
          <path {...common} d="M12 10.5v5" />
          <path {...common} d="M12 7.5h.01" />
        </svg>
      );
    case "chat":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <path {...common} d="M6 7.5h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H11l-4.5 3V17.5H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case "cinema":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <rect {...common} x="4" y="6" width="16" height="12" rx="2" />
          <path {...common} d="m10 9 5 3-5 3V9Z" />
        </svg>
      );
    case "bot":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <rect {...common} x="6" y="8" width="12" height="9" rx="3" />
          <path {...common} d="M12 4.5v3" />
          <path {...common} d="M9.5 12h.01M14.5 12h.01" />
          <path {...common} d="M9 17v2M15 17v2" />
        </svg>
      );
    case "mic":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <rect {...common} x="9" y="4" width="6" height="10" rx="3" />
          <path {...common} d="M6.5 11.5a5.5 5.5 0 0 0 11 0" />
          <path {...common} d="M12 17v3" />
          <path {...common} d="M9 20h6" />
        </svg>
      );
    case "lock":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <rect {...common} x="6" y="11" width="12" height="9" rx="2" />
          <path {...common} d="M8.5 11V8.8a3.5 3.5 0 1 1 7 0V11" />
        </svg>
      );
    case "moon":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <path {...common} d="M16.8 15.8A7 7 0 0 1 8.2 7.2a7.8 7.8 0 1 0 8.6 8.6Z" />
        </svg>
      );
    case "device":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <rect {...common} x="4" y="5" width="16" height="10" rx="2" />
          <path {...common} d="M9 19h6" />
          <path {...common} d="M12 15v4" />
        </svg>
      );
    case "gamepad":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <path {...common} d="M7.5 17.5 5.8 16a3.2 3.2 0 0 1 2.1-5.6h8.2a3.2 3.2 0 0 1 2.1 5.6l-1.7 1.5-2.1-2.1H9.6l-2.1 2.1Z" />
          <path {...common} d="M9 13h-2.5M7.75 11.75v2.5" />
          <path {...common} d="M15.8 12.2h.01M17.6 13.8h.01" />
        </svg>
      );
    case "bell":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <path {...common} d="M8 17h8l-1-1.8v-3.1a3 3 0 1 0-6 0v3.1L8 17Z" />
          <path {...common} d="M10.5 19a1.5 1.5 0 0 0 3 0" />
        </svg>
      );
    case "warning":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <path {...common} d="M12 5.5 19 18H5l7-12.5Z" />
          <path {...common} d="M12 10v4" />
          <path {...common} d="M12 16.7h.01" />
        </svg>
      );
    case "shieldCheck":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
          <path {...common} d="M12 4.5 18 7v4.8c0 3.7-2.2 6-6 7.7-3.8-1.7-6-4-6-7.7V7l6-2.5Z" />
          <path {...common} d="m9.5 12.5 1.7 1.7 3.6-3.7" />
        </svg>
      );
    case "discord":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      );
    case "github":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );
    default:
      return null;
  }
}
