import { motion, type Variants } from "motion/react";
import type { ComponentProps } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Parent variants: children using `rise` animate in one after another. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
};

export const rise: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

/** A block that rises into place as part of its section's stagger. */
export function Reveal(props: ComponentProps<typeof motion.div>) {
  return <motion.div variants={rise} {...props} />;
}
