"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Sparkles, Bot, User as UserIcon } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { answerSecurityQuery } from "@/features/ai-copilot/engine";
import type { AIResponse } from "@/types/domain";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  response?: AIResponse;
}

let messageId = 0;

export function CopilotPanel({ compact = false }: { compact?: boolean }) {
  const { t, locale, dict } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const quickActions = [
    dict.compliance.quick1,
    dict.compliance.quick2,
    dict.compliance.quick3,
    dict.compliance.quick4,
  ];

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = (value: string) => {
    const prompt = value.trim();
    if (!prompt || thinking) return;
    const response = answerSecurityQuery(prompt, locale);
    setMessages((prev) => [...prev, { id: ++messageId, role: "user", text: prompt }]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: ++messageId, role: "assistant", text: response.headline, response }]);
      setThinking(false);
    }, 650);
  };

  return (
    <div className={cn("dc-panel flex flex-col overflow-hidden", compact ? "h-[460px]" : "h-[540px]")}>
      <div className="flex items-center justify-between gap-3 border-b border-dc-border p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-dc-green/40 bg-dc-green/10 text-dc-green">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-dc-green">
              {t("compliance.copilotTitle")}
            </h3>
            <p className="text-[11px] text-dc-muted">{t("copilotPanel.subtitle")}</p>
          </div>
        </div>
        <span className="hidden rounded-full border border-dc-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-dc-muted-2 sm:block">
          {t("common.live")}
        </span>
      </div>

      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="flex gap-2.5">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-dc-green/10 text-dc-green">
            <Bot className="h-3.5 w-3.5" />
          </span>
          <p className="rounded-xl rounded-ss-none border border-dc-border bg-dc-surface-2/70 p-3 text-[13px] leading-relaxed text-dc-muted">
            {t("compliance.copilotGreeting")}
          </p>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((message) =>
            message.role === "user" ? (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end gap-2.5"
              >
                <p className="max-w-[85%] rounded-xl rounded-ee-none bg-dc-green/15 p-3 text-[13px] text-dc-text">
                  {message.text}
                </p>
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-dc-green/20 text-dc-green">
                  <UserIcon className="h-3.5 w-3.5" />
                </span>
              </motion.div>
            ) : (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2.5"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-dc-green/10 text-dc-green">
                  <Bot className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1 rounded-xl rounded-ss-none border border-dc-border bg-dc-surface-2/70 p-3">
                  <p className="text-[13px] font-semibold text-dc-text">{message.response?.headline}</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-dc-muted">{message.response?.summary}</p>

                  {message.response && message.response.bullets.length > 0 && (
                    <ul className="mt-2.5 flex flex-col gap-1">
                      {message.response.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2 font-mono text-[11px] text-dc-text/85">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-dc-green" aria-hidden="true" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}

                  {message.response && (
                    <div className="mt-3 border-t border-dc-border pt-2.5">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-dc-green/80">
                        {t("copilotPanel.suggested")}
                      </p>
                      <ul className="mt-1.5 flex flex-col gap-1">
                        {message.response.recommendations.map((rec) => (
                          <li key={rec} className="text-[12px] text-dc-muted">
                            · {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {message.response && (
                    <p className="mt-2.5 font-mono text-[10px] text-dc-muted-2">
                      {t("copilotPanel.sources")}: {message.response.sources.join(" · ")} ·{" "}
                      {Math.round(message.response.confidence * 100)}%
                    </p>
                  )}
                </div>
              </motion.div>
            ),
          )}
        </AnimatePresence>

        {thinking && (
          <div className="flex items-center gap-2.5 text-[12px] text-dc-muted">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-dc-green/10 text-dc-green">
              <Bot className="h-3.5 w-3.5" />
            </span>
            <span className="flex items-center gap-1">
              {t("copilotPanel.thinking")}
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1 w-1 animate-dc-blink rounded-full bg-dc-green"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </span>
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-dc-border p-3">
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {quickActions.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => send(action)}
              className="rounded-full border border-dc-border bg-dc-green/5 px-2.5 py-1 text-[11px] text-dc-green-soft transition-colors hover:border-dc-green/50 hover:bg-dc-green/10"
            >
              {action}
            </button>
          ))}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="copilot-input" className="sr-only">
            {t("compliance.copilotPlaceholder")}
          </label>
          <input
            id="copilot-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("compliance.copilotPlaceholder")}
            className="h-10 w-full rounded-lg border border-dc-border bg-dc-black/60 px-3 text-[13px] text-dc-text placeholder:text-dc-muted-2 focus:border-dc-green focus:outline-none focus:ring-1 focus:ring-dc-green/40"
          />
          <button
            type="submit"
            disabled={thinking || !input.trim()}
            aria-label={t("compliance.copilotSend")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-dc-green text-dc-black transition-all hover:bg-dc-green-soft disabled:opacity-40"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
