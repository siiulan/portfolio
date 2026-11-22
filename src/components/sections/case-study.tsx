import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Boxes,
  Check,
  Database,
  Globe,
  HardDrive,
  KeyRound,
  Lock,
  Server,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { architecture, caseStudy, pipeline, pipelineNote, security } from "@/data/case-study";
import { cn } from "@/lib/utils";
import { EASE, Reveal } from "../motion";
import { SectionShell, SectionTitle } from "../section-shell";

const TABS = [
  { id: "architecture", label: "Architecture", icon: Boxes },
  { id: "pipeline", label: "CI/CD", icon: Workflow },
  { id: "security", label: "Security", icon: ShieldCheck },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function CaseStudy({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<TabId>("architecture");

  return (
    <SectionShell index={2} label="Projects / WealthWeGo">
      <Reveal className="mt-4">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 py-1.5 pr-3.5 pl-2.5 text-sm text-white/80 transition-[color,border-color,transform] duration-200 hover:border-white/35 hover:text-white active:scale-[0.97]"
        >
          <ArrowLeft className="size-4 transition-transform duration-300 ease-out-expo group-hover:-translate-x-0.5" />
          All projects
        </button>
      </Reveal>
      <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
        <div className="flex flex-col justify-center">
          <SectionTitle>
            <span className="whitespace-nowrap">Production-grade.</span>{" "}
            <span className="whitespace-nowrap">
              <span className="text-ember">$0</span> a month.
            </span>
          </SectionTitle>
          <Reveal>
            <p className="mt-4 text-[15px] leading-relaxed text-white/75">
              <span className="font-medium text-white">{caseStudy.name}</span>, built solo.{" "}
              {caseStudy.intro}
            </p>
          </Reveal>

          <Reveal>
            <dl className="mt-6 grid grid-cols-2 gap-3">
              {caseStudy.stats.map((s) => (
                <div key={s.label} className="glass rounded-xl px-4 py-3">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="font-mono text-2xl font-semibold tracking-tight text-white">
                      {s.value}
                      {s.unit && <span className="text-base text-white/60">{s.unit}</span>}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-white/65">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="mt-6">
            <a
              href={caseStudy.live}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-void transition-transform duration-200 ease-out-expo active:scale-[0.97]"
            >
              Try it live
              <ArrowUpRight className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>

        <Reveal className="flex flex-col justify-center">
          <div className="glass overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
            <div role="tablist" aria-label="Engineering views" className="flex gap-1 border-b border-white/[0.07] p-1.5">
              {TABS.map((t) => {
                const active = t.id === tab;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls={`cs-${t.id}`}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                      active ? "text-white" : "text-white/60 hover:text-white/85",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="cs-tab"
                        className="absolute inset-0 rounded-lg bg-white/[0.08]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <t.icon className={cn("relative size-4", active && "text-ember")} />
                    <span className="relative">{t.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative min-h-[372px] p-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={tab}
                  id={`cs-${tab}`}
                  role="tabpanel"
                  initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {tab === "architecture" && <Architecture />}
                  {tab === "pipeline" && <Pipeline />}
                  {tab === "security" && <Security />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

/* ---------- Architecture: browser → edge → storage, over a shared engine ---------- */

function Node({
  icon: Icon,
  title,
  sub,
  items,
  className,
}: {
  icon: LucideIcon;
  title: string;
  sub: string;
  items?: string[];
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-white/10 bg-white/[0.03] p-3", className)}>
      <div className="flex items-center gap-2">
        <Icon className="size-4 shrink-0 text-ember" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="eyebrow mt-1 !text-[10px] text-white/50">{sub}</p>
      {items && (
        <ul className="mt-2.5 space-y-1.5">
          {items.map((it) => (
            <li key={it} className="flex gap-1.5 text-xs leading-snug text-white/75">
              <span className="mt-[7px] size-1 shrink-0 rounded-full bg-white/35" />
              {it}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** A connector with a packet travelling along it; vertical on phones, horizontal from sm up. */
function Wire({ delay = 0 }: { delay?: number }) {
  const reduce = useReducedMotion();
  const t = { duration: 1.6, delay, repeat: Infinity, repeatDelay: 0.4, ease: "easeInOut" as const };
  const dot = "absolute size-[5px] rounded-full bg-ember shadow-[0_0_10px_2px] shadow-ember/60";
  return (
    <div className="relative mx-auto h-5 w-px bg-white/15 sm:mx-0 sm:h-px sm:w-full sm:self-center">
      {!reduce && (
        <>
          <motion.span
            className={cn(dot, "top-[-2px] hidden sm:block")}
            animate={{ left: ["-2px", "calc(100% - 3px)"], opacity: [0, 1, 1, 0] }}
            transition={t}
          />
          <motion.span
            className={cn(dot, "left-[-2px] sm:hidden")}
            animate={{ top: ["-2px", "calc(100% - 3px)"], opacity: [0, 1, 1, 0] }}
            transition={t}
          />
        </>
      )}
    </div>
  );
}

function Architecture() {
  const { client, edge, stores, core } = architecture;
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_28px_1fr_28px_1fr]">
        <Node icon={Globe} {...client} />
        <Wire />
        <Node icon={Server} {...edge} />
        <Wire delay={0.8} />
        <div className="flex flex-col gap-2">
          <Node icon={Database} title={stores[0].title} sub={stores[0].sub} className="flex-1" />
          <Node icon={HardDrive} title={stores[1].title} sub={stores[1].sub} className="flex-1" />
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-dashed border-ember/40 bg-ember/[0.06] p-3">
        <Boxes className="mt-0.5 size-4 shrink-0 text-ember" />
        <p className="text-xs leading-relaxed text-white/80">
          <span className="font-mono text-white">{core.title}</span> · {core.text}
        </p>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-white/55">
        Same-origin by design: one Worker serves the app and the API, so every response carries the
        security headers and there's no CORS to get wrong.
      </p>
    </div>
  );
}

/* ---------- CI/CD: stages light up in order, then the run repeats ---------- */

const STEP_MS = 850;

function Pipeline() {
  const reduce = useReducedMotion();
  // -1 = idle; i = stage i is running; pipeline.length = all green
  const [at, setAt] = useState(reduce ? pipeline.length : -1);

  useEffect(() => {
    if (reduce) return;
    const hold = at === pipeline.length ? 2200 : at === -1 ? 500 : STEP_MS;
    const id = setTimeout(() => setAt((a) => (a >= pipeline.length ? -1 : a + 1)), hold);
    return () => clearTimeout(id);
  }, [at, reduce]);

  const progress = Math.max(0, Math.min(at, pipeline.length - 1)) / (pipeline.length - 1);

  return (
    <div>
      <ol className="relative">
        <span className="absolute top-3 bottom-3 left-[11px] w-px bg-white/10" />
        <motion.span
          className="absolute top-3 bottom-3 left-[11px] w-px origin-top bg-ember"
          animate={{ scaleY: at < 0 ? 0 : progress }}
          transition={{ duration: at < 0 ? 0.2 : STEP_MS / 1000, ease: "linear" }}
        />
        {pipeline.map((s, i) => {
          const done = i < at;
          const running = i === at;
          return (
            <li key={s.title} className="relative flex gap-3 py-[7px]">
              <span
                className={cn(
                  "relative z-10 grid size-[23px] shrink-0 place-items-center rounded-full border transition-colors duration-300",
                  done
                    ? "border-ember bg-ember text-void"
                    : running
                      ? "border-ember bg-void text-ember"
                      : "border-white/20 bg-void text-white/40",
                )}
              >
                {done ? (
                  <Check className="size-3" strokeWidth={3} />
                ) : running ? (
                  <span className="size-1.5 animate-ping rounded-full bg-ember" />
                ) : (
                  <span className="font-mono text-[10px]">{i + 1}</span>
                )}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block text-sm font-medium transition-colors duration-300",
                    done || running ? "text-white" : "text-white/60",
                  )}
                >
                  {s.title}
                </span>
                <span className="block text-xs leading-snug text-white/55">{s.text}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 border-t border-white/[0.07] pt-3 font-mono text-[11px] leading-relaxed text-white/50">
        {pipelineNote}
      </p>
    </div>
  );
}

/* ---------- Security ---------- */

const securityIcons: LucideIcon[] = [ShieldCheck, KeyRound, Lock, Lock, ShieldCheck, ShieldCheck];

function Security() {
  return (
    <div>
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {security.map((s, i) => {
          const Icon = securityIcons[i];
          return (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i, ease: EASE }}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <Icon className="size-4 text-ember" />
                {s.title}
              </span>
              <span className="mt-1 block text-xs leading-snug text-white/65">{s.text}</span>
            </motion.li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-white/55">
        Planned against OWASP ASVS Level 2 for authentication and sessions.
      </p>
    </div>
  );
}
