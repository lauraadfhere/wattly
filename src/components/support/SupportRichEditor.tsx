"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

type SupportRichEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function runCommand(command: string, value?: string) {
  document.execCommand(command, false, value);
}

export default function SupportRichEditor({
  value,
  onChange,
  placeholder,
}: SupportRichEditorProps) {
  const t = useTranslations("SupportWidget");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
  }, [value]);

  function emitChange() {
    onChange(ref.current?.innerHTML || "");
  }

  function onLink() {
    const url = window.prompt(t("linkPrompt"), "https://");
    if (!url) return;
    runCommand("createLink", url);
    emitChange();
  }

  const tools: Array<{
    cmd: string;
    label: string;
    icon: string;
    className?: string;
  }> = [
    { cmd: "bold", label: t("bold"), icon: "B", className: "font-bold" },
    { cmd: "italic", label: t("italic"), icon: "I", className: "italic" },
    { cmd: "underline", label: t("underline"), icon: "U", className: "underline" },
    { cmd: "insertUnorderedList", label: t("bulletList"), icon: "•" },
    { cmd: "insertOrderedList", label: t("numberList"), icon: "1." },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-[#0016BD]/20 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-black/10 bg-[#f5f7ff] px-2 py-1.5">
        {tools.map((tool) => (
          <button
            key={tool.cmd}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm text-[#0b0b1a] hover:bg-white ${tool.className || ""}`}
            onMouseDown={(e) => {
              e.preventDefault();
              runCommand(tool.cmd);
              emitChange();
            }}
          >
            {tool.icon}
          </button>
        ))}
        <button
          type="button"
          title={t("link")}
          aria-label={t("link")}
          className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm text-[#0016BD] hover:bg-white"
          onMouseDown={(e) => {
            e.preventDefault();
            onLink();
          }}
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 5.93" strokeLinecap="round" />
            <path d="M14 11a5 5 0 0 0-7.07 0L5.52 12.4a5 5 0 0 0 7.07 7.07L14 18.07" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          title={t("clearFormat")}
          aria-label={t("clearFormat")}
          className="ms-auto inline-flex h-8 items-center justify-center rounded-lg px-2 text-xs font-medium text-black/55 hover:bg-white"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand("removeFormat");
            emitChange();
          }}
        >
          {t("clearFormat")}
        </button>
      </div>
      <div
        ref={ref}
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder || t("body")}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder || t("bodyPlaceholder")}
        className="min-h-[9rem] max-h-48 overflow-y-auto px-3 py-2.5 text-sm leading-6 text-[#0b0b1a] outline-none empty:before:pointer-events-none empty:before:text-black/40 empty:before:content-[attr(data-placeholder)]"
        onInput={emitChange}
        onBlur={emitChange}
      />
    </div>
  );
}
