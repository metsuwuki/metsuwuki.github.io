type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center"
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div className={`section-heading ${isCentered ? "items-center text-center" : "items-start text-left"}`}>
      <div className="section-heading__eyebrow">
        <span className="section-heading__line" aria-hidden="true" />
        <p>{eyebrow}</p>
        <span className="section-heading__line" aria-hidden="true" />
      </div>
      <h2>{title}</h2>
      {description ? <p className="section-heading__description">{description}</p> : null}
    </div>
  );
}
