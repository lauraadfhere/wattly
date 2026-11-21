"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";

type ChatMessage = {
  id: string;
  role: "user" | "kinpal";
  text: string;
};

/** Hide Kinpal on auth / admin / focused flows. */
const HIDDEN_PREFIXES = [
  "/login",
  "/signup",
  "/student/login",
  "/teacher/login",
  "/parent/login",
  "/admin",
  "/onboarding",
] as const;

function shouldHideKinpal(pathname: string) {
  return HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function KinpalAssistant() {
  const t = useTranslations("Kinpal");
  const pathname = usePathname();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "kinpal",
      text: t("welcome"),
    },
  ]);

  const hidden = shouldHideKinpal(pathname);

  useEffect(() => {
    if (hidden) setOpen(false);
  }, [hidden]);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setAtTop(y < 40);
      setAtBottom(max <= 0 || y >= max - 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollBottom() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
    };
    const reply: ChatMessage = {
      id: `k-${Date.now()}`,
      role: "kinpal",
      text: t("reply"),
    };
    setMessages((prev) => [...prev, userMsg, reply]);
    setInput("");
  }

  if (hidden) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-end p-3 sm:p-4">
      <div className="pointer-events-auto flex w-full max-w-[22rem] flex-col items-end gap-2">
        {/* Fast scroll up / down — above Kinpal */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={scrollTop}
            disabled={atTop}
            aria-label={t("scrollTop")}
            title={t("scrollTop")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-[#0b0b1a]/85 text-white shadow-md backdrop-blur-sm transition hover:bg-[#0016BD] disabled:cursor-default disabled:opacity-35"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <path d="M6 14l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={scrollBottom}
            disabled={atBottom}
            aria-label={t("scrollBottom")}
            title={t("scrollBottom")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-[#0b0b1a]/85 text-white shadow-md backdrop-blur-sm transition hover:bg-[#0016BD] disabled:cursor-default disabled:opacity-35"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <path d="M6 10l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {open ? (
          <div
            id={panelId}
            className="flex max-h-[min(58dvh,22rem)] w-full flex-col overflow-hidden rounded-t-2xl border border-white/20 border-b-0 bg-[#0b0b1a]/95 text-white shadow-[0_-8px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
            role="dialog"
            aria-label={t("name")}
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ffc933] text-[#0b0b1a]"
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 3a7 7 0 0 0-7 7v2.2l-1.4 2.1A1 1 0 0 0 4.4 16H8v1a4 4 0 0 0 8 0v-1h3.6a1 1 0 0 0 .8-1.7L19 12.2V10a7 7 0 0 0-7-7zm-1 15.1A2 2 0 0 1 13 16h-2a2 2 0 0 1 0 2.1z" />
                </svg>
              </span>
              <p className="text-sm font-bold italic tracking-tight text-white">
                {t("name")}
              </p>
              <button
                type="button"
                className="ms-auto rounded-full px-2 py-1 text-xs font-medium text-white/70 hover:text-white"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
              >
                {t("close")}
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3 text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[90%] rounded-2xl px-3 py-2 leading-5 ${
                    msg.role === "user"
                      ? "ms-auto bg-[#0016BD] text-white"
                      : "bg-white/10 text-white/95"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={onSubmit} className="border-t border-white/10 p-3">
              <label className="sr-only" htmlFor="kinpal-input">
                {t("placeholder")}
              </label>
              <div className="flex gap-2">
                <input
                  id="kinpal-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("placeholder")}
                  className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#ffc933]/60"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#ffc933] px-3 py-2 text-sm font-semibold text-[#0b0b1a]"
                >
                  {t("send")}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2.5 rounded-full border border-white/25 bg-[#000ea8] px-3.5 py-2.5 text-white shadow-[0_8px_28px_rgba(0,0,0,0.35)] transition hover:bg-[#0016BD] sm:rounded-2xl sm:rounded-b-none sm:border-b-0"
        >
          <span
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffc933] text-[#0b0b1a]"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9.4L5 20.2V16a3 3 0 0 1-1-2.2V5zm4 3v2h8V8H8zm0 4v2h5v-2H8z" />
            </svg>
          </span>
          <span className="text-sm font-bold italic tracking-tight sm:text-[0.95rem]">
            {t("name")}
          </span>
          <span
            className={`ms-auto inline-block h-2 w-2 rounded-full ${
              open ? "bg-white/50" : "bg-[#5ec8d8]"
            }`}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
