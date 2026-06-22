import type { ScrollTarget } from "@/config/scroll-targets";
import {
  getScrollTargetIndex,
  scrollTargets,
} from "@/config/scroll-targets";
import type { SectionId } from "@/config/site";

const SCROLL_LOCK_CLASS = "is-scroll-navigating";
const SCROLL_TOLERANCE_PX = 4;

function getScrollPaddingTop() {
  const root = document.documentElement;
  return Number.parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
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

function getTargetScrollTop(target: ScrollTarget) {
  if (target === "hero") return 0;

  const el =
    target === "footer"
      ? document.getElementById("footer")
      : document.getElementById(target);

  if (!el) return window.scrollY;

  return (
    el.getBoundingClientRect().top + window.scrollY - getScrollPaddingTop()
  );
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

async function scrollToPosition(top: number, behavior: ScrollBehavior) {
  const targetTop = Math.max(0, top);

  lockScrollNavigation();
  window.scrollTo({ top: targetTop, behavior });
  await waitForScrollSettle(targetTop, behavior);

  if (Math.abs(window.scrollY - targetTop) > SCROLL_TOLERANCE_PX) {
    window.scrollTo({ top: targetTop, behavior: "auto" });
    await waitForScrollSettle(targetTop, "auto");
  }

  unlockScrollNavigation();
}

export function scrollToSection(
  id: SectionId,
  behavior: ScrollBehavior = "smooth",
) {
  void scrollToPosition(getTargetScrollTop(id), behavior);
}

export function scrollToTarget(
  target: ScrollTarget,
  behavior: ScrollBehavior = "smooth",
) {
  void scrollToPosition(getTargetScrollTop(target), behavior);
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
  if (!target) return;

  scrollToTarget(target, behavior);
}
