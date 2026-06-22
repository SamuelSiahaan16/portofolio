import { Outlet } from "react-router-dom";
import {
  DockPlacementProvider,
  useDockPlacement,
} from "@/contexts/DockPlacementContext";
import { SiteDockNav } from "./SiteDockNav";
import { SiteFooter } from "./SiteFooter";

function MainLayoutContent() {
  const placement = useDockPlacement();

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteDockNav placement={placement} />
      <main className="flex-1 pt-28">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

export function MainLayout() {
  return (
    <DockPlacementProvider>
      <MainLayoutContent />
    </DockPlacementProvider>
  );
}
