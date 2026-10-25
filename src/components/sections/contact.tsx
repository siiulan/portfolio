import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy, MapPin } from "lucide-react";
import { profile } from "@/data/profile";
import { GithubIcon, LinkedinIcon, XIcon } from "../brand-icons";
import { Reveal } from "../motion";
import { SectionShell } from "../section-shell";

const socials = [
  { label: "LinkedIn", handle: "Ryan Gao", href: profile.links.linkedin, Icon: LinkedinIcon },
  { label: "GitHub", handle: "@siiulan", href: profile.links.github, Icon: GithubIcon },
  { label: "X", handle: "@ryangao20930214", href: profile.links.x, Icon: XIcon },
];

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <SectionShell index={3} label="Contact" title={<>Let's build something <span className="text-ember">more than great.</span></>}>
      <Reveal>
        <p className="mt-5 max-w-xl leading-relaxed text-white/75">
          I'm open to any project and work opportunities, and I am happy to connect and coffee chat with you, so feel free to reach out!
        </p>
      </Reveal>

      <Reveal className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <a
          href={`mailto:${profile.email}`}
          className="glass group flex flex-1 items-center justify-between gap-4 rounded-2xl px-5 py-5 transition-[border-color] duration-300 hover:border-white/25 sm:px-6"
        >
          <span>
            <span className="eyebrow block text-white/62">Email</span>
            <span className="mt-1.5 block text-lg font-medium tracking-tight break-all sm:text-2xl">
              {profile.email}
            </span>
          </span>
          <ArrowUpRight className="size-5 shrink-0 text-white/62 transition-[color,transform] duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ember" />
        </a>
        <button
          type="button"
          onClick={copy}
          className="glass flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm text-white/80 transition-[border-color,transform] duration-200 hover:border-white/25 active:scale-[0.98] sm:w-36"
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "done" : "copy"}
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 0.18 }}
            >
              {copied ? <Check className="size-4 text-ember" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy"}
            </motion.span>
          </AnimatePresence>
        </button>
      </Reveal>

      <Reveal className="mt-3 grid gap-3 sm:grid-cols-3">
        {socials.map(({ label, handle, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="glass group flex items-center gap-4 rounded-2xl px-5 py-4 transition-[border-color] duration-300 hover:border-white/25"
          >
            <Icon size={18} className="text-white/82 transition-colors duration-300 group-hover:text-white" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{label}</span>
              <span className="block truncate font-mono text-xs text-white/62">{handle}</span>
            </span>
            <ArrowUpRight className="size-4 text-white/50 transition-[color,transform] duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ember" />
          </a>
        ))}
      </Reveal>

      <Reveal className="mt-10 flex flex-col gap-2 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <span className="eyebrow flex items-center gap-2 text-white/62">
          <MapPin className="size-3.5" /> {profile.location}
        </span>
        <span className="eyebrow text-white/50">
          © {new Date().getFullYear()} {profile.short}
        </span>
      </Reveal>
    </SectionShell>
  );
}
