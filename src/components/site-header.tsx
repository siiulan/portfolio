import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
// import { profile } from "@/data/profile"; // re-enable with the name label below
import logoMark from "@/assets/brand/logo-mark.png";

const clock = new Intl.DateTimeFormat("en-CA", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/Toronto",
});

export function SiteHeader({ onHome, onContact }: { onHome: () => void; onContact: () => void }) {
  const [time, setTime] = useState(() => clock.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(clock.format(new Date())), 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[max(16px,env(safe-area-inset-top))] sm:px-8 lg:px-10">
      <button
        type="button"
        onClick={onHome}
        className="pointer-events-auto flex items-center gap-3"
        aria-label="Back to start"
      >
        <img
          src={logoMark}
          alt=""
          width={48}
          height={48}
          className="size-11 transition-transform duration-500 ease-out-expo hover:scale-110 hover:-rotate-6 sm:size-12"
        />
        {/* <span className="hidden text-base font-semibold tracking-tight text-white sm:inline">
          {profile.short}
        </span> */}
      </button>

      <div className="pointer-events-auto flex items-center gap-5">
        <span className="eyebrow hidden items-center gap-2 text-white/62 sm:flex">
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-ember/60 motion-reduce:animate-none" />
            <span className="relative size-1.5 rounded-full bg-ember" />
          </span>
          {time} ET
        </span>
        <button
          type="button"
          onClick={onContact}
          className="eyebrow group flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-white/80 transition-colors hover:border-white/35 hover:text-white"
        >
          Contact
          <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </header>
  );
}
