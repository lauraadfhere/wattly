"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  BALLIAI_MAX_MESSAGE,
  balliaiLevels,
  balliaiModes,
  type BalliaiLevel,
  type BalliaiMessage,
  type BalliaiMode,
} from "@/lib/balliai";

type BalliaiChatProps = {
  lesson?: { title: string; kind: "activity" | "story" } | null;
  activityId?: string;
  storyId?: string;
  initialPrompt?: string;
  initialMode?: BalliaiMode;
};

const LEVEL_KEY = "wattly-balliai-level";

function BalliaiBubble({ role, children }: { role: "user" | "assistant"; children: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "rounded-br-sm bg-[#0016BD] text-white"
            : "rounded-bl-sm border border-black/10 bg-white text-black/80"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function BalliaiChat({
  lesson,
  activityId,
  storyId,
  initialPrompt,
  initialMode = "ask",
}: BalliaiChatProps) {
  const t = useTranslations("Practice");
  const [messages, setMessages] = useState<BalliaiMessage[]>([]);
  const [input, setInput] = useState(initialPrompt ?? "");
  const [mode, setMode] = useState<BalliaiMode>(initialMode);
  const [level, setLevel] = useState<BalliaiLevel>("A1");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(LEVEL_KEY);
    if (stored && balliaiLevels.includes(stored as BalliaiLevel)) {
      setLevel(stored as BalliaiLevel);
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending]);

  function changeLevel(next: BalliaiLevel) {
    setLevel(next);
    window.localStorage.setItem(LEVEL_KEY, next);
  }

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || pending) return;
    if (clean.length > BALLIAI_MAX_MESSAGE) {
      setError(t("errTooLong"));
      return;
    }

    const history = messages.slice(-8);
    setMessages((prev) => [...prev, { role: "user", content: clean }]);
    setInput("");
    setError(null);
    setNeedsSetup(false);
    setPending(true);

    try {
      const response = await fetch("/api/balliai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: clean,
          history,
          level,
          mode,
          activityId,
          storyId,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
      };

      if (!response.ok || !data.reply) {
        if (data.error === "not_configured") setNeedsSetup(true);
        else if (data.error === "rate_limited" || data.error === "provider_rate_limited")
          setError(t("errRateLimited"));
        else if (data.error === "timeout") setError(t("errTimeout"));
        else setError(t("errGeneric"));
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply as string }]);
    } catch {
      setError(t("errGeneric"));
    } finally {
      setPending(false);
    }
  }

  const activeMode = balliaiModes.find((m) => m.id === mode) ?? balliaiModes[0];

  return (
    <div className="overflow-hidden rounded-3xl border border-[#0016BD]/15 bg-[#f8f9ff]">
      <div className="flex flex-wrap items-center gap-3 border-b border-[#0016BD]/10 bg-white px-4 py-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0016BD] text-sm font-black text-white">
          B
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#000A5E]">BALLIAI</p>
          <p className="truncate text-xs text-black/50">
            {lesson ? `${t("balliaiLesson")}: ${lesson.title}` : t("balliaiTagline")}
          </p>
        </div>
        <div className="ms-auto flex items-center gap-2">
          <label className="sr-only" htmlFor="balliai-level">
            {t("balliaiLevel")}
          </label>
          <select
            id="balliai-level"
            value={level}
            onChange={(event) => changeLevel(event.target.value as BalliaiLevel)}
            className="rounded-full border border-[#0016BD]/25 bg-white px-3 py-1.5 text-xs font-semibold text-[#000A5E]"
          >
            {balliaiLevels.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {messages.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                setMessages([]);
                setError(null);
              }}
              className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-semibold text-black/60 hover:border-black/35"
            >
              {t("balliaiClear")}
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pt-3">
        {balliaiModes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            aria-pressed={mode === item.id}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              mode === item.id
                ? "bg-[#0016BD] text-white"
                : "border border-[#0016BD]/20 bg-white text-[#000A5E]/80 hover:border-[#0016BD]/50"
            }`}
          >
            {t(item.labelKey)}
          </button>
        ))}
      </div>

      <div className="min-h-[320px] space-y-3 px-4 py-4">
        <BalliaiBubble role="assistant">{t("balliaiGreeting")}</BalliaiBubble>

        {messages.map((message, index) => (
          <BalliaiBubble key={`${message.role}-${index}`} role={message.role}>
            {message.content}
          </BalliaiBubble>
        ))}

        {pending ? (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm border border-black/10 bg-white px-4 py-3 text-sm text-black/50">
              {t("balliaiThinking")}
            </div>
          </div>
        ) : null}

        {needsSetup ? (
          <div className="rounded-2xl border border-[#c45c00]/30 bg-[#fff8ec] p-4 text-sm text-[#7a3a00]">
            <p className="font-bold">{t("balliaiSetupTitle")}</p>
            <p className="mt-1 leading-6">{t("balliaiSetupBody")}</p>
            <code className="mt-2 inline-block rounded bg-white px-2 py-1 text-xs">NVIDIA_API_KEY</code>
          </div>
        ) : null}

        {error ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => {
                const last = messages[messages.length - 1];
                if (last?.role === "user") {
                  setMessages((prev) => prev.slice(0, -1));
                  void send(last.content);
                }
              }}
              className="shrink-0 rounded-full bg-red-700 px-3 py-1 text-xs font-semibold text-white"
            >
              {t("balliaiRetry")}
            </button>
          </div>
        ) : null}

        <div ref={endRef} />
      </div>

      {messages.length === 0 && !pending ? (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {["chipAsk", "chipGrammar", "chipVocabulary", "chipWriting"].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => void send(t(key))}
              className="rounded-full border border-[#0016BD]/20 bg-white px-3 py-1.5 text-xs text-[#000A5E]/75 hover:border-[#0016BD]/50"
            >
              {t(key)}
            </button>
          ))}
        </div>
      ) : null}

      <div className="border-t border-[#0016BD]/10 bg-white p-3">
        <p className="mb-2 text-[11px] uppercase tracking-wide text-black/40">
          {t("balliaiModeLabel")}: {t(activeMode.labelKey)}
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void send(input);
          }}
          className="flex items-end gap-2"
        >
          <label className="sr-only" htmlFor="balliai-input">
            {t("balliaiPlaceholder")}
          </label>
          <textarea
            id="balliai-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send(input);
              }
            }}
            rows={2}
            maxLength={BALLIAI_MAX_MESSAGE}
            placeholder={t("balliaiPlaceholder")}
            className="min-h-[52px] flex-1 resize-none rounded-2xl border border-black/15 px-3 py-2 text-sm text-black/80 outline-none focus:border-[#0016BD]"
          />
          <button
            type="submit"
            disabled={pending || !input.trim()}
            className="h-11 rounded-2xl bg-[#FFD400] px-5 text-sm font-bold text-[#000A5E] disabled:opacity-40"
          >
            {t("balliaiSend")}
          </button>
        </form>
        <p className="mt-2 text-[11px] text-black/40">{t("balliaiDisclaimer")}</p>
      </div>
    </div>
  );
}
