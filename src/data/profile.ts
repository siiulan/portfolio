import uwaterlooLogo from "@/assets/schools/uwaterloo.svg";
import umdLogo from "@/assets/schools/umd.svg";
import tomatoFocus from "@/assets/projects/tomato-planet/01-focus-dark.jpg";
import tomatoThemes from "@/assets/projects/tomato-planet/02-themes.jpg";
import tomatoMusic from "@/assets/projects/tomato-planet/03-music.jpg";
import tomatoSettings from "@/assets/projects/tomato-planet/04-settings.jpg";

export const profile = {
  name: "Ryan (Zhiyue) Gao",
  short: "Ryan Gao",
  role: "Full-stack Engineer · Team Lead",
  company: "Evertz Microsystems",
  location: "Toronto, ON, Canada",
  email: "siiulan79@gmail.com",
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
  icon: "timer" | "palette" | "music" | "bell";
  title: string;
  text: string;
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
  shots: { src: string; caption: string }[];
};

// Add a project here and it appears on the Projects shelf; the first entry is shown first.
export const projects: Project[] = [
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
