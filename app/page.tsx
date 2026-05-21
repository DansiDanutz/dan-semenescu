"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import qaData from "../data/qa.json";

type Project = { name: string; description: string; tag: string; href: string; priority?: boolean };
type Token = { text: string; cls?: string };
type Agent = { name: string; role: string; focus: string; color: string };

const agents: Agent[] = [
  { name: "David", role: "Orchestrator", focus: "Mac Studio · fleet command · lab-sync", color: "#22c55e" },
  { name: "Dexter", role: "Senior Dev", focus: "NERVIX backend · CrawdBot · DevOps", color: "#3b82f6" },
  { name: "Nano", role: "Agent Creator", focus: "NERVIX enrollment · agent factory", color: "#a855f7" },
  { name: "Memo", role: "Product Manager", focus: "MyWork framework · n8n automations", color: "#f97316" },
  { name: "Sienna", role: "Crypto Operator", focus: "ZmartyChat · OpenClaw trading", color: "#ec4899" },
  { name: "Hermes", role: "The Brain", focus: "Most capable model · paired hand-in-hand with OpenClaw", color: "#facc15" },
];

const projects: Project[] = [
  { name: "Nervix.ai", description: "Agent federation layer — enrollment, credentials, governance, observability across the fleet", tag: "★ PRIORITY · federation", href: "https://github.com/DansiDanutz/nervix-cli", priority: true },
  { name: "YouTube Studio", description: "Creator platform — AI content, scenes, captions, thumbnails · where attention compounds", tag: "★ GATEWAY · creator", href: "https://github.com/DansiDanutz/Youtube-Studio", priority: true },
  { name: "DansLab", description: "Multi-agent AI operating system — orchestration & fleet command", tag: "Python · MIT", href: "https://github.com/DansiDanutz/DansLab" },
  { name: "OpenClaw × Hermes", description: "Agent collective wired to the most capable brain — Sienna Crypto Girl posts 96.2% win rate", tag: "powered by Hermes", href: "https://github.com/DansiDanutz/hermes-agent" },
  { name: "MyWork-AI", description: "67+ CLI commands · AI code gen · n8n automation · marketplace", tag: "pip install mywork-ai", href: "https://github.com/DansiDanutz/MyWork-AI" },
  { name: "ZmartyChat", description: "AI crypto trading intelligence — signals, analysis, alerts", tag: "live · zmarty.vercel.app", href: "https://zmarty.vercel.app" },
];

const contacts: { label: string; value: string; href: string }[] = [
  { label: "github  ", value: "DansiDanutz", href: "https://github.com/DansiDanutz" },
  { label: "x       ", value: "@dansemenescu", href: "https://x.com/dansemenescu" },
  { label: "facebook", value: "dan.semenescu", href: "https://www.facebook.com/dan.semenescu/" },
  { label: "instagram", value: "d.semenescu", href: "https://www.instagram.com/d.semenescu/" },
  { label: "website ", value: "zmarty.vercel.app", href: "https://zmarty.vercel.app" },
  { label: "email   ", value: "semebitcoin@gmail.com", href: "mailto:semebitcoin@gmail.com" },
];

const bioTokens: Token[] = [
  { text: "Founder of " },
  { text: "DansLab", cls: "text-accent" },
  { text: " — a " },
  { text: "multi-agent AI architecture", cls: "text-accent" },
  { text: " where a named fleet (" },
  { text: "David, Dexter, Nano, Memo, Sienna", cls: "text-accent" },
  { text: ") plus " },
  { text: "Hermes", cls: "text-accent" },
  { text: " — the most capable brain, paired hand-in-hand with " },
  { text: "OpenClaw", cls: "text-accent" },
  { text: " — orchestrates real products under " },
  { text: "Stack Finance LLC", cls: "text-accent" },
  { text: ". Priorities: " },
  { text: "Nervix.ai", cls: "text-accent" },
  { text: " (federation) and " },
  { text: "YouTube Studio", cls: "text-accent" },
  { text: " (gateway)." },
];

