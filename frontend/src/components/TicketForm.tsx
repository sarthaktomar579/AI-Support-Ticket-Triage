"use client";

import { FormEvent, useState } from "react";
import { createTicket, type CreateTicketResponse } from "../lib/api";

const priorityStyles: Record<string, string> = {
  High: "bg-rose-100 text-rose-800",
  Medium: "bg-amber-100 text-amber-900",
  Low: "bg-emerald-100 text-emerald-800",
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
      setError(err instanceof Error ? err.message : "Something went wrong");
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
      <div className="confirm-panel space-y-6">
        <div>
          <p className="text-sm font-medium tracking-wide text-[var(--accent)] uppercase">
            Ticket #{ticket.id}
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            We received your request
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Our AI triage ran automatically
            {triage.status === "failed"
              ? " with a fallback (AI was unavailable)."
              : "."}{" "}
            An agent can follow up using the suggested reply below.
          </p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs tracking-wide text-[var(--muted)] uppercase">
              Priority
            </dt>
            <dd className="mt-1">
              <span
                className={`inline-block rounded-md px-2.5 py-1 text-sm font-medium ${
                  priorityStyles[ticket.priority || ""] || "bg-zinc-100 text-zinc-700"
                }`}
              >
                {ticket.priority || "—"}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-[var(--muted)] uppercase">
              Category
            </dt>
            <dd className="mt-1 text-[var(--ink)] font-medium">
              {ticket.category || "—"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs tracking-wide text-[var(--muted)] uppercase">
              Suggested reply
            </dt>
            <dd className="mt-2 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-4 py-3 text-[var(--ink)] leading-relaxed">
              {ticket.suggestedReply || "—"}
            </dd>
          </div>
        </dl>

        {triage.warning ? (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            {triage.warning}
          </p>
        ) : null}

        <button
          type="button"
          onClick={reset}
          className="btn-secondary"
        >
          Submit another ticket
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="field-label">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="field-input"
          placeholder="Jane Doe"
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field-input"
          placeholder="jane@company.com"
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="field-input resize-y min-h-32"
          placeholder="Describe the issue — what happened, and what you expected..."
        />
      </div>

      {error ? (
        <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Triaging with AI…" : "Submit ticket"}
      </button>
    </form>
  );
}
