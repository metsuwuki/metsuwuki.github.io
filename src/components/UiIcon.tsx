import type { SVGProps } from "react";

export type IconName =
  | "analyser"
  | "apps"
  | "archive"
  | "arrow-right"
  | "branch"
  | "cleaner"
  | "craft"
  | "cpp"
  | "c"
  | "csharp"
  | "css"
  | "delete"
  | "discord"
  | "download"
  | "entropy"
  | "export"
  | "file"
  | "folder"
  | "folder-scan"
  | "formats"
  | "github"
  | "go"
  | "home"
  | "html"
  | "imports"
  | "java"
  | "js"
  | "kagami"
  | "kotlin"
  | "log"
  | "logbook"
  | "lua"
  | "message"
  | "overview"
  | "pe"
  | "portal"
  | "preview"
  | "process"
  | "purge"
  | "pulse"
  | "python"
  | "runtime"
  | "rust"
  | "sass"
  | "scenario"
  | "scan"
  | "scss"
  | "shield"
  | "shield-warn"
  | "spark"
  | "stack"
  | "stress-scenario"
  | "terminal"
  | "ts"
  | "tsx"
  | "write";

type UiIconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
};

const iconViewBox: Partial<Record<IconName, string>> = {
  discord: "0 0 24 24",
  download: "0 0 24 24",
  github: "0 0 20 20",
  home: "0 0 24 24",
  runtime: "0 0 24 24",
  write: "0 0 24 24",
};

export function UiIcon({ name, ...props }: UiIconProps) {
  return (
    <svg aria-hidden="true" viewBox={iconViewBox[name] ?? "0 0 20 20"} fill="none" {...props}>
      {iconNodes[name]}
    </svg>
  );
}

