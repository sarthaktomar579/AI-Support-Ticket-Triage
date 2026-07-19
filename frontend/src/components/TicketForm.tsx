"use client";

import { FormEvent, useState } from "react";
import { createTicket, type CreateTicketResponse } from "../lib/api";

const priorityStyles: Record<string, string> = {
  High: "bg-rose-100 text-rose-900",
  Medium: "bg-amber-100 text-amber-950",
  Low: "bg-orange-100 text-orange-950",
};

export default function TicketForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateTicketResponse | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await createTicket({ name, email, message });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit request");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setName("");
    setEmail("");
    setMessage("");
    setError(null);
  }

  if (result) {
    const { ticket, triage } = result;
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-[var(--accent-deep)] uppercase">
            Request #{ticket.id}
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--ink)]">
            Received and triaged
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            {triage.status === "failed"
              ? "Automated triage was unavailable, so safe defaults were applied. Your team can still follow up with the draft below."
              : "Priority and category are ready for your operations team, along with a draft reply."}
          </p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-[var(--surface-2)] px-4 py-3">
            <dt className="text-[0.7rem] font-semibold tracking-[0.08em] text-[var(--muted)] uppercase">
              Priority
            </dt>
            <dd className="mt-2">
              <span
                className={`meta-chip ${
                  priorityStyles[ticket.priority || ""] || "bg-zinc-100 text-zinc-700"
                }`}
              >
                {ticket.priority || "—"}
              </span>
            </dd>
          </div>
          <div className="rounded-xl bg-[var(--surface-2)] px-4 py-3">
            <dt className="text-[0.7rem] font-semibold tracking-[0.08em] text-[var(--muted)] uppercase">
              Category
            </dt>
            <dd className="mt-2 text-base font-semibold text-[var(--ink)]">
              {ticket.category || "—"}
            </dd>
          </div>
          <div className="sm:col-span-2 rounded-xl border border-[var(--line)] bg-[var(--surface-solid)] px-4 py-3">
            <dt className="text-[0.7rem] font-semibold tracking-[0.08em] text-[var(--muted)] uppercase">
              Suggested reply
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-[var(--ink)]">
              {ticket.suggestedReply || "—"}
            </dd>
          </div>
        </dl>

        {triage.warning ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {triage.warning}
          </p>
        ) : null}

        <button type="button" onClick={reset} className="btn-secondary w-full sm:w-auto">
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="field-label">
          Full name
        </label>
        <input
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="field-input"
          placeholder="Priya Sharma"
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="email" className="field-label">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field-input"
          placeholder="priya@company.com"
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          Issue description
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="field-input min-h-32 resize-y"
          placeholder="What happened, where, and what you expected instead…"
        />
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Running triage…" : "Submit request"}
      </button>
    </form>
  );
}
