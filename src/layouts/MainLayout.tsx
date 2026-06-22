import { AnimatePresence, motion } from "motion/react";
import { Outlet } from "react-router-dom";
import {
  DockPlacementProvider,
  useDockPlacement,
} from "@/contexts/DockPlacementContext";
import { useFooterInView } from "@/hooks/useFooterInView";
import { zIndex } from "@/config/z-index";
import { SiteDockNav } from "./SiteDockNav";
import { SiteFooter } from "./SiteFooter";
import { SectionPager } from "@/components/ui/section-pager";

function MainLayoutContent() {
  const placement = useDockPlacement();
  const footerInView = useFooterInView();
  const showDock = !footerInView;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <AnimatePresence initial={false}>
        {showDock ? (
          <motion.div
            key="site-dock"
            className="pointer-events-none fixed inset-x-0 top-0"
            style={{ zIndex: zIndex.dock }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <SiteDockNav placement={placement} />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <SectionPager />
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
