import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

type Props = {
  index: number;
  label: string;
  title?: ReactNode;
  className?: string;
  children: ReactNode;
};

/**
 * Fills the viewport between the header and the step bar. Content is designed to fit;
 * on short screens it scrolls inside (scrollbar hidden) before paging to the next section.
 */
export function SectionShell({ index, label, title, className, children }: Props) {
  return (
    <div
      data-scroll
      className="no-scrollbar h-full overflow-y-auto overscroll-contain px-4 pt-20 pb-24 sm:px-8 md:pr-28 md:pb-12 lg:px-16 lg:pr-36"
    >
      <div
        className={cn(
          "mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center",
          className,
        )}
      >
        <Reveal className="eyebrow flex items-center gap-3 text-white/65">
          <span className="text-ember">{String(index).padStart(2, "0")}</span>
          <span className="h-px w-8 bg-white/20" />
          <span>{label}</span>
        </Reveal>
        {title && <SectionTitle className="mt-4">{title}</SectionTitle>}
        {children}
      </div>
    </div>
  );
}

/** The section headline; exported for layouts that place it inside a column instead of above the content. */
export function SectionTitle({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <Reveal>
      <h2
        className={cn(
          "max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl",
          className,
        )}
      >
        {children}
      </h2>
    </Reveal>
  );
}
