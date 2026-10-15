import type { IconName } from "./UiIcon";
import { UiIcon } from "./UiIcon";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  icon?: IconName;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  icon
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div className={`section-heading ${isCentered ? "items-center text-center" : "items-start text-left"}`}>
      {eyebrow ? (
        <div className="section-heading__eyebrow">
          <span className="section-heading__line" aria-hidden="true" />
          <p>{eyebrow}</p>
          <span className="section-heading__line" aria-hidden="true" />
        </div>
      ) : null}
      {icon ? (
        <span className="section-heading__icon" aria-hidden="true">
          <UiIcon name={icon} />
        </span>
      ) : null}
      <h2>{title}</h2>
      {description ? <p className="section-heading__description">{description}</p> : null}
    </div>
  );
}
