import Image from "next/image";
import type { ReactNode } from "react";

type Project = {
  name: string;
  description: string;
  stars: number;
};

const skills: { label: string; items: string }[] = [
  { label: "AI", items: "AI agents, LangChain, n8n, Flowise" },
  { label: "Agentic", items: "Claude Code, Codex, Cursor" },
  { label: "Languages", items: "TypeScript, JavaScript, Python" },
  { label: "Web", items: "Next.js, React, full-stack web dev" },
];

const projects: Project[] = [
  { name: "agentic-coding-starter-kit", description: "Foundation for building agent-based coding systems", stars: 380 },
  { name: "autonomous-coding", description: "Framework for self-directed coding applications", stars: 170 },
  { name: "langchain-js", description: "LangChain JS course materials and examples", stars: 113 },
  { name: "flowise-masterclass-2025", description: "Flowise course — visual LLM workflow builder", stars: 85 },
  { name: "n8n-workflows", description: "Automation workflow templates for n8n", stars: 83 },
  { name: "localforge", description: "Local dev and deployment tooling", stars: 78 },
];

const contacts: { label: string; value: string; href: string }[] = [
  { label: "youtube ", value: "@leonvanzyl", href: "https://youtube.com/@leonvanzyl" },
  { label: "github  ", value: "leonvanzyl", href: "https://github.com/leonvanzyl" },
  { label: "x       ", value: "@leonvz", href: "https://x.com/leonvz" },
  { label: "website ", value: "leonvanzyl.com", href: "https://leonvanzyl.com" },
  { label: "email   ", value: "leon.vanzyl@gmail.com", href: "mailto:leon.vanzyl@gmail.com" },
];

function Prompt({ children }: { children: ReactNode }) {
  return (
    <h2 className="flex items-baseline gap-3 text-base sm:text-lg">
      <span className="text-accent">&gt;</span>
      <span className="text-accent">{children}</span>
    </h2>
  );
}

function Section({ prompt, children }: { prompt: string; children: ReactNode }) {
  return (
    <section className="space-y-6">
      <Prompt>{prompt}</Prompt>
      <div className="border-l border-border/80 pl-6 sm:pl-8">{children}</div>
    </section>
  );
}

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden>
      <path d="M12 .5C5.7.5.5 5.7.5 12.1c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  );
}
function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden>
      <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5C.1 8.4.1 12 .1 12s0 3.6.4 5.5a3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1c.4-1.9.4-5.5.4-5.5s0-3.6-.4-5.5zM9.7 15.6V8.4l6.3 3.6-6.3 3.6z" />
    </svg>
  );
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden>
      <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.94l-4.53-6.04L5.7 22H3l7.04-8.05L1.5 2h7.06l4.1 5.49L18.244 2zm-2.43 18h1.87L7.27 4H5.28l10.534 16z" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-5" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-5" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 7 9-7" />
    </svg>
  );
}

const socials = [
  { href: "https://github.com/leonvanzyl", label: "GitHub", icon: <IconGitHub /> },
  { href: "https://youtube.com/@leonvanzyl", label: "YouTube", icon: <IconYouTube /> },
  { href: "https://x.com/leonvz", label: "X", icon: <IconX /> },
  { href: "https://leonvanzyl.com", label: "Website", icon: <IconGlobe /> },
  { href: "mailto:leon.vanzyl@gmail.com", label: "Email", icon: <IconMail /> },
];

