import type { SectionId } from "@/config/site";

export type SectionShellProps = {
  id: SectionId;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};
