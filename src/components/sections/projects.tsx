import { useEffect, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, Bell, Hammer, Music, Palette, Timer } from "lucide-react";
import { moreInProgress, projects, type Project, type ProjectFeature } from "@/data/profile";
import { cn } from "@/lib/utils";
import { GithubIcon } from "../brand-icons";
import { EASE, Reveal } from "../motion";
import { SectionShell } from "../section-shell";

const SLIDE_MS = 4500;

const featureIcon: Record<ProjectFeature["icon"], typeof Timer> = {
  timer: Timer,
  palette: Palette,
  music: Music,
  bell: Bell,
};

export function Projects() {
  const [active, setActive] = useState(0);
  const project = projects[active];

  return (
    <SectionShell index={2} label="Projects" title="Shipped on my own time.">
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.12fr_1fr] lg:gap-12">
        <div>
          <Reveal>
            <Showcase key={project.id} project={project} />
          </Reveal>
          <Reveal className="mt-4">
            <Shelf active={active} onSelect={setActive} />
          </Reveal>
        </div>

        <div className="flex flex-col justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <Reveal>
                <ProjectDetails project={project} />
              </Reveal>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SectionShell>
  );
}

/** Browser-window frame cycling through the project's screenshots, tilting gently toward the pointer. */
function Showcase({ project }: { project: Project }) {
  const [shot, setShot] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = project.shots.length;

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setShot((s) => (s + 1) % count), SLIDE_MS);
    return () => clearTimeout(id);
  }, [shot, paused, count]);

  // Warm the cache so crossfades never flash an unloaded image.
  useEffect(() => {
    project.shots.forEach((s) => (new Image().src = s.src));
  }, [project]);

  // ←/→ step through screenshots; ↑/↓ stay with page navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setShot((s) => (s + 1) % count);
      if (e.key === "ArrowLeft") setShot((s) => (s - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count]);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 150, damping: 20 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-5, 5]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [4, -4]), spring);
  const glare = useTransform(
    [px, py],
    ([x, y]: number[]) =>
      `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgb(255 255 255 / 0.10), transparent 60%)`,
  );

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    setPaused(false);
  };

  const url = project.links.live?.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="[perspective:1400px]">
      <motion.div
        onPointerMove={onMove}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY }}
        className="glass relative overflow-hidden rounded-2xl shadow-2xl shadow-black/50 will-change-transform"
      >
        {/* window chrome */}
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-2.5">
          <div className="flex gap-1.5">
            {["bg-[#ff5f57]", "bg-[#febc2e]", "bg-[#28c840]"].map((c) => (
              <span key={c} className={cn("size-2.5 rounded-full opacity-80", c)} />
            ))}
          </div>
          {url && (
            <span className="min-w-0 flex-1 truncate rounded-md bg-white/[0.05] px-3 py-1 text-center font-mono text-xs text-white/60">
              {url}
            </span>
          )}
        </div>

        {/* screenshots */}
        <div className="relative aspect-[16/10] overflow-hidden bg-black">
          <AnimatePresence initial={false}>
            <motion.img
              key={shot}
              src={project.shots[shot].src}
              alt={`${project.name}: ${project.shots[shot].caption}`}
              className="absolute inset-0 size-full object-cover"
              initial={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </AnimatePresence>
          <motion.div className="pointer-events-none absolute inset-0" style={{ background: glare }} />

          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={shot}
              className="glass absolute bottom-3 left-3 rounded-full px-3 py-1.5 text-xs text-white/85"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {project.shots[shot].caption}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* slide progress: one segment per screenshot, the current one fills over SLIDE_MS */}
        <div className="flex gap-1.5 px-4 py-3">
          {project.shots.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setShot(i)}
              aria-label={`Show screenshot: ${s.caption}`}
              aria-current={i === shot}
              className="group flex-1 py-1.5"
            >
              <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/15 transition-colors group-hover:bg-white/30">
                {i < shot && <span className="absolute inset-0 bg-white/50" />}
                {i === shot && (
                  <span
                    key={`${shot}-${project.id}`}
                    className="absolute inset-0 origin-left bg-ember"
                    style={{
                      animation: `fill ${SLIDE_MS}ms linear forwards`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ProjectDetails({ project }: { project: Project }) {
  return (
    <div>
      <p className="eyebrow text-ember">
        {project.kind} · {project.year}
      </p>
      <h3 className="mt-2 text-3xl font-semibold tracking-tight">{project.name}</h3>
      <p className="mt-1 text-lg text-white/85">{project.tagline}</p>
      <p className="mt-3 text-[15px] leading-relaxed text-white/70">{project.description}</p>

      <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
        {project.features.map((f) => {
          const Icon = featureIcon[f.icon];
          return (
            <li key={f.title} className="flex items-center gap-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04]">
                <Icon className="size-4 text-ember" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{f.title}</span>
                <span className="hidden text-xs leading-snug text-white/60 [@media(min-height:860px)]:block">
                  {f.text}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      <ul className="mt-5 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <li
            key={t}
            className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-xs text-white/75"
          >
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-2.5">
        {project.links.live && (
          <a
            href={project.links.live}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-void transition-transform duration-200 ease-out-expo active:scale-[0.97]"
          >
            Live demo
            <ArrowUpRight className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        )}
        {project.links.source && (
          <a
            href={project.links.source}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/85 transition-[color,border-color,transform] duration-200 hover:border-white/35 hover:text-white active:scale-[0.97]"
          >
            <GithubIcon size={15} />
            Source
          </a>
        )}
      </div>
    </div>
  );
}

/** Project picker: one pill per project, then a placeholder slot while more work is in progress. */
function Shelf({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {projects.map((p, i) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(i)}
          aria-pressed={i === active}
          className="group relative flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] py-1.5 pr-3.5 pl-1.5 text-sm font-medium transition-colors hover:border-white/25"
        >
          <img src={p.shots[0].src} alt="" className="h-7 w-11 rounded-md object-cover" />
          {p.name}
          {i === active && (
            <motion.span
              layoutId="shelf-active"
              className="absolute -inset-px rounded-xl border-2 border-ember"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
        </button>
      ))}

      {moreInProgress && (
        <span className="relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-dashed border-white/20 px-3.5 py-2.5 text-white/70">
          <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/[0.08] to-transparent motion-reduce:animate-none" />
          <Hammer className="size-3.5" />
          <span className="eyebrow">More projects in progress</span>
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-ember/60 motion-reduce:animate-none" />
            <span className="relative size-1.5 rounded-full bg-ember" />
          </span>
        </span>
      )}
    </div>
  );
}
