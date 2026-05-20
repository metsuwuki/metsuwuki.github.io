import type { AnchorHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
};

export function PrimaryButton({
  children,
  className = "",
  variant = "primary",
  icon,
  ...props
}: PrimaryButtonProps) {
  return (
    <a className={`button button--${variant} ${className}`.trim()} {...props}>
      {icon && <span className="button__leading-icon">{icon}</span>}
      <span>{children}</span>
      {variant === "primary" ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="button__icon"
        >
          <path
            d="M4.5 10H15.5M15.5 10L10.75 5.25M15.5 10L10.75 14.75"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </a>
  );
}
