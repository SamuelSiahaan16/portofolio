import { DockTabs } from "@/components/ui/dock-tabs";
import type { DockPlacement } from "@/contexts/DockPlacementContext";
import { useActiveSection } from "@/hooks/useActiveSection";

type SiteDockNavProps = {
  placement: DockPlacement;
};

export function SiteDockNav({ placement }: SiteDockNavProps) {
  const activeId = useActiveSection();

  return <DockTabs activeId={activeId} placement={placement} />;
}
