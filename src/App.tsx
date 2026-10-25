import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "motion/react";
import WaveMesh from "@/components/ui/wave-mesh";
import { EASE } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { StepBar } from "@/components/step-bar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";
import { useSectionNav } from "@/hooks/use-section-nav";

// Module-level so WaveMesh's effect (keyed on `colors`) doesn't rebuild its canvas on every render.
const MESH_COLORS: [string, string, string] = ["#07080c", "#8f97a8", "#ff8a4c"];

const SECTIONS = [
  { id: "home", label: "Index" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];
const IDS = SECTIONS.map((s) => s.id);
const PROJECTS = IDS.indexOf("projects");
const CONTACT = IDS.indexOf("contact");

const page: Variants = {
  hidden: (dir: number) => ({ opacity: 0, y: dir * 56 }),
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE, staggerChildren: 0.06, delayChildren: 0.08 },
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: dir * -40,
    filter: "blur(8px)",
    transition: { duration: 0.4, ease: [0.4, 0, 1, 1] },
  }),
};

/** Sends a ripple across the wave field, the same as a click on the ground. */
function ripple() {
  window.dispatchEvent(
    new PointerEvent("pointerdown", { clientX: innerWidth / 2, clientY: innerHeight * 0.8 }),
  );
}

export default function App() {
  const { index, dir, goTo } = useSectionNav({ count: SECTIONS.length, ids: IDS });

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    ripple();
  }, [index]);

  const views: ReactNode[] = [
    <Hero onWork={() => goTo(PROJECTS)} onContact={() => goTo(CONTACT)} />,
    <About />,
    <Projects />,
    <Contact />,
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className="fixed inset-0">
      <WaveMesh colors={MESH_COLORS} crests className="h-full w-full">
        {/* legibility scrim: darkens the field behind the content column only */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_45%,rgb(7_8_12/0.72),transparent_78%)]" />

        <SiteHeader onHome={() => goTo(0)} onContact={() => goTo(CONTACT)} />

        <main className="relative h-full">
          <AnimatePresence initial={true} custom={dir}>
            <motion.section
              key={SECTIONS[index].id}
              id={SECTIONS[index].id}
              aria-label={SECTIONS[index].label}
              className="absolute inset-0"
              custom={dir}
              variants={page}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {views[index]}
            </motion.section>
          </AnimatePresence>
        </main>

        <StepBar sections={SECTIONS} index={index} onSelect={goTo} />
      </WaveMesh>
      </div>
    </MotionConfig>
  );
}
