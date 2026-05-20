import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { IconName } from "./UiIcon";
import { UiIcon } from "./UiIcon";

type PrimaryButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  leadingIcon?: IconName;
};

export function PrimaryButton({
  children,
  className = "",
  variant = "primary",
  leadingIcon,
  ...props
}: PrimaryButtonProps) {
  return (
    <a className={`button button--${variant} ${className}`.trim()} {...props}>
      {leadingIcon ? <UiIcon name={leadingIcon} className="button__leading-icon" /> : null}
      <span>{children}</span>
      {variant === "primary" ? (
        <UiIcon name="arrow-right" className="button__icon" />
      ) : null}
    </a>
  );
}
