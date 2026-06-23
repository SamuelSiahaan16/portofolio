import { SECTION_TITLE } from "@/config/copy";
import { Shuffle } from "@/components/ui/shuffle";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id: string;
  title: string;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  id,
  title,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <Shuffle
      id={id}
      tag="h1"
      text={title}
      className={cn(
        "section-shuffle-title text-balance",
        align === "center" && "mx-auto",
        className,
      )}
      textAlign={align}
      {...SECTION_TITLE}
    />
  );
}
