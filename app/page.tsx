"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import qaData from "../data/qa.json";

type Project = { name: string; description: string; stars: number };
type Token = { text: string; cls?: string };

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

const bioTokens: Token[] = [
  { text: "AI Engineer specializing in " },
  { text: "autonomous systems", cls: "text-accent" },
  { text: " and " },
  { text: "agentic coding", cls: "text-accent" },
  { text: " workflows. He builds " },
  { text: "AI agents", cls: "text-accent" },
  { text: " that go beyond chat — they think, plan, and ship code autonomously, using tools like " },
  { text: "LangChain", cls: "text-accent" },
  { text: ", " },
  { text: "n8n", cls: "text-accent" },
  { text: ", and " },
  { text: "Claude Code", cls: "text-accent" },
  { text: ". Through his YouTube channel he ships step-by-step tutorials that help developers build real-world AI — with both code and no-code tools." },
];

type BodyKind = "hero" | "bio" | "skills" | "projects" | "contact";

type SectionDef = {
  id: string;
  prompt: string;
  tools: string[];
  bodyKind: BodyKind;
  bodySteps: number;
};

const sectionDefs: SectionDef[] = [
  { id: "who", prompt: "who is leon van zyl?", tools: ["Reading profile.md", "Loading avatar.jpeg", "Resolving location"], bodyKind: "hero", bodySteps: 5 },
  { id: "bg", prompt: "tell me more about his background", tools: ["Reading bio.md", "Compiling highlights"], bodyKind: "bio", bodySteps: bioTokens.length },
  { id: "skills", prompt: "cat skills.txt", tools: ["Reading skills.json", "Parsing skills.json", "Sorting by relevance"], bodyKind: "skills", bodySteps: skills.length },
  { id: "projects", prompt: "ls projects/", tools: ["Fetching projects from GitHub…", "Loading metadata", "Sorting by stars"], bodyKind: "projects", bodySteps: projects.length },
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

const STORAGE_KEY = "phase1-played";

// ---------- icons ----------
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
      )}
      <div className="space-y-4 sm:pt-2 min-h-[12rem]">
        {step >= 2 && (
          <h1 className="text-4xl sm:text-6xl font-bold tracking-wide text-foreground">LEON VAN ZYL</h1>
        )}
        {step >= 3 && <p className="text-success text-xl sm:text-2xl">AI Engineer</p>}
        {step >= 4 && (
          <p className="text-lg max-w-xl text-foreground/95 leading-relaxed">
            Building <span className="text-accent">AI agents</span> that think, plan, and ship autonomously.
          </p>
        )}
        {step >= 5 && (
          <>
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

function SkillsBody({ step, streamingCursor }: { step: number; streamingCursor: boolean }) {
  return (
    <ul className="space-y-2 text-base sm:text-lg">
      {skills.slice(0, step).map((s, i) => (
        <li key={s.label}>
          <span className="text-highlight">{s.label.padEnd(11, " ")}</span>
          <span>{s.items}</span>
          {streamingCursor && i === step - 1 && step < skills.length && <Cursor />}
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
            href={`https://github.com/leonvanzyl/${p.name}`}
            target="_blank"
            rel="noreferrer noopener"
            className="text-highlight hover:underline shrink-0"
          >
            {p.name}
          </a>
          <span className="text-foreground/90">— {p.description}</span>
          <span className="text-muted text-xs sm:ml-auto shrink-0">★ {p.stars}</span>
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
    case "skills":
      return <SkillsBody step={state.bodySteps} streamingCursor={streamingCursor} />;
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
  "I don't have a canned answer for that one. Try asking about my background, tech stack, projects, availability, rates, location, or how to get in touch. For anything else, email leon.vanzyl@gmail.com.";

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
          aria-label="Ask a question about Leon"
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

        const stepDelay = def.bodyKind === "bio" ? 45 : 60;
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
            <span className="text-dim text-sm hidden sm:inline">leon@terminal &mdash; 0:45</span>
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
