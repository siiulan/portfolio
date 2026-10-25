import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE } from "./motion";

type Props = {
  sections: { id: string; label: string }[];
  index: number;
  onSelect: (i: number) => void;
};

/** Vertical stepper on the right edge (desktop) and segmented bar along the bottom (mobile). */
export function StepBar({ sections, index, onSelect }: Props) {
  const progress = index / (sections.length - 1);

  return (
    <>
      <nav
        aria-label="Sections"
        className="fixed top-1/2 right-6 z-20 hidden -translate-y-1/2 md:block lg:right-10"
      >
        <div className="relative">
          {/* rail + filled progress, aligned with the tick column */}
          <div className="absolute top-2 right-[3px] bottom-2 w-px bg-white/10" />
          <motion.div
            className="absolute top-2 right-[3px] bottom-2 w-px origin-top bg-ember/70"
            initial={false}
            animate={{ scaleY: progress }}
            transition={{ duration: 0.8, ease: EASE }}
          />
          <ol className="relative flex flex-col gap-5">
            {sections.map((s, i) => {
              const active = i === index;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(i)}
                    aria-current={active ? "step" : undefined}
                    className="group flex w-full items-center justify-end gap-3 py-0.5"
                  >
                    <span
                      className={cn(
                        "eyebrow transition-all duration-300 ease-out-expo",
                        active
                          ? "translate-x-0 text-white opacity-100"
                          : "translate-x-1 text-white/70 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                      )}
                    >
                      {s.label}
                    </span>
                    <span
                      className={cn(
                        "eyebrow w-5 text-right transition-colors duration-300",
                        active ? "text-ember" : "text-white/55 group-hover:text-white/82",
                      )}
                    >
                      {String(i).padStart(2, "0")}
                    </span>
                    <span className="relative grid size-[7px] place-items-center">
                      <span
                        className={cn(
                          "size-[5px] rounded-full transition-all duration-300",
                          active ? "scale-0 bg-ember" : "bg-white/30 group-hover:bg-white/70",
                        )}
                      />
                      {active && (
                        <motion.span
                          layoutId="step-active"
                          className="absolute inset-[-3px] rounded-full border border-ember bg-ember/20 shadow-[0_0_12px_2px] shadow-ember/40"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>

      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-void via-void/90 to-transparent px-4 pt-8 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden"
      >
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="eyebrow text-white/80">{sections[index].label}</span>
          <span className="eyebrow text-white/62">
            <span className="text-ember">{String(index).padStart(2, "0")}</span> /{" "}
            {String(sections.length - 1).padStart(2, "0")}
          </span>
        </div>
        <ol className="flex gap-1.5">
          {sections.map((s, i) => (
            <li key={s.id} className="flex-1">
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-label={s.label}
                aria-current={i === index ? "step" : undefined}
                className="block w-full py-2"
              >
                <span
                  className={cn(
                    "block h-[3px] rounded-full transition-colors duration-500",
                    i === index ? "bg-ember" : i < index ? "bg-white/45" : "bg-white/15",
                  )}
                />
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