export default function Home() {
  return (
    <main className="flex-1 bg-background p-3 sm:p-5">
      <div className="min-h-[calc(100vh-1.5rem)] sm:min-h-[calc(100vh-2.5rem)] rounded-lg border border-border flex flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border px-4 sm:px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#ff5f57]" aria-hidden />
              <span className="size-3 rounded-full bg-[#febc2e]" aria-hidden />
              <span className="size-3 rounded-full bg-[#28c840]" aria-hidden />
            </div>
            <span className="text-dim text-sm hidden sm:inline">
              leon@terminal &mdash; 0:45
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded border border-accent/70 px-3 py-1 text-accent text-xs sm:text-sm">
              new session
            </span>
            <span className="rounded border border-border px-2 py-1 text-dim text-xs hidden sm:inline-block">
              Ctrl+K
            </span>
            <span className="flex items-center gap-2 text-dim text-xs sm:text-sm">
              <span className="size-2 rounded-full bg-success" aria-hidden />
              online
            </span>
          </div>
        </header>

        <div className="flex-1 px-5 sm:px-12 py-10 sm:py-14 space-y-14">
          <Section prompt="who is leon van zyl?">
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-start">
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div className="size-40 sm:size-52 rounded-full overflow-hidden border border-accent/70 shadow-[0_0_80px_-15px_rgba(245,158,11,0.55)]">
                  <Image
                    src="/leon.jpeg"
                    alt="Leon van Zyl"
                    width={208}
                    height={208}
                    priority
                    className="size-full object-cover"
                  />
                </div>
                <span className="text-muted text-xs">leon.jpeg</span>
              </div>
              <div className="space-y-4 sm:pt-2">
                <h1 className="text-4xl sm:text-6xl font-bold tracking-wide text-foreground">
                  LEON VAN ZYL
                </h1>
                <p className="text-success text-xl sm:text-2xl">AI Engineer</p>
                <p className="text-lg max-w-xl text-foreground/95 leading-relaxed">
                  Building <span className="text-accent">AI agents</span> that
                  think, plan, and ship autonomously.
                </p>
                <p className="text-dim text-sm">// Mosselbay, South Africa</p>
                <div className="flex gap-5 pt-2 text-dim">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noreferrer noopener"
                      aria-label={s.label}
                      className="hover:text-accent transition-colors"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section prompt="tell me more about his background">
            <p className="text-base sm:text-lg leading-loose max-w-3xl">
              AI Engineer specializing in{" "}
              <span className="text-accent">autonomous systems</span> and{" "}
              <span className="text-accent">agentic coding</span> workflows. He
              builds <span className="text-accent">AI agents</span> that go
              beyond chat &mdash; they think, plan, and ship code autonomously,
              using tools like <span className="text-accent">LangChain</span>,{" "}
              <span className="text-accent">n8n</span>, and{" "}
              <span className="text-accent">Claude Code</span>. Through his
              YouTube channel he ships step-by-step tutorials that help
              developers build real-world AI &mdash; with both code and
              no-code tools.
            </p>
          </Section>

          <Section prompt="cat skills.txt">
            <ul className="space-y-2 text-base sm:text-lg">
              {skills.map((s) => (
                <li key={s.label}>
                  <span className="text-highlight">
                    {s.label.padEnd(11, " ")}
                  </span>
                  <span>{s.items}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section prompt="ls projects/">
            <ul className="space-y-3 text-base sm:text-lg">
              {projects.map((p) => (
                <li
                  key={p.name}
                  className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4"
                >
                  <a
                    href={`https://github.com/leonvanzyl/${p.name}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-highlight hover:underline shrink-0"
                  >
                    {p.name}
                  </a>
                  <span className="text-foreground/90">
                    &mdash; {p.description}
                  </span>
                  <span className="text-muted text-xs sm:ml-auto shrink-0">
                    ★ {p.stars}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          <Section prompt="cat contact.txt">
            <ul className="space-y-2 text-base sm:text-lg">
              {contacts.map((c) => (
                <li key={c.label}>
                  <span className="text-dim">{c.label}</span>{" "}
                  <a
                    href={c.href}
                    target={c.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer noopener"
                    className="text-highlight hover:underline"
                  >
                    {c.value}
                  </a>
                </li>
              ))}
            </ul>
          </Section>

          <div className="flex items-center gap-3 pt-2 text-lg">
            <span className="text-accent">&gt;</span>
            <span className="inline-block h-5 w-2.5 bg-accent" aria-hidden />
          </div>
        </div>
      </div>
    </main>
  );
}