const iconNodes: Record<IconName, JSX.Element> = {
  analyser: (
    <>
      <rect x="3.5" y="4" width="9.5" height="12" rx="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13 13.2L16.2 16.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="9.2" cy="9.1" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.2 12.2L11.1 6.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
    </>
  ),
  apps: (
    <>
      <rect x="3.2" y="3.2" width="5.4" height="5.4" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="11.4" y="3.2" width="5.4" height="5.4" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3.2" y="11.4" width="5.4" height="5.4" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="11.4" y="11.4" width="5.4" height="5.4" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  archive: (
    <>
      <rect x="4" y="5" width="12" height="10.5" rx="2.3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6.5 8.1H13.5M6.5 10.4H13.5M6.5 12.7H11.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M7.2 3.7H12.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.82" />
    </>
  ),
  "arrow-right": (
    <path
      d="M4.5 10H15.5M15.5 10L10.75 5.25M15.5 10L10.75 14.75"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  branch: (
    <>
      <circle cx="5.2" cy="5.2" r="1.7" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="14.8" cy="5.2" r="1.7" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="14.8" cy="14.8" r="1.7" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6.9 5.2H11.2C13.19 5.2 14.8 6.81 14.8 8.8V13.1M10.6 14.8H7.9C6.41 14.8 5.2 13.59 5.2 12.1V6.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  cleaner: (
    <>
      <path d="M7.1 5.3H12.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8.2 3.8H11.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
      <path
        d="M5.1 5.8L5.9 15.1C6.02 16.38 7.09 17.35 8.38 17.35H11.62C12.91 17.35 13.98 16.38 14.1 15.1L14.9 5.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M8.2 8.2V13.6M11.8 8.2V13.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  craft: (
    <>
      <path d="M5.2 13.8L13.9 5.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12.8 4.8L15.2 7.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4.6 15.4L6.8 14.8L5.2 13.2L4.6 15.4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12.9 10.9L14 12.5L15.9 13.1L14.3 14.2L13.7 16.1L12.6 14.5L10.7 13.9L12.3 12.8L12.9 10.9Z" fill="currentColor" opacity="0.92" />
    </>
  ),
  c: (
    <path
      d="M13.7 5.7C12.8 4.95 11.65 4.5 10.4 4.5C7.42 4.5 5 6.92 5 9.9C5 12.88 7.42 15.3 10.4 15.3C11.65 15.3 12.8 14.85 13.7 14.1"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  ),
  cpp: (
    <>
      <path
        d="M10.7 5.7C9.82 4.95 8.69 4.5 7.45 4.5C4.49 4.5 2.1 6.92 2.1 9.9C2.1 12.88 4.49 15.3 7.45 15.3C8.69 15.3 9.82 14.85 10.7 14.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M13.2 8.2V11.6M11.5 9.9H14.9M16.2 8.2V11.6M14.5 9.9H17.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  csharp: (
    <>
      <path d="M5.7 7.1H14.3M5.7 12.9H14.3M7.8 5.2V14.8M12.2 5.2V14.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M3.9 8.7L2.5 10L3.9 11.3M16.1 8.7L17.5 10L16.1 11.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  css: (
    <>
      <path d="M6.5 5.1C5 5.1 3.8 6.3 3.8 7.8C3.8 9.3 5 10.5 6.5 10.5H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M13.5 14.9C15 14.9 16.2 13.7 16.2 12.2C16.2 10.7 15 9.5 13.5 9.5H11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9.5 4.7L7.8 15.3M12.2 4.7L10.5 15.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
    </>
  ),
  delete: (
    <>
      <path d="M13.5 3H12H8C6.34 3 5 4.34 5 6V18C5 19.66 6.34 21 8 21H11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 3L19 8.62M13.5 3V7.62C13.5 8.18 13.95 8.62 14.5 8.62H19M19 8.62V11.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 16L17.5 18.5M20 21L17.5 18.5M17.5 18.5L20 16M17.5 18.5L15 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  discord: (
    <path d="M18.59 5.89C17.36 5.32 16.05 4.9 14.67 4.66C14.5 4.96 14.3 5.37 14.17 5.7C12.71 5.48 11.26 5.48 9.83 5.7C9.69 5.37 9.49 4.96 9.32 4.66C7.94 4.9 6.63 5.32 5.4 5.89C2.92 9.63 2.25 13.28 2.58 16.87C4.23 18.1 5.82 18.84 7.39 19.33C7.78 18.8 8.12 18.23 8.42 17.64C7.85 17.43 7.31 17.16 6.8 16.85C6.94 16.75 7.07 16.64 7.2 16.54C10.33 18 13.72 18 16.81 16.54C16.94 16.65 17.07 16.75 17.21 16.85C16.7 17.16 16.15 17.42 15.59 17.64C15.89 18.23 16.23 18.8 16.62 19.33C18.19 18.84 19.79 18.1 21.43 16.87C21.82 12.7 20.76 9.09 18.61 5.89H18.59ZM8.84 14.67C7.9 14.67 7.13 13.8 7.13 12.73C7.13 11.66 7.88 10.79 8.84 10.79C9.8 10.79 10.56 11.66 10.55 12.73C10.55 13.79 9.8 14.67 8.84 14.67ZM15.15 14.67C14.21 14.67 13.44 13.8 13.44 12.73C13.44 11.66 14.19 10.79 15.15 10.79C16.11 10.79 16.87 11.66 16.86 12.73C16.86 13.79 16.11 14.67 15.15 14.67Z" fill="currentColor" />
  ),
  download: (
    <path fillRule="evenodd" clipRule="evenodd" d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12ZM12 6.25C12.4142 6.25 12.75 6.58579 12.75 7V12.1893L14.4697 10.4697C14.7626 10.1768 15.2374 10.1768 15.5303 10.4697C15.8232 10.7626 15.8232 11.2374 15.5303 11.5303L12.5303 14.5303C12.3897 14.671 12.1989 14.75 12 14.75C11.8011 14.75 11.6103 14.671 11.4697 14.5303L8.46967 11.5303C8.17678 11.2374 8.17678 10.7626 8.46967 10.4697C8.76256 10.1768 9.23744 10.1768 9.53033 10.4697L11.25 12.1893V7C11.25 6.58579 11.5858 6.25 12 6.25ZM8 16.25C7.58579 16.25 7.25 16.5858 7.25 17C7.25 17.4142 7.58579 17.75 8 17.75H16C16.4142 17.75 16.75 17.4142 16.75 17C16.75 16.5858 16.4142 16.25 16 16.25H8Z" fill="currentColor" />
  ),
  entropy: (
    <>
      <path d="M4.4 13.8L7.1 10.9L9.3 12.5L12.1 7.5L15.6 10.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.1" cy="10.9" r="1" fill="currentColor" />
      <circle cx="12.1" cy="7.5" r="1" fill="currentColor" />
      <circle cx="15.6" cy="10.2" r="1" fill="currentColor" />
    </>
  ),
  export: (
    <path
      d="M10 3.75V11M10 11L7.1 8.1M10 11L12.9 8.1M4.75 13.9V14.35C4.75 15.1 5.35 15.7 6.1 15.7H13.9C14.65 15.7 15.25 15.1 15.25 14.35V13.9"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  file: (
    <>
      <path d="M5 4.7H10.1L13.8 8.8V15.3H5V4.7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10.1 4.7V8.8H13.8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6.8 11.2H12M6.8 13.3H11.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
  folder: (
    <>
      <path
        d="M3.6 6.4C3.6 5.52 4.32 4.8 5.2 4.8H8.4L9.55 6.15H14.8C15.68 6.15 16.4 6.87 16.4 7.75V13.8C16.4 14.68 15.68 15.4 14.8 15.4H5.2C4.32 15.4 3.6 14.68 3.6 13.8V6.4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M3.9 8.2H16.1" stroke="currentColor" strokeWidth="1.4" opacity="0.7" />
    </>
  ),
  "folder-scan": (
    <>
      <path
        d="M3.8 6.5C3.8 5.56 4.56 4.8 5.5 4.8H8.35L9.45 6.15H14.5C15.44 6.15 16.2 6.91 16.2 7.85V13.5C16.2 14.44 15.44 15.2 14.5 15.2H5.5C4.56 15.2 3.8 14.44 3.8 13.5V6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M6.1 8.8H13.9M7.2 11.2H12.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.78" />
      <path d="M14.2 13.6L16.1 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12.8" cy="12.2" r="2" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  formats: (
    <>
      <path d="M5 5.1H10.1L13.8 8.8V14.9H5V5.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10.1 5.1V8.8H13.8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6.9 10.4L6.1 11.2L6.9 12M9 10.4L9.8 11.2L9 12M11.1 10.2H12.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  go: (
    <>
      <path d="M3.6 9.8H9.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4.8 7.7H8.5M4.8 11.9H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      <circle cx="12.6" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.6 10H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  home: (
    <>
      <path d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 18H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
    imports: (
      <>
        <path d="M13.8 5H16.3V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.3 5L10.4 10.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M16.1 10.3V14.8C16.1 15.57 15.47 16.2 14.7 16.2H5.3C4.53 16.2 3.9 15.57 3.9 14.8V5.3C3.9 4.53 4.53 3.9 5.3 3.9H9.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  html: (
    <>
      <path d="M4.2 10L7.4 6.8M4.2 10L7.4 13.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.8 10L12.6 6.8M15.8 10L12.6 13.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.1 5.6L8.9 14.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  java: (
    <>
      <path d="M6.2 13.8H13.8C13.8 12.14 12.12 11.2 10 11.2C7.88 11.2 6.2 12.14 6.2 13.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7.3 15.4H12.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 5.4C10.2 6.2 10.3 6.9 9.5 7.8C8.8 8.6 8.95 9.4 10.1 10.1M12 4.7C13.05 5.4 13.12 5.98 12.45 6.72" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  kagami: (
    <>
      <path d="M4.2 14.6H15.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.1 14.6V9.2H13.9V14.6M5.1 9.2H14.9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M11.9 5.2A2.9 2.9 0 1 0 11.9 10.8A2.25 2.25 0 1 1 11.9 5.2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </>
  ),
    log: (
      <>
        <path d="M4.8 4.7H14.2C15.2 4.7 16 5.5 16 6.5V15.3H6.3C5.47 15.3 4.8 14.63 4.8 13.8V4.7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M6.9 8H12.9M6.9 10.3H12.9M6.9 12.6H10.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M16 13.2H4.8" stroke="currentColor" strokeWidth="1.2" opacity="0.72" />
      </>
    ),
  js: (
    <>
      <path d="M6.4 5.2V12.2C6.4 13.93 5.33 14.9 3.9 14.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13.7 5.5C12.1 5.5 11 6.33 11 7.55C11 8.72 11.93 9.24 13.2 9.6C14.46 9.96 15.4 10.4 15.4 11.7C15.4 13.16 14.14 14.25 12.35 14.25C10.94 14.25 9.85 13.7 9.1 12.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  kotlin: (
    <>
      <path d="M4.5 4.5H15.5L10 10L15.5 15.5H4.5V4.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4.5 15.5L10 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  lua: (
    <>
      <circle cx="9" cy="10" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.7 7.2A3.1 3.1 0 1 0 10.7 12.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="14.6" cy="6.2" r="1.1" fill="currentColor" />
    </>
  ),
  logbook: (
    <>
      <path d="M5.2 4.7H13.7C14.75 4.7 15.6 5.55 15.6 6.6V15.3H6.3C5.47 15.3 4.8 14.63 4.8 13.8V5.1C4.8 4.88 4.97 4.7 5.2 4.7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7.2 8H12.8M7.2 10.3H12.8M7.2 12.6H10.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M4.8 13.2H15.6" stroke="currentColor" strokeWidth="1.2" opacity="0.72" />
    </>
  ),
  message: (
    <>
      <rect x="2.5" y="5.5" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 8L10 12.5L17.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  overview: (
    <>
      <circle cx="10" cy="10" r="1.2" fill="currentColor" />
      <path d="M4.8 10C4.8 6.95 7.12 4.7 10 4.7C12.88 4.7 15.2 6.95 15.2 10C15.2 13.05 12.88 15.3 10 15.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 3.7V5.2M16.3 10H14.8M10 14.8V16.3M5.2 10H3.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.78" />
    </>
  ),
  pe: (
    <>
      <path d="M4.2 4.8H10.1L13.8 8.5V15.2H4.2V4.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10.1 4.8V8.5H13.8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="10.1" cy="11.1" r="2.1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11.6 12.6L13.6 14.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  portal: (
    <>
      <path d="M10 3.6L11.95 6.05L14.95 6.45L13.45 9.1L14.05 12L10.95 11.35L8.5 13.25L7.95 10.3L5.35 8.7L8.1 7.55L8.85 4.7L10 3.6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 12.8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    </>
  ),
  preview: (
    <>
      <rect x="3.9" y="4.7" width="12.2" height="10.6" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.1 12L8.6 9.5L10.3 11.2L12.7 8.8L13.9 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="7.7" r="0.9" fill="currentColor" />
    </>
  ),
  process: (
    <>
      <circle cx="6" cy="6" r="1.3" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="14" cy="6" r="1.3" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10" cy="14" r="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.2 7L9.1 11.9M12.8 7L10.9 11.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 14H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  purge: (
    <>
      <path d="M6.8 5.4H13.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 3.9H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.78" />
      <path d="M5.3 6L6 14.6C6.1 15.58 6.92 16.3 7.9 16.3H12.1C13.08 16.3 13.9 15.58 14 14.6L14.7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7.5 12.8L12.5 7.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  pulse: (
    <path
      d="M3.5 10H6.2L7.9 7.1L10.3 13.1L12.1 9.4H16.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  runtime: (
    <path fillRule="evenodd" clipRule="evenodd" d="M3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 7.28595 22 4.92893 20.5355 3.46447C19.0711 2 16.714 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447ZM17.5762 10.4801C17.8413 10.1619 17.7983 9.68901 17.4801 9.42383C17.1619 9.15866 16.689 9.20165 16.4238 9.51986L14.6269 11.6761C14.2562 12.1211 14.0284 12.3915 13.8409 12.5609C13.7539 12.6394 13.7023 12.6708 13.6775 12.6827C13.6311 12.6708 13.5795 12.6394 13.4925 12.5609C13.3049 12.3915 13.0772 12.1211 12.7064 11.6761L12.414 11.3252C12.0855 10.931 11.7894 10.5756 11.5128 10.3258C11.2119 10.0541 10.8328 9.81205 10.3333 9.81205C9.83384 9.81205 9.45478 10.0541 9.15384 10.3258C8.87725 10.5756 8.58113 10.931 8.25267 11.3253L6.42383 13.5199C6.15866 13.8381 6.20165 14.311 6.51986 14.5762C6.83807 14.8413 7.31099 14.7983 7.57617 14.4801L9.37306 12.3239C9.74385 11.8789 9.97155 11.6085 10.1591 11.4391C10.2461 11.3606 10.2977 11.3292 10.3225 11.3173C10.3689 11.3292 10.4205 11.3606 10.5075 11.4391C10.6951 11.6085 10.9228 11.8789 11.2936 12.3239L11.586 12.6748C11.9145 13.069 12.2106 13.4244 12.4872 13.6742C12.7881 13.9459 13.1672 14.188 13.6667 14.188C14.1662 14.188 14.5452 13.9459 14.8462 13.6742C15.1228 13.4244 15.4189 13.069 15.7473 12.6748L17.5762 10.4801Z" fill="currentColor" />
  ),
  python: (
    <>
      <path
        d="M7.4 4.7H10.9C12.49 4.7 13.6 5.71 13.6 7.2V8.7C13.6 10.19 12.49 11.2 10.9 11.2H8.1C6.89 11.2 6 12.01 6 13.1V13.6C6 14.78 6.96 15.7 8.2 15.7H11.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12.6 15.3H9.1C7.51 15.3 6.4 14.29 6.4 12.8V11.3C6.4 9.81 7.51 8.8 9.1 8.8H11.9C13.11 8.8 14 7.99 14 6.9V6.4C14 5.22 13.04 4.3 11.8 4.3H8.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.82"
      />
      <circle cx="9" cy="6.55" r="0.8" fill="currentColor" />
      <circle cx="11" cy="13.45" r="0.8" fill="currentColor" />
    </>
  ),
  rust: (
    <>
      <circle cx="10" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 3.8V5.3M10 14.7V16.2M16.2 10H14.7M5.3 10H3.8M14.4 5.6L13.35 6.65M6.65 13.35L5.6 14.4M14.4 14.4L13.35 13.35M6.65 6.65L5.6 5.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M8.7 10H11.2M9 8.8H10.7M9 11.2H10.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  sass: (
    <>
      <path
        d="M12.9 5.8C12.2 4.97 10.94 4.5 9.55 4.5C7.16 4.5 5.1 5.82 5.1 7.75C5.1 9.02 6.15 9.74 7.75 10.1C6.57 10.49 5.7 11.22 5.7 12.25C5.7 13.86 7.34 15.1 9.65 15.1C11.56 15.1 13.2 14.16 13.2 12.65C13.2 11.29 11.92 10.54 10.25 10.15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11.9 6.9C11.9 7.55 11.3 8.05 10.55 8.05C9.8 8.05 9.2 7.55 9.2 6.9C9.2 6.25 9.8 5.75 10.55 5.75C11.3 5.75 11.9 6.25 11.9 6.9Z" fill="currentColor" opacity="0.82" />
    </>
  ),
  scenario: (
    <>
      <path d="M5.1 5.8V14.2M5.1 9.1H10.2C11.75 9.1 13 10.35 13 11.9V14.2M5.1 8.9H10.2C11.75 8.9 13 7.65 13 6.1V5.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="5.1" cy="5.8" r="1.15" fill="currentColor" />
      <circle cx="13" cy="5.8" r="1.15" fill="currentColor" />
      <circle cx="13" cy="14.2" r="1.15" fill="currentColor" />
    </>
  ),
  scan: (
    <>
      <path d="M6 3.8H4.9C4.18 3.8 3.6 4.38 3.6 5.1V6.2M14 3.8H15.1C15.82 3.8 16.4 4.38 16.4 5.1V6.2M6 16.2H4.9C4.18 16.2 3.6 15.62 3.6 14.9V13.8M14 16.2H15.1C15.82 16.2 16.4 15.62 16.4 14.9V13.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="10" r="2.7" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  scss: (
    <>
      <path d="M5.2 7.2C5.2 5.73 6.39 4.55 7.85 4.55H11.95" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14.8 12.8C14.8 14.27 13.61 15.45 12.15 15.45H8.05" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9.2 6.8L12.6 10L9.2 13.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  shield: (
    <path
      d="M10 3.8L15 5.7V9.3C15 12.33 12.92 15.1 10 16.2C7.08 15.1 5 12.33 5 9.3V5.7L10 3.8Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  "shield-warn": (
    <>
      <path d="M10 3.8L15 5.7V9.3C15 12.33 12.92 15.1 10 16.2C7.08 15.1 5 12.33 5 9.3V5.7L10 3.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 7.4V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="12.75" r="0.8" fill="currentColor" />
    </>
  ),
  spark: (
    <path
      d="M10 3.5L11.4 7L15 8.4L11.4 9.8L10 13.3L8.6 9.8L5 8.4L8.6 7L10 3.5ZM14.8 13.3L15.5 15L17.2 15.7L15.5 16.4L14.8 18.1L14.1 16.4L12.4 15.7L14.1 15L14.8 13.3Z"
      fill="currentColor"
    />
  ),
  stack: (
    <>
      <path d="M10 4L15.2 6.7L10 9.4L4.8 6.7L10 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4.8 10.1L10 12.8L15.2 10.1M4.8 13.5L10 16.2L15.2 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "stress-scenario": (
    <>
      <circle cx="10" cy="10" r="6.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 10L13.5 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M5.5 10A4.5 4.5 0 0 1 10 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
    </>
  ),
  terminal: (
    <>
      <path d="M4.8 6.3L8.1 9.6L4.8 12.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 13H15.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="3.3" y="4" width="13.4" height="12" rx="2.2" stroke="currentColor" strokeWidth="1.4" opacity="0.7" />
    </>
  ),
  ts: (
    <>
      <path d="M4.4 5.4H11.2M7.8 5.4V14.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14.1 5.8C12.69 5.8 11.7 6.51 11.7 7.58C11.7 8.63 12.51 9.08 13.65 9.39C14.79 9.7 15.6 10.08 15.6 11.24C15.6 12.54 14.49 13.5 12.93 13.5C11.7 13.5 10.74 13.03 10.1 12.17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  tsx: (
    <>
      <path d="M4.6 6H11.2M7.9 6V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12.7 7.1L16 12.9M16 7.1L12.7 12.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="3.6" y="4.4" width="12.8" height="11.2" rx="2.1" stroke="currentColor" strokeWidth="1.3" opacity="0.72" />
    </>
  ),
  github: (
    <path d="M10,0 C15.523,0 20,4.59 20,10.253 C20,14.782 17.138,18.624 13.167,19.981 C12.66,20.082 12.48,19.762 12.48,19.489 C12.48,19.151 12.492,18.047 12.492,16.675 C12.492,15.719 12.172,15.095 11.813,14.777 C14.04,14.523 16.38,13.656 16.38,9.718 C16.38,8.598 15.992,7.684 15.35,6.966 C15.454,6.707 15.797,5.664 15.252,4.252 C15.252,4.252 14.414,3.977 12.505,5.303 C11.706,5.076 10.85,4.962 10,4.958 C9.15,4.962 8.295,5.076 7.497,5.303 C5.586,3.977 4.746,4.252 4.746,4.252 C4.203,5.664 4.546,6.707 4.649,6.966 C4.01,7.684 3.619,8.598 3.619,9.718 C3.619,13.646 5.954,14.526 8.175,14.785 C7.889,15.041 7.63,15.493 7.54,16.156 C6.97,16.418 5.522,16.871 4.63,15.304 C4.63,15.304 4.101,14.319 3.097,14.247 C3.097,14.247 2.122,14.234 3.029,14.87 C3.029,14.87 3.684,15.185 4.139,16.37 C4.139,16.37 4.726,18.2 7.508,17.58 C7.513,18.437 7.522,19.245 7.522,19.489 C7.522,19.76 7.338,20.077 6.839,19.982 C2.865,18.627 0,14.783 0,10.253 C0,4.59 4.478,0 10,0" fill="currentColor" />
  ),
  write: (
    <path fillRule="evenodd" clipRule="evenodd" d="M19.186 2.09c.521.25 1.136.612 1.625 1.101.49.49.852 1.104 1.1 1.625.313.654.11 1.408-.401 1.92l-7.214 7.213c-.31.31-.688.541-1.105.675l-4.222 1.353a.75.75 0 0 1-.943-.944l1.353-4.221a2.75 2.75 0 0 1 .674-1.105l7.214-7.214c.512-.512 1.266-.714 1.92-.402zm.211 2.516a3.608 3.608 0 0 0-.828-.586l-6.994 6.994a1.002 1.002 0 0 0-.178.241L9.9 14.102l2.846-1.496c.09-.047.171-.107.242-.178l6.994-6.994a3.61 3.61 0 0 0-.586-.828zM4.999 5.5A.5.5 0 0 1 5.47 5l5.53.005a1 1 0 0 0 0-2L5.5 3A2.5 2.5 0 0 0 3 5.5v12.577c0 .76.082 1.185.319 1.627.224.419.558.754.977.978.442.236.866.318 1.627.318h12.154c.76 0 1.185-.082 1.627-.318.42-.224.754-.559.978-.978.236-.442.318-.866.318-1.627V13a1 1 0 1 0-2 0v5.077c0 .459-.021.571-.082.684a.364.364 0 0 1-.157.157c-.113.06-.225.082-.684.082H5.923c-.459 0-.57-.022-.684-.082a.363.363 0 0 1-.157-.157c-.06-.113-.082-.225-.082-.684V5.5z" fill="currentColor" />
  )
};
