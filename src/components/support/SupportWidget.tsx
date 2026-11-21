"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import SupportRichEditor from "@/components/support/SupportRichEditor";

const SUPPORT_URL = "https://support.wall-y.ca";
const STORAGE_KEY = "wattly-support-tickets";

type RequestType = "claim" | "refund" | "general";

type SupportTicket = {
  id: string;
  type: RequestType;
  subject: string;
  bodyHtml: string;
  createdAt: string;
};

const HIDDEN_PREFIXES = [
  "/login",
  "/signup",
  "/student/login",
  "/teacher/login",
  "/parent/login",
  "/admin",
] as const;

function shouldHide(pathname: string) {
  return HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function loadTickets(): SupportTicket[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as SupportTicket[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTicket(ticket: SupportTicket) {
  const next = [ticket, ...loadTickets()].slice(0, 30);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export default function SupportWidget() {
  const t = useTranslations("SupportWidget");
  const pathname = usePathname();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<RequestType>("claim");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hidden = shouldHide(pathname);

  useEffect(() => {
    if (hidden) setOpen(false);
  }, [hidden]);

  function resetForm() {
    setType("claim");
    setSubject("");
    setBodyHtml("");
    setDone(false);
    setError(null);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const cleanSubject = subject.trim();
    const textOnly = bodyHtml.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
    if (!cleanSubject || !textOnly) {
      setError(t("errorRequired"));
      return;
    }

    setSending(true);
    setError(null);
    try {
      const ticket: SupportTicket = {
        id: `sup-${Date.now()}`,
        type,
        subject: cleanSubject,
        bodyHtml,
        createdAt: new Date().toISOString(),
      };
      saveTicket(ticket);
      setDone(true);
    } catch {
      setError(t("errorFailed"));
    } finally {
      setSending(false);
    }
  }

  if (hidden) return null;

  return (
    <div className="pointer-events-none fixed bottom-24 start-3 z-[60] flex flex-col items-start gap-2 sm:bottom-6 sm:start-4">
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={t("title")}
          className="pointer-events-auto w-[min(100vw-1.5rem,22rem)] overflow-hidden rounded-2xl border border-black/10 bg-white text-[#0b0b1a] shadow-[0_12px_40px_rgba(0,0,0,0.28)]"
        >
          <div className="flex items-center gap-2 border-b border-black/10 bg-[#0016BD] px-4 py-3 text-white">
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ffc933] text-[#0b0b1a]"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 3a7 7 0 0 0-7 7v1.5L3.5 14H8v1a4 4 0 0 0 8 0v-1h4.5L19 11.5V10a7 7 0 0 0-7-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight">{t("title")}</p>
              <p className="text-[11px] text-white/75">{t("subtitle")}</p>
            </div>
            <button
              type="button"
              className="rounded-full px-2 py-1 text-xs text-white/80 hover:text-white"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              aria-label={t("close")}
            >
              {t("close")}
            </button>
          </div>

          <div className="max-h-[min(70dvh,28rem)] overflow-y-auto p-4">
            {done ? (
              <div className="space-y-3">
                <p className="rounded-xl bg-[#eef1ff] px-3 py-3 text-sm text-[#0016BD]">
                  {t("success")}
                </p>
                <a
                  href={SUPPORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#0016BD] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  {t("openCenter")}
                </a>
                <button
                  type="button"
                  className="w-full rounded-full border border-black/15 px-4 py-2 text-sm font-semibold"
                  onClick={resetForm}
                >
                  {t("another")}
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-3">
                <div>
                  <label htmlFor="support-type" className="mb-1 block text-xs font-semibold text-black/55">
                    {t("type")}
                  </label>
                  <select
                    id="support-type"
                    value={type}
                    onChange={(e) => setType(e.target.value as RequestType)}
                    className="w-full rounded-xl border border-black/15 px-3 py-2 text-sm"
                  >
                    <option value="claim">{t("types.claim")}</option>
                    <option value="refund">{t("types.refund")}</option>
                    <option value="general">{t("types.general")}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="support-subject" className="mb-1 block text-xs font-semibold text-black/55">
                    {t("subject")}
                  </label>
                  <input
                    id="support-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-black/15 px-3 py-2 text-sm"
                    placeholder={t("subjectPlaceholder")}
                    required
                  />
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold text-black/55">{t("body")}</p>
                  <SupportRichEditor value={bodyHtml} onChange={setBodyHtml} />
                </div>

                {error ? (
                  <p role="alert" className="rounded-xl bg-[#ff5c5c]/15 px-3 py-2 text-sm text-[#8a1010]">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-full bg-[#0016BD] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {sending ? t("sending") : t("submit")}
                </button>

                <a
                  href={SUPPORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-xs font-semibold text-[#0016BD] underline"
                >
                  {t("visitCenter")}
                </a>
              </form>
            )}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t("open")}
        title={t("open")}
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-[#0016BD] text-white shadow-[0_8px_24px_rgba(0,22,189,0.4)] transition hover:bg-[#000ea8]"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path
            d="M12 3a7 7 0 0 0-7 7v1.5L3.5 14H8v1a4 4 0 0 0 8 0v-1h4.5L19 11.5V10a7 7 0 0 0-7-7z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9.5 9.5h5M9.5 12h3" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
