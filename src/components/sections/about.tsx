import { ArrowUpRight } from "lucide-react";
import { about, stack } from "@/data/profile";
import { Reveal } from "../motion";
import { SectionShell, SectionTitle } from "../section-shell";

export function About() {
  return (
    <SectionShell index={1} label="About">
      {/* Title lives in the left column so the right column's top lines up with it. */}
      <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="space-y-5">
          <SectionTitle className="mb-8">{about.title}</SectionTitle>

          {about.paragraphs.map((p) => (
            <Reveal key={p}>
              <p className="max-w-xl leading-relaxed text-white/80">{p}</p>
            </Reveal>
          ))}

          <Reveal>
            <ul className="flex flex-wrap gap-2">
              {about.highlights.map((p) => (
                <li
                  key={p}
                  className="rounded-full border border-ember/30 bg-ember/[0.06] px-3 py-1.5 text-xs text-ember/90"
                >
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="space-y-5">
          <Reveal className="grid gap-3 sm:grid-cols-2">
            {about.education.map((e) => (
              <a
                key={e.school}
                href={e.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${e.school} on LinkedIn`}
                className="group flex items-center gap-3 rounded-xl border border-white/[0.06] p-3 transition-colors duration-300 hover:border-white/15 hover:bg-white/[0.03]"
              >
                <img
                  src={e.logo}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 shrink-0 object-contain transition-transform duration-300 ease-out-expo group-hover:scale-105"
                />
                <span className="min-w-0 flex-1">
                  <span className="eyebrow flex items-center justify-between gap-2 text-white/62">
                    {e.years}
                    <ArrowUpRight className="size-3.5 text-white/40 transition-[color,transform] duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ember" />
                  </span>
                  <span className="mt-1.5 block text-sm font-medium">{e.degree}</span>
                  <span className="block text-sm text-white/70">{e.school}</span>
                </span>
              </a>
            ))}
          </Reveal>

          <Reveal className="glass rounded-2xl p-5">
            <p className="eyebrow text-white/62">Stack</p>
            <div className="mt-4 divide-y divide-white/[0.06]">
              {stack.map((g) => (
                <div key={g.group} className="grid gap-2 py-3 first:pt-0 last:pb-0 sm:grid-cols-[110px_1fr]">
                  <p className="text-sm text-white/65">{g.group}</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {g.items.map((s) => (
                      <li
                        key={s}
                        className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-xs text-white/80"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
