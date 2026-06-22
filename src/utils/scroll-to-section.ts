import type { ScrollTarget } from "@/config/scroll-targets";
import {
  getScrollTargetIndex,
  scrollTargets,
} from "@/config/scroll-targets";
import type { SectionId } from "@/config/site";

const SCROLL_LOCK_CLASS = "is-scroll-navigating";
export const SCROLL_TOLERANCE_PX = 4;

function getScrollElement(target: ScrollTarget) {
  if (target === "hero") return document.getElementById("hero");
  if (target === "footer") return document.getElementById("footer");
  return document.getElementById(target);
}

function lockScrollNavigation() {
  const root = document.documentElement;
  root.classList.add(SCROLL_LOCK_CLASS);
  root.style.scrollSnapType = "none";
}

function unlockScrollNavigation() {
  const root = document.documentElement;
  root.classList.remove(SCROLL_LOCK_CLASS);
  root.style.scrollSnapType = "";
}

/** Align section top ke viewport top — satu layar penuh per section. */
export function getTargetScrollTop(target: ScrollTarget) {
  if (target === "hero") return 0;

  const el = getScrollElement(target);
  if (!el) return window.scrollY;

  return Math.max(0, el.getBoundingClientRect().top + window.scrollY);
}

/** Section yang paling relevan dengan posisi scroll saat ini. */
export function getScrollTargetFromPosition(): ScrollTarget {
  const probeY = window.scrollY + window.innerHeight * 0.45;
  let matched: ScrollTarget = "hero";

  for (const target of scrollTargets) {
    if (probeY + SCROLL_TOLERANCE_PX >= getTargetScrollTop(target)) {
      matched = target;
    }
  }

  return matched;
}

function waitForScrollSettle(
  targetTop: number,
  behavior: ScrollBehavior,
): Promise<void> {
  return new Promise((resolve) => {
    const maxWaitMs = behavior === "smooth" ? 2200 : 600;
    const startedAt = performance.now();
    let lastY = window.scrollY;
    let stableFrames = 0;
    let resolved = false;

    const finish = () => {
      if (resolved) return;
      resolved = true;
      resolve();
    };

    const check = () => {
      const currentY = window.scrollY;
      const atTarget = Math.abs(currentY - targetTop) <= SCROLL_TOLERANCE_PX;
      const isStable = Math.abs(currentY - lastY) < 0.5;

      lastY = currentY;
      stableFrames = isStable ? stableFrames + 1 : 0;

      if ((atTarget && stableFrames >= 3) || performance.now() - startedAt > maxWaitMs) {
        finish();
        return;
      }

      requestAnimationFrame(check);
    };

    window.addEventListener("scrollend", finish, { once: true });
    requestAnimationFrame(check);
  });
}

async function scrollToPosition(
  targetTop: number,
  behavior: ScrollBehavior,
  target?: ScrollTarget,
) {
  const top = Math.max(0, targetTop);
  const el = target ? getScrollElement(target) : null;

  lockScrollNavigation();

  if (el) {
    el.scrollIntoView({ block: "start", behavior });
  } else {
    window.scrollTo({ top, behavior });
  }

  await waitForScrollSettle(top, behavior);

  if (Math.abs(window.scrollY - top) > SCROLL_TOLERANCE_PX) {
    if (el) {
      el.scrollIntoView({ block: "start", behavior: "auto" });
    } else {
      window.scrollTo({ top, behavior: "auto" });
    }
    await waitForScrollSettle(top, "auto");
  }

  unlockScrollNavigation();
}

export function scrollToSection(
  id: SectionId,
  behavior: ScrollBehavior = "smooth",
) {
  void scrollToPosition(getTargetScrollTop(id), behavior, id);
}

export function scrollToTarget(
  target: ScrollTarget,
  behavior: ScrollBehavior = "smooth",
) {
  void scrollToPosition(getTargetScrollTop(target), behavior, target);
}

export function scrollToAdjacent(
  current: ScrollTarget,
  direction: "prev" | "next",
  behavior: ScrollBehavior = "smooth",
) {
  const index = getScrollTargetIndex(current);
  if (index < 0) return;

  const nextIndex = direction === "next" ? index + 1 : index - 1;
  const target = scrollTargets[nextIndex];

  if (target) {
    scrollToTarget(target, behavior);
    return;
  }

  if (direction === "prev" && window.scrollY > SCROLL_TOLERANCE_PX) {
    scrollToTarget("hero", behavior);
  }
}