const manifestoSections: { heading: string; body: string }[] = [
  {
    heading: "The thesis",
    body: "Most AI products treat agents as features. DansLab treats agents as employees. One operator plus a fleet of named AI agents can run a real company end-to-end — each agent owns a vertical, the operator directs strategy, and the lights stay on overnight.",
  },
  {
    heading: "The architecture",
    body: "Four layers stack together: a Tailscale-linked fleet of 8 machines as the substrate; a roster of named agents as the executive team; an OpenClaw collective handling trading and channel work; and a portfolio of shipping products on top — Nervix.ai, YouTube Studio, MyWork-AI, ZmartyChat.",
  },
  {
    heading: "The agents",
    body: "Each agent has a name, a personality, a home machine, and a GitHub workspace. David orchestrates from the Mac Studio. Dexter ships backend code. Memo runs PM and n8n flows. Nano enrolls new agents. Sienna runs the crypto vertical. And Hermes — the most capable brain in the fleet — works hand-in-hand with the OpenClaw collective. They coordinate, hand off, and ship — without daily babysitting.",
  },
  {
    heading: "The priorities",
    body: "Two surfaces lead the roadmap. Nervix.ai is the company's #1 priority — the federation layer where every agent enrolls, gets credentials, and is observed from one place. YouTube Studio is the gateway to success — the creator surface where DansLab meets the world and attention compounds into customers.",
  },
  {
    heading: "The stack",
    body: "Claude Code is the agent runtime. Python and TypeScript are the daily languages. n8n handles event-driven automation. Supabase plus Vercel run the web surfaces. The whole fleet sits behind Tailscale — no public ports, no SSH gymnastics, just `ssh dexter` and you're in.",
  },
  {
    heading: "The bet",
    body: "Stack Finance LLC is the legal wrapper; DansLab is the working prototype. By 2027, the most interesting companies won't be measured by headcount but by how well one operator plus a named fleet can coordinate. We're building the playbook for that — in public, in code, in production.",
  },
];

type BodyKind = "hero" | "bio" | "manifesto" | "agents" | "projects" | "contact";

type SectionDef = {
  id: string;
  prompt: string;
  tools: string[];
  bodyKind: BodyKind;
  bodySteps: number;
};

const sectionDefs: SectionDef[] = [
  { id: "who", prompt: "who is dan semenescu?", tools: ["Pinging github.com/DansiDanutz", "Loading avatar", "Resolving Stack Finance LLC"], bodyKind: "hero", bodySteps: 5 },
  { id: "bg", prompt: "cat about.md", tools: ["Reading about.md", "Compiling DansLab manifest"], bodyKind: "bio", bodySteps: bioTokens.length },
  { id: "danslab", prompt: "cat ~/danslab/MANIFESTO.md", tools: ["Reading MANIFESTO.md", "Loading company architecture", "Stamping Stack Finance LLC"], bodyKind: "manifesto", bodySteps: manifestoSections.length },
  { id: "agents", prompt: "ls ~/danslab/agents/", tools: ["Connecting to david@mac-studio", "Waking hermes", "Loading agent registry"], bodyKind: "agents", bodySteps: agents.length },
  { id: "projects", prompt: "ls ~/danslab/projects/ --sort=priority", tools: ["Fetching repos from github.com/DansiDanutz", "Loading metadata", "Sorting by priority"], bodyKind: "projects", bodySteps: projects.length },
  { id: "contact", prompt: "cat contact.txt", tools: ["Reading contact.txt", "Validating links"], bodyKind: "contact", bodySteps: contacts.length },
];

type SectionState = {
  promptChars: number;
  toolsDone: number;
  toolsCollapsed: boolean;
  bodySteps: number;
  done: boolean;
};

const emptyState = (): SectionState => ({
  promptChars: 0,
  toolsDone: 0,
  toolsCollapsed: false,
  bodySteps: 0,
  done: false,
});

const fullState = (def: SectionDef): SectionState => ({
  promptChars: def.prompt.length,
  toolsDone: def.tools.length,
  toolsCollapsed: true,
  bodySteps: def.bodySteps,
  done: true,
});

const STORAGE_KEY = "danslab-portfolio-played-v3";

// ---------- icons ----------
function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden>
      <path d="M12 .5C5.7.5.5 5.7.5 12.1c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
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
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden>
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.19 2.24.19v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-5" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
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
  { href: "https://github.com/DansiDanutz", label: "GitHub", icon: <IconGitHub /> },
  { href: "https://x.com/dansemenescu", label: "X", icon: <IconX /> },
  { href: "https://www.facebook.com/dan.semenescu/", label: "Facebook", icon: <IconFacebook /> },
  { href: "https://www.instagram.com/d.semenescu/", label: "Instagram", icon: <IconInstagram /> },
  { href: "https://zmarty.vercel.app", label: "ZmartyChat", icon: <IconGlobe /> },
  { href: "mailto:semebitcoin@gmail.com", label: "Email", icon: <IconMail /> },
];

// ---------- animation atoms ----------
const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

