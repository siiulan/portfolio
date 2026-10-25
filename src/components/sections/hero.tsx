import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { heroStats, profile } from "@/data/profile";
import { EASE, Reveal } from "../motion";

// Two parallel lines; the last word of each carries the accent.
const lines = [
  ["Build", "software", "that", "scales."],
  ["Lead", "teams", "that", "deliver."],
];

export function Hero({ onWork, onContact }: { onWork: () => void; onContact: () => void }) {
  return (
    <div
      data-scroll
      className="no-scrollbar flex h-full flex-col overflow-y-auto overscroll-contain px-4 pt-24 pb-28 sm:px-8 md:pr-28 md:pb-10 lg:px-16 lg:pr-36"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center text-center md:justify-start md:pt-[8vh]">
        <Reveal>
          <p className="bg-gradient-to-r from-ember via-[#ffb38a] to-ember bg-clip-text font-mono text-base font-medium tracking-[0.12em] text-transparent uppercase sm:text-xl">
            {profile.name}
          </p>
        </Reveal>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl lg:[@media(max-height:800px)]:text-6xl">
          {lines.map((line, l) => (
            <span key={l} className="block">
              {line.map((w, i) => (
                <motion.span
                  key={i}
                  className="inline-block whitespace-pre"
                  variants={{
                    hidden: { opacity: 0, y: "0.4em", filter: "blur(10px)" },
                    show: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.9, ease: EASE, delay: 0.2 + (l * 4 + i) * 0.05 },
                    },
                  }}
                >
                  <span className={i === line.length - 1 ? "text-ember" : undefined}>{w}</span>
                  {i < line.length - 1 ? " " : ""}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        <Reveal>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            Full-stack Engineer &amp; Team Lead at {profile.company}.
          </p>
        </Reveal>

        <Reveal className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onWork}
            className="group flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-void transition-transform duration-200 ease-out-expo active:scale-[0.97]"
          >
            See the work
            <ArrowRight className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={onContact}
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 transition-[color,border-color,transform] duration-200 ease-out-expo hover:border-white/35 hover:text-white active:scale-[0.97]"
          >
            Get in touch
          </button>
        </Reveal>
      </div>

      <Reveal className="mx-auto mt-10 w-full max-w-4xl">
        <dl className="glass grid grid-cols-2 divide-white/[0.06] overflow-hidden rounded-2xl sm:grid-cols-4 sm:divide-x">
          {heroStats.map((s) => (
            <div key={s.label} className="px-4 py-5 text-left sm:px-6">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-2xl font-semibold tracking-tight whitespace-nowrap tabular-nums sm:text-3xl">
                {s.value}
              </dd>
              <dd className="mt-1.5 text-sm leading-snug text-white/75">{s.label}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal className="mt-6 hidden justify-center md:flex [@media(max-height:800px)]:hidden">
        <span className="eyebrow flex items-center gap-3 text-white/55">
          <span className="relative h-7 w-[18px] rounded-full border border-white/25">
            <motion.span
              className="absolute top-1.5 left-1/2 h-1.5 w-px -translate-x-1/2 bg-white/70"
              animate={{ y: [0, 6, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          Scroll to explore
        </span>
      </Reveal>
    </div>
  );
}
