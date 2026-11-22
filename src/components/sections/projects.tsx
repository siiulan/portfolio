import { useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  ChartSpline,
  Hammer,
  Music,
  Palette,
  Pause,
  Play,
  Scale,
  ShieldCheck,
  Timer,
  Volume2,
  VolumeX,
  Wallet,
} from "lucide-react";
import { moreInProgress, projects, type Project, type ProjectFeature } from "@/data/profile";
import { resolve, SECTION_IDS } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { GithubIcon } from "../brand-icons";
import { EASE, Reveal, stagger } from "../motion";
import { SectionShell } from "../section-shell";
import { CaseStudy } from "./case-study";

const SLIDE_MS = 4500;

const featureIcon: Record<ProjectFeature["icon"], typeof Timer> = {
  timer: Timer,
  palette: Palette,
  music: Music,
  bell: Bell,
  chart: ChartSpline,
  wallet: Wallet,
  scale: Scale,
  shield: ShieldCheck,
};

/** The open detail view, if the URL is #projects/<id> for a project that has one (see lib/routes). */
function detailFromHash() {
  const { route } = resolve(location.hash);
  return SECTION_IDS[route.index] === "projects" ? route.sub : null;
}

export function Projects() {
  const [active, setActive] = useState(0);
  const [detail, setDetail] = useState(detailFromHash);
  // True when the detail was opened from the list, so "back" can pop that history entry.
  const openedHere = useRef(false);

  useEffect(() => {
    const onHash = () => setDetail(detailFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const open = (id: string) => {
    openedHere.current = true;
    location.hash = `projects/${id}`;
  };
  const back = () => {
    if (openedHere.current) {
      openedHere.current = false;
      history.back();
    } else {
      location.hash = "projects";
    }
  };

  // Esc leaves the detail view.
  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && back();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <AnimatePresence mode="wait">
      {/* Each view runs its own stagger: views mounted after the section's entrance would otherwise stay hidden. */}
      <motion.div
        key={detail ?? "list"}
        className="h-full"
        variants={stagger}
        initial="hidden"
        animate="show"
        exit={{ opacity: 0, y: -12, filter: "blur(6px)", transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } }}
      >
        {detail ? (
          <CaseStudy onBack={back} />
        ) : (
          <ProjectList active={active} onSelect={setActive} onOpen={open} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function ProjectList({
  active,
  onSelect,
  onOpen,
}: {
  active: number;
  onSelect: (i: number) => void;
  onOpen: (id: string) => void;
}) {
  const project = projects[active];

  return (
    <SectionShell index={2} label="Projects" title="Shipped on my own time.">
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.12fr_1fr] lg:gap-12">
        <div>
          <Reveal>
            <Showcase key={project.id} project={project} />
          </Reveal>
          <Reveal className="mt-4">
            <Shelf active={active} onSelect={onSelect} />
          </Reveal>
        </div>

        {/* Reveal sits outside the swap: a Reveal mounted after the section's entrance would stay hidden. */}
        <Reveal className="flex flex-col justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <ProjectDetails
                project={project}
                onCaseStudy={project.caseStudy ? () => onOpen(project.id) : undefined}
              />
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </SectionShell>
  );
}

/**
 * Browser-window frame cycling through the project's media, tilting gently toward the pointer.
 * Images advance every SLIDE_MS (paused while hovered); a video plays to the end, then moves on.
 */
function Showcase({ project }: { project: Project }) {
  const [shot, setShot] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  // Mirrors the current video element's real state (read each frame, not from events, so a
  // video still fading out from the previous slide can't leave it wrong).
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoBarRef = useRef<HTMLSpanElement>(null);
  const count = project.shots.length;
  const current = project.shots[shot];

  /** Moves to another item; a video being left is paused so its sound doesn't trail the crossfade. */
  const go = (to: number | ((s: number) => number)) => {
    videoRef.current?.pause();
    setShot(to);
  };
  const next = () => go((s) => (s + 1) % count);

  useEffect(() => {
    if (paused || current.video) return;
    const id = setTimeout(next, SLIDE_MS);
    return () => clearTimeout(id);
  }, [shot, paused, count, current.video]);

  // Warm the cache so crossfades never flash an unloaded image.
  useEffect(() => {
    project.shots.forEach((s) => (new Image().src = s.video ? s.video.poster : s.src));
  }, [project]);

  // While a video is showing: its progress segment follows playback, and the play state is synced.
  useEffect(() => {
    if (!current.video) return;
    // Arriving on a video plays it, including one reused mid-crossfade after go() paused it.
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) void videoRef.current?.play().catch(() => {});
    let raf = 0;
    let last: boolean | null = null;
    const tick = () => {
      const v = videoRef.current;
      if (v) {
        if (videoBarRef.current && v.duration)
          videoBarRef.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
        const playing = !v.paused && !v.ended;
        if (playing !== last) setVideoPlaying((last = playing));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [current.video, shot]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) void v.play().catch(() => {});
    else v.pause();
  };

  // ←/→ step through screenshots; ↑/↓ stay with page navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go((s) => (s + 1) % count);
      if (e.key === "ArrowLeft") go((s) => (s - 1 + count) % count);
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
            {current.video ? (
              <motion.video
                key={shot}
                // Only ever point at a mounting element: an outgoing video unmounting later mustn't clear it.
                ref={(el: HTMLVideoElement | null) => {
                  if (el) videoRef.current = el;
                }}
                src={current.src}
                poster={current.video.poster}
                aria-label={`${project.name}: ${current.caption}`}
                className="absolute inset-0 size-full object-cover"
                autoPlay={!matchMedia("(prefers-reduced-motion: reduce)").matches}
                muted={muted}
                playsInline
                preload="metadata"
                onEnded={next}
                initial={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                {current.video.captions && (
                  <track kind="captions" src={current.video.captions} srcLang="en" label="English" />
                )}
              </motion.video>
            ) : (
              <motion.img
                key={shot}
                src={current.src}
                alt={`${project.name}: ${current.caption}`}
                className="absolute inset-0 size-full object-cover"
                initial={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
              />
            )}
          </AnimatePresence>
          <motion.div className="pointer-events-none absolute inset-0" style={{ background: glare }} />

          {/* Click anywhere on the video to play or pause. Paused: the play button shows (after a beat,
              so it doesn't flash while autoplay starts). Playing: a pause button appears on hover. */}
          {current.video && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label={videoPlaying ? "Pause the product tour" : "Play the product tour"}
              className={cn(
                "group/play absolute inset-0 grid place-items-center transition-colors duration-300",
                videoPlaying ? "hover:bg-black/15" : "bg-black/25",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={videoPlaying ? "pause" : "play"}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.25, ease: EASE, delay: videoPlaying ? 0 : 0.35 }}
                  className={cn(
                    "grid size-14 place-items-center rounded-full shadow-xl shadow-black/40 transition-[opacity,transform] duration-200 ease-out-expo active:scale-95",
                    videoPlaying
                      ? "glass text-white opacity-0! group-hover/play:opacity-100! group-focus-visible/play:opacity-100!"
                      : "bg-white text-void hover:scale-105",
                  )}
                >
                  {videoPlaying ? (
                    <Pause className="size-6 fill-current" />
                  ) : (
                    <Play className="ml-0.5 size-6 fill-current" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          )}
          {current.video && (
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Turn sound on" : "Turn sound off"}
              aria-pressed={!muted}
              className="glass absolute right-3 bottom-3 grid size-8 place-items-center rounded-full text-white/85 transition-colors hover:text-white"
            >
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={shot}
              className="glass absolute bottom-3 left-3 rounded-full px-3 py-1.5 text-xs text-white/85"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {current.caption}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* progress: one segment per item; an image fills over SLIDE_MS, a video tracks its playback */}
        <div className="flex gap-1.5 px-4 py-3">
          {project.shots.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${s.video ? "video" : "screenshot"}: ${s.caption}`}
              aria-current={i === shot}
              className="group flex-1 py-1.5"
            >
              <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/15 transition-colors group-hover:bg-white/30">
                {i < shot && <span className="absolute inset-0 bg-white/50" />}
                {i === shot && s.video && (
                  // inline scaleX(0), not Tailwind's scale-x-0: that sets the separate `scale` property,
                  // which would multiply with the transform written each frame and pin the bar at 0
                  <span
                    ref={videoBarRef}
                    className="absolute inset-0 origin-left bg-ember"
                    style={{ transform: "scaleX(0)" }}
                  />
                )}
                {i === shot && !s.video && (
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

function ProjectDetails({ project, onCaseStudy }: { project: Project; onCaseStudy?: () => void }) {
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
        {onCaseStudy && (
          <button
            type="button"
            onClick={onCaseStudy}
            className="group flex items-center gap-2 rounded-full border border-ember/50 px-4 py-2 text-sm text-white/90 transition-[color,border-color,transform] duration-200 hover:border-ember hover:text-white active:scale-[0.97]"
          >
            How it's built
            <ArrowRight className="size-4 text-ember transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5" />
          </button>
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
          className="group relative flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] py-1.5 pr-3 pl-1.5 text-sm font-medium transition-colors hover:border-white/25"
        >
          <img src={p.shots[0].video?.poster ?? p.shots[0].src} alt="" className="h-7 w-10 rounded-md object-cover object-left-top" />
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
        <span className="relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-dashed border-white/20 px-3 py-2.5 text-white/70">
          <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/[0.08] to-transparent motion-reduce:animate-none" />
          <Hammer className="size-3.5" />
          <span className="font-mono text-[11px] tracking-wider uppercase">More in progress</span>
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-ember/60 motion-reduce:animate-none" />
            <span className="relative size-1.5 rounded-full bg-ember" />
          </span>
        </span>
      )}
    </div>
  );
}
