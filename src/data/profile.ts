import uwaterlooLogo from "@/assets/schools/uwaterloo.svg";
import umdLogo from "@/assets/schools/umd.svg";
import tomatoFocus from "@/assets/projects/tomato-planet/01-focus-dark.jpg";
import tomatoThemes from "@/assets/projects/tomato-planet/02-themes.jpg";
import tomatoMusic from "@/assets/projects/tomato-planet/03-music.jpg";
import tomatoSettings from "@/assets/projects/tomato-planet/04-settings.jpg";
import wwgIntro from "@/assets/projects/wealthwego/00-intro.mp4";
import wwgIntroPoster from "@/assets/projects/wealthwego/00-intro-poster.webp";
import wwgIntroCaptions from "@/assets/projects/wealthwego/00-intro.en.vtt?url";
import wwgHome from "@/assets/projects/wealthwego/01-home.jpg";
import wwgGrow from "@/assets/projects/wealthwego/02-grow.jpg";
import wwgBudget from "@/assets/projects/wealthwego/03-budget.jpg";
import wwgRule from "@/assets/projects/wealthwego/04-rule.jpg";

export const profile = {
  name: "Ryan (Zhiyue) Gao",
  short: "Ryan Gao",
  role: "Full-stack Engineer · Team Lead",
  company: "Evertz Microsystems",
  location: "Toronto, ON, Canada",
  email: "ryancanusemuse@gmail.com",
  links: {
    github: "https://github.com/siiulan",
    linkedin: "https://www.linkedin.com/in/ryan-gao-752a3715a/",
    x: "https://x.com/ryangao20930214",
  },
};

export const heroStats = [
  { value: "NAB · IBC", label: "Product launches at broadcast's two biggest shows" },
  { value: "7", label: "Customer-facing production-level web applications designed, built, and maintained" },
  { value: "5", label: "Engineering team members mentored and managed" },
  { value: "< 3 yrs", label: "from my first line of code to a intermediate engineer and a team lead" },
];

export const about = {
  title: "A pioneer in advanced display and technology",
  paragraphs: [
    "I joined Evertz in 2023 as an entry-level engineer in the embedded systems department, where I was assigned multiple tasks to help the department adopt the latest technologies, such as cloud solutions and advanced displays.",
    "From there, starting from nothing, I designed and built our team's infrastructure and framework, and brought my work into production applications. Through this experience, I grew across multiple technical areas and was promoted to team lead.",
  ],
  highlights: ["Team Infrastructure Architect", "System Designer", "Project management & Leadership", "Mentorship & Coaching", "Full-stack Development", "AI Engineering"],
  education: [
    {
      degree: "M.Eng, Electrical & Computer Engineering",
      school: "University of Waterloo",
      years: "2021 – 2023",
      logo: uwaterlooLogo,
      href: "https://www.linkedin.com/school/uwaterloo/",
    },
    {
      degree: "B.S., Computer Science",
      school: "University of Maryland, College Park",
      years: "2017 – 2021",
      logo: umdLogo,
      href: "https://www.linkedin.com/school/university-of-maryland/",
    },
  ],
};

export const stack = [
  {
    group: "Front-end",
    items: ["Angular", "RxJS", "TypeScript", "React", "D3.js", "Angular Elements", "SASS"],
  },
  {
    group: "Back-end",
    items: ["PHP", "Node.js", "REST", "PostgreSQL", "MySQL", "C++"],
  },
  {
    group: "Cloud & DevOps",
    items: ["AWS", "Terraform", "Docker", "Jenkins CI/CD"],
  },
  {
    group: "Design & AI",
    items: ["Figma", "Claude Code", "AI agents"],
  },
];

export type ProjectFeature = {
  icon: "timer" | "palette" | "music" | "bell" | "chart" | "wallet" | "scale" | "shield";
  title: string;
  text: string;
};

export type ProjectMedia = {
  src: string;
  caption: string;
  video?: { poster: string; captions?: string };
};

export type Project = {
  id: string;
  name: string;
  kind: string;
  year: string;
  tagline: string;
  description: string;
  features: ProjectFeature[];
  tech: string[];
  links: { live?: string; source?: string };
  /** Shows a "How it's built" button that opens the project's detail view (#projects/<id>). */
  caseStudy?: boolean;
  /** Images cycle on a timer; a video plays through, then the carousel moves on. */
  shots: ProjectMedia[];
};

// Add a project here and it appears on the Projects shelf; the first entry is shown first.
export const projects: Project[] = [
  {
    id: "wealthwego",
    name: "WealthWeGo",
    kind: "Full-stack web app",
    year: "2026",
    tagline: "Production-grade personal finance, at $0 a month.",
    description:
      "A free money planner for Canada and the US that I designed, built and run end to end: React on the front, an API on Cloudflare's edge, and real market history underneath. Private by default.",
    features: [
      { icon: "chart", title: "Monte Carlo on real history", text: "2,000 simulated paths, rough to great years" },
      { icon: "wallet", title: "Budget with a cushion", text: "Emergency fund first, then invest the rest" },
      { icon: "scale", title: "Seven famous rules", text: "Compare a budget with 50/30/20 and more" },
      { icon: "shield", title: "Private by default", text: "No sign-up; optional encrypted Google sync" },
    ],
    tech: ["React 19", "TypeScript", "Hono API", "Cloudflare Workers", "D1 · Drizzle", "Playwright", "GitHub Actions"],
    links: { live: "https://wealthwego.siiulan.dev" },
    caseStudy: true,
    shots: [
      { src: wwgIntro, caption: "25-second product tour", video: { poster: wwgIntroPoster, captions: wwgIntroCaptions } },
      { src: wwgHome, caption: "Home · free, no sign-up" },
      { src: wwgGrow, caption: "Grow · Monte Carlo on 20 years of history" },
      { src: wwgBudget, caption: "Budget · cushion first, then invest" },
      { src: wwgRule, caption: "Rule · your budget vs 50/30/20" },
    ],
  },
  {
    id: "tomato-planet",
    name: "Tomato Planet",
    kind: "Productivity web app",
    year: "2025",
    tagline: "A focus timer that sets the mood.",
    description:
      "A Pomodoro-style focus app I designed and built end to end: a customizable focus and rest timer, wrapped in immersive themes, with a built-in music player to keep you in flow.",
    features: [
      { icon: "timer", title: "Focus & rest cycles", text: "Custom durations, saved between visits" },
      { icon: "palette", title: "Immersive themes", text: "Minimal, gradient and video backdrops" },
      { icon: "music", title: "Built-in music player", text: "Queue YouTube tracks into a playlist" },
      { icon: "bell", title: "Smart cues", text: "Sound alerts and a live countdown in the tab" },
    ],
    tech: ["Angular 17", "RxJS", "TypeScript", "Angular Material", "SCSS", "YouTube IFrame API"],
    links: {
      live: "https://siiulan.github.io/tomato-planet-web-app/",
      source: "https://github.com/siiulan/tomato-planet-web-app",
    },
    shots: [
      { src: tomatoFocus, caption: "Focus session · Black Mamba theme" },
      { src: tomatoThemes, caption: "Theme picker · Illume" },
      { src: tomatoMusic, caption: "Music player & playlist" },
      { src: tomatoSettings, caption: "Custom focus & rest times" },
    ],
  },
];

/** Shows a "More projects in progress" slot at the end of the shelf. */
export const moreInProgress = true;
