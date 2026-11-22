import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Compass } from "lucide-react";
import { EASE } from "./motion";

const SHOW_MS = 4200;

/**
 * Tells the visitor a link pointed nowhere and they were taken to the closest page instead.
 * `signal` increases each time that happens (see useSectionNav), so repeats re-show it.
 */
export function NotFoundNotice({ signal }: { signal: number }) {
  const [visible, setVisible] = useState(signal > 0);

  useEffect(() => {
    if (signal === 0) return;
    setVisible(true);
    const id = setTimeout(() => setVisible(false), SHOW_MS);
    return () => clearTimeout(id);
  }, [signal]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-30 flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {visible && (
          <motion.p
            key={signal}
            role="status"
            initial={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
            transition={{ duration: 0.4, ease: EASE }}
            className="glass flex items-center gap-2.5 rounded-full px-4 py-2 text-sm text-white/85 shadow-xl shadow-black/40"
          >
            <Compass className="size-4 shrink-0 text-ember" />
            That page doesn't exist, so here's the closest one.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
