import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  count: number;
  ids: string[];
  /** While true, paging input is ignored (e.g. a dialog is open). */
  paused?: boolean;
};

const LOCK_MS = 750;
// A gap this long between wheel events means the previous gesture (and its momentum) has ended.
const GESTURE_GAP_MS = 140;
const WHEEL_THRESHOLD = 28;
// Ignore speed-ups smaller than this so trackpad jitter isn't read as a new swipe.
const MIN_SWIPE_DELTA = 8;
const SWIPE_THRESHOLD = 48;

/** True when an element under the pointer can still scroll in the given direction, so the page shouldn't. */
function innerCanScroll(target: EventTarget | null, dir: 1 | -1) {
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body) {
    if (el instanceof HTMLElement && el.dataset.scroll !== undefined) {
      const max = el.scrollHeight - el.clientHeight;
      if (max > 1) {
        if (dir > 0 && el.scrollTop < max - 1) return true;
        if (dir < 0 && el.scrollTop > 1) return true;
      }
    }
    el = el.parentElement;
  }
  return false;
}

export function useSectionNav({ count, ids, paused = false }: Options) {
  const initial = Math.max(0, ids.indexOf(location.hash.slice(1)));
  const [state, setState] = useState({ index: initial, dir: 1 as 1 | -1 });
  const indexRef = useRef(initial);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.min(count - 1, Math.max(0, next));
      const cur = indexRef.current;
      if (clamped === cur) return;
      indexRef.current = clamped;
      setState({ index: clamped, dir: clamped > cur ? 1 : -1 });
      history.replaceState(null, "", `#${ids[clamped]}`);
    },
    [count, ids],
  );

  useEffect(() => {
    let lockUntil = 0;
    let lastWheel = 0;
    let lastAbs = 0;
    // True while the current gesture has already been "spent" (paged, or scrolled inner content);
    // its trailing momentum must not page. Cleared by a pause or by a fresh swipe.
    let spent = false;
    let acc = 0;

    const step = (dir: 1 | -1) => {
      const before = indexRef.current;
      goTo(before + dir);
      if (indexRef.current !== before) {
        lockUntil = performance.now() + LOCK_MS;
        spent = true;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (pausedRef.current || e.ctrlKey) return;
      const dy = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : 0;
      if (!dy) return;
      const dir = dy > 0 ? 1 : -1;

      const now = performance.now();
      const abs = Math.abs(dy);
      const gap = now - lastWheel;
      // Trackpad momentum only ever decays, so a jump in speed means a deliberate new swipe.
      // Speed-ups during the page transition are the same swipe still ramping up, not a new one.
      const fresh =
        gap > GESTURE_GAP_MS ||
        (now >= lockUntil && abs > Math.max(lastAbs * 1.5, MIN_SWIPE_DELTA));
      lastWheel = now;
      lastAbs = abs;
      if (fresh) {
        spent = false;
        acc = 0;
      }

      if (innerCanScroll(e.target, dir)) {
        spent = true; // reaching the end of inner content mid-gesture shouldn't also page
        return;
      }
      if (spent || now < lockUntil) return;

      acc += dy;
      if (Math.abs(acc) >= WHEEL_THRESHOLD) {
        acc = 0;
        step(dir);
      }
    };

    let touchY = 0;
    let touchX = 0;
    let touchTarget: EventTarget | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
      touchX = e.touches[0].clientX;
      touchTarget = e.target;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (pausedRef.current) return;
      const dy = touchY - e.changedTouches[0].clientY;
      const dx = touchX - e.changedTouches[0].clientX;
      if (Math.abs(dy) < SWIPE_THRESHOLD || Math.abs(dx) > Math.abs(dy)) return;
      const dir = dy > 0 ? 1 : -1;
      if (innerCanScroll(touchTarget, dir)) return;
      if (performance.now() < lockUntil) return;
      step(dir);
    };

    const onKey = (e: KeyboardEvent) => {
      if (pausedRef.current || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === " " && t?.tagName === "BUTTON") return;
      const next =
        e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)
          ? 1
          : e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)
            ? -1
            : 0;
      if (next) {
        if (innerCanScroll(document.activeElement, next as 1 | -1)) return;
        e.preventDefault();
        step(next as 1 | -1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(count - 1);
      }
    };

    const onHash = () => {
      const i = ids.indexOf(location.hash.slice(1));
      if (i >= 0) goTo(i);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
    };
  }, [count, ids, goTo]);

  return { index: state.index, dir: state.dir, goTo };
}