function Spinner() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % SPINNER_FRAMES.length), 80);
    return () => window.clearInterval(id);
  }, []);
  return <span className="text-accent">{SPINNER_FRAMES[i]}</span>;
}

function Cursor() {
  return <span className="inline-block h-4 w-2 -mb-0.5 ml-0.5 bg-accent cursor-blink align-baseline" aria-hidden />;
}

function ToolBlock({ def, state, instant }: { def: SectionDef; state: SectionState; instant: boolean }) {
  const allDone = state.toolsDone >= def.tools.length;
  const [collapsed, setCollapsed] = useState(false);
  const prevCollapseRef = useRef(state.toolsCollapsed);

  useEffect(() => {
    if (instant) {
      setCollapsed(true);
      prevCollapseRef.current = true;
      return;
    }
    if (state.toolsCollapsed && !prevCollapseRef.current) {
      setCollapsed(true);
    }
    prevCollapseRef.current = state.toolsCollapsed;
  }, [state.toolsCollapsed, instant]);

  if (collapsed && allDone) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="text-dim text-sm hover:text-foreground transition-colors flex items-center gap-2"
      >
        <span className="text-success">●</span>
        <span>{def.tools.length} tool uses</span>
        <span className="text-dim/70">▸</span>
      </button>
    );
  }

  const visibleCount = allDone ? def.tools.length : Math.min(state.toolsDone + 1, def.tools.length);

  return (
    <div className="text-sm space-y-1 text-dim">
      {allDone && (
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <span className="text-success">●</span>
          <span>{def.tools.length} tool uses</span>
          <span className="text-dim/70">▾</span>
        </button>
      )}
      {def.tools.slice(0, visibleCount).map((t, i) => {
        const done = i < state.toolsDone;
        return (
          <div key={i} className="flex items-center gap-2 pl-1">
            <span className="w-3 inline-block">
              {done ? <span className="text-success">✓</span> : <Spinner />}
            </span>
            <span>{t}</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------- body renderers ----------
function HeroBody({ step, streamingCursor }: { step: number; streamingCursor: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-start">
      {step >= 1 && (
        <div className="shrink-0 flex flex-col items-center gap-3">
          <div className="avatar-ring size-40 sm:size-52 rounded-full p-[3px]">
            <div className="size-full rounded-full overflow-hidden bg-background">
              <Image
                src="/dan.jpeg"
                alt="Dan Semenescu"
                width={208}
                height={208}
                priority
                className="size-full object-cover"
              />
            </div>
          </div>
          <span className="text-muted text-xs">dan.jpeg</span>
        </div>
      )}
      <div className="space-y-4 sm:pt-2 min-h-[12rem]">
        {step >= 2 && (
          <h1 className="text-4xl sm:text-6xl font-bold tracking-wide text-foreground">DAN SEMENESCU</h1>
        )}
        {step >= 3 && <p className="text-success text-xl sm:text-2xl">Founder, DansLab — Multi-Agent AI Architecture</p>}
        {step >= 4 && (
          <p className="text-lg max-w-xl text-foreground/95 leading-relaxed">
            Building <span className="text-accent">named AI agent fleets</span> that orchestrate, ship, and operate real products.
          </p>
        )}
        {step >= 5 && (
          <>
            <p className="text-dim text-sm">// Cluj-Napoca, Romania · Stack Finance LLC</p>
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
          </>
        )}
        {streamingCursor && step < 5 && <Cursor />}
      </div>
    </div>
  );
}

function BioBody({ step, streamingCursor }: { step: number; streamingCursor: boolean }) {
  return (
    <p className="text-base sm:text-lg leading-loose max-w-3xl">
      {bioTokens.slice(0, step).map((t, i) => (
        <span key={i} className={t.cls}>
          {t.text}
        </span>
      ))}
      {streamingCursor && <Cursor />}
    </p>
  );
}

function ManifestoBody({ step, streamingCursor }: { step: number; streamingCursor: boolean }) {
  return (
    <div className="space-y-6 max-w-3xl">
      {manifestoSections.slice(0, step).map((s, i) => (
        <div key={s.heading} className="space-y-2">
          <h3 className="text-highlight text-xs uppercase tracking-[0.18em]">{s.heading}</h3>
          <p className="text-base sm:text-lg leading-relaxed text-foreground/95">{s.body}</p>
          {streamingCursor && i === step - 1 && step < manifestoSections.length && <Cursor />}
        </div>
      ))}
    </div>
  );
}

function AgentsBody({ step, streamingCursor }: { step: number; streamingCursor: boolean }) {
  return (
    <ul className="space-y-3 text-base sm:text-lg">
      {agents.slice(0, step).map((a, i) => (
        <li key={a.name} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
          <span className="shrink-0 flex items-center gap-2.5 min-w-[9rem]">
            <span
              className="size-2.5 rounded-full"
              style={{ background: a.color, boxShadow: `0 0 12px ${a.color}` }}
              aria-hidden
            />
            <span className="font-semibold" style={{ color: a.color }}>{a.name}</span>
            <span className="text-dim text-sm">{a.role}</span>
          </span>
          <span className="text-foreground/90">— {a.focus}</span>
          {streamingCursor && i === step - 1 && step < agents.length && <Cursor />}
        </li>
      ))}
    </ul>
  );
}

function ProjectsBody({ step, streamingCursor }: { step: number; streamingCursor: boolean }) {
  return (
    <ul className="space-y-3 text-base sm:text-lg">
      {projects.slice(0, step).map((p, i) => (
        <li key={p.name} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
          <a
            href={p.href}
            target="_blank"
            rel="noreferrer noopener"
            className="text-highlight hover:underline shrink-0"
          >
            {p.name}
          </a>
          <span className="text-foreground/90">— {p.description}</span>
          <span className={`${p.priority ? "text-highlight font-semibold" : "text-muted"} text-xs sm:ml-auto shrink-0`}>
            {p.tag}
          </span>
          {streamingCursor && i === step - 1 && step < projects.length && <Cursor />}
        </li>
      ))}
    </ul>
  );
}

function ContactBody({ step, streamingCursor }: { step: number; streamingCursor: boolean }) {
  return (
    <ul className="space-y-2 text-base sm:text-lg">
      {contacts.slice(0, step).map((c, i) => (
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
          {streamingCursor && i === step - 1 && step < contacts.length && <Cursor />}
        </li>
      ))}
    </ul>
  );
}

function renderBody(def: SectionDef, state: SectionState, isActive: boolean) {
  const streamingCursor = isActive && state.bodySteps < def.bodySteps;
  switch (def.bodyKind) {
    case "hero":
      return <HeroBody step={state.bodySteps} streamingCursor={streamingCursor} />;
    case "bio":
      return <BioBody step={state.bodySteps} streamingCursor={streamingCursor} />;
    case "manifesto":
      return <ManifestoBody step={state.bodySteps} streamingCursor={streamingCursor} />;
    case "agents":
      return <AgentsBody step={state.bodySteps} streamingCursor={streamingCursor} />;
    case "projects":
      return <ProjectsBody step={state.bodySteps} streamingCursor={streamingCursor} />;
    case "contact":
      return <ContactBody step={state.bodySteps} streamingCursor={streamingCursor} />;
  }
}

// ---------- chat ----------
type QAEntry = { patterns: string[]; answer: string };
const qa = qaData as QAEntry[];

const FALLBACK_ANSWER =
  "I don't have a canned answer for that one. Try asking about DansLab, Nervix.ai, YouTube Studio, Hermes, the agent fleet, OpenClaw, availability, or my stack. For anything else, email semebitcoin@gmail.com.";

function tokenize(text: string): string[] {
  return text.match(/\S+\s*/g) ?? [text];
}

function findAnswer(question: string): string {
  for (const entry of qa) {
    for (const pattern of entry.patterns) {
      try {
        if (new RegExp(pattern, "i").test(question)) return entry.answer;
      } catch {
        // skip invalid regex silently
      }
    }
  }
  return FALLBACK_ANSWER;
}

type HistoryItem = { id: number; q: string; words: string[]; shown: number };

function ChatPrompt({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-accent">
      $ ask&gt; <span className="text-foreground">{children}</span>
    </span>
  );
}

function ChatInterface() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<{ cancelled: boolean }>({ cancelled: false });
  const idRef = useRef(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [history]);

  useEffect(() => {
    return () => {
      streamRef.current.cancelled = true;
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    setValue("");

    const answer = findAnswer(q);
    const words = tokenize(answer);
    const id = ++idRef.current;
    setHistory((prev) => [...prev, { id, q, words, shown: 0 }]);

    streamRef.current.cancelled = true;
    const token = { cancelled: false };
    streamRef.current = token;

    (async () => {
      const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
      for (let s = 1; s <= words.length; s++) {
        if (token.cancelled) return;
        await sleep(45);
        setHistory((prev) => prev.map((h) => (h.id === id ? { ...h, shown: s } : h)));
      }
    })();
  };

  return (
    <div className="space-y-6 pt-2">
      {history.map((h) => {
        const streaming = h.shown < h.words.length;
        return (
          <div key={h.id} className="space-y-2 text-base sm:text-lg">
            <div>
              <ChatPrompt>{h.q}</ChatPrompt>
            </div>
            <p className="pl-6 text-foreground leading-relaxed max-w-3xl">
              {h.words.slice(0, h.shown).join("")}
              {streaming && <Cursor />}
            </p>
          </div>
        );
      })}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 text-base sm:text-lg">
        <span className="text-accent shrink-0">$ ask&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-label="Ask a question about Dan"
          className="flex-1 bg-transparent outline-none border-none text-foreground caret-accent placeholder:text-muted"
          placeholder="ask me anything…"
        />
      </form>

      <div ref={bottomRef} />
    </div>
  );
}

function SectionView({ def, state, isActive, instant }: { def: SectionDef; state: SectionState; isActive: boolean; instant: boolean }) {
  const promptDone = state.promptChars >= def.prompt.length;
  const showTools = promptDone;
  const showBody = state.toolsCollapsed;

  return (
    <section className="space-y-6">
      <h2 className="flex items-baseline gap-3 text-base sm:text-lg">
        <span className="text-accent">&gt;</span>
        <span className="text-accent">
          {def.prompt.slice(0, state.promptChars)}
          {isActive && !promptDone && <Cursor />}
        </span>
      </h2>
      <div className="border-l border-border/80 pl-6 sm:pl-8 space-y-4">
        {showTools && <ToolBlock def={def} state={state} instant={instant} />}
        {showBody && renderBody(def, state, isActive)}
      </div>
    </section>
  );
}

// ---------- page ----------
export default function Home() {
  const [states, setStates] = useState<SectionState[]>(() => sectionDefs.map(emptyState));
  const [activeIdx, setActiveIdx] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [instant, setInstant] = useState(false);
  const startedRef = useRef(false);
  const cancelRef = useRef<{ cancelled: boolean }>({ cancelled: false });

  const startSequence = useCallback(() => {
    cancelRef.current.cancelled = true;
    const token = { cancelled: false };
    cancelRef.current = token;

    setInstant(false);
    setAllDone(false);
    setActiveIdx(0);
    setStates(sectionDefs.map(emptyState));

    const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
    const update = (i: number, patch: Partial<SectionState>) =>
      setStates((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

    (async () => {
      for (let i = 0; i < sectionDefs.length; i++) {
        if (token.cancelled) return;
        setActiveIdx(i);
        const def = sectionDefs[i];

        for (let c = 1; c <= def.prompt.length; c++) {
          if (token.cancelled) return;
          await sleep(18);
          update(i, { promptChars: c });
        }
        await sleep(140);

        for (let t = 1; t <= def.tools.length; t++) {
          if (token.cancelled) return;
          await sleep(260);
          update(i, { toolsDone: t });
        }
        await sleep(180);
        if (token.cancelled) return;
        update(i, { toolsCollapsed: true });
        await sleep(120);

        const stepDelay = def.bodyKind === "bio" ? 45 : def.bodyKind === "manifesto" ? 280 : 60;
        for (let s = 1; s <= def.bodySteps; s++) {
          if (token.cancelled) return;
          await sleep(stepDelay);
          update(i, { bodySteps: s });
        }
        update(i, { done: true });
        await sleep(160);
      }
      if (token.cancelled) return;
      setActiveIdx(sectionDefs.length);
      setAllDone(true);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let played = false;
    try {
      played = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // localStorage may be unavailable (e.g. some private modes)
    }

    if (reduced || played) {
      setInstant(true);
      setStates(sectionDefs.map(fullState));
      setActiveIdx(sectionDefs.length);
      setAllDone(true);
      return;
    }

    startSequence();

    return () => {
      cancelRef.current.cancelled = true;
    };
  }, [startSequence]);

  const handleNewSession = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    startSequence();
  };

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
            <span className="text-dim text-sm hidden sm:inline">dan@danslab &mdash; ~/profile</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleNewSession}
              className="rounded border border-accent/70 px-3 py-1 text-accent text-xs sm:text-sm hover:bg-accent/10 transition-colors cursor-pointer"
            >
              new session
            </button>
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
          {sectionDefs.map((def, i) => {
            const visible = instant || i <= activeIdx;
            if (!visible) return null;
            const state = states[i];
            const isActive = !instant && i === activeIdx && !state.done;
            return <SectionView key={def.id} def={def} state={state} isActive={isActive} instant={instant} />;
          })}

          {allDone && <ChatInterface />}
        </div>
      </div>
    </main>
  );
}
