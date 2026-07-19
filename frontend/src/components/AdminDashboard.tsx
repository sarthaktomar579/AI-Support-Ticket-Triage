"use client";

import { useCallback, useEffect, useState } from "react";
import { listTickets, type Ticket } from "../lib/api";
import { clearAdminSession, getAdminEmail, getAdminToken } from "../lib/auth";

const PRIORITIES = ["", "High", "Medium", "Low"] as const;
const CATEGORIES = ["", "Billing", "Bug", "Feature Request", "Other"] as const;

const priorityStyles: Record<string, string> = {
  High: "bg-rose-100 text-rose-800",
  Medium: "bg-amber-100 text-amber-950",
  Low: "bg-teal-100 text-teal-900",
};

type Props = {
  onLogout: () => void;
};

export default function AdminDashboard({ onLogout }: Props) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const email = getAdminEmail();

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      onLogout();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await listTickets(token, {
        priority: priority || undefined,
        category: category || undefined,
      });
      setTickets(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load tickets";
      if (message === "UNAUTHORIZED") {
        clearAdminSession();
        onLogout();
        return;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [priority, category, onLogout]);

  useEffect(() => {
    void load();
  }, [load]);

  function logout() {
    clearAdminSession();
    onLogout();
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-7 px-6 pb-16 pt-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-[var(--accent-deep)] uppercase">
            Operations console
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] sm:text-4xl">
            Incoming queue
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Signed in as <span className="font-medium text-[var(--ink)]">{email}</span>
            · newest first
          </p>
        </div>
        <button type="button" onClick={logout} className="btn-secondary">
          Sign out
        </button>
      </div>

      <div className="form-panel flex flex-wrap items-end gap-4 !py-5">
        <div className="min-w-40 flex-1">
          <label htmlFor="filter-priority" className="field-label">
            Priority
          </label>
          <select
            id="filter-priority"
            className="field-input"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">All priorities</option>
            {PRIORITIES.filter(Boolean).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-48 flex-1">
          <label htmlFor="filter-category" className="field-label">
            Category
          </label>
          <select
            id="filter-category"
            className="field-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {CATEGORIES.filter(Boolean).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button type="button" onClick={() => void load()} className="btn-secondary">
          Refresh queue
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-[var(--muted)]">Loading queue…</p>
      ) : tickets.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--line)] bg-[rgb(255_255_255_/_0.55)] px-4 py-12 text-center text-[var(--muted)]">
          No requests match the current filters.
        </p>
      ) : (
        <ul className="space-y-4">
          {tickets.map((ticket, index) => (
            <li
              key={ticket.id}
              className="ticket-row"
              style={{ animationDelay: `${Math.min(index, 6) * 0.05}s` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[var(--ink)]">
                    #{ticket.id} · {ticket.name}
                  </p>
                  <p className="mt-0.5 text-sm text-[var(--muted)]">{ticket.email}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`meta-chip ${
                      priorityStyles[ticket.priority || ""] || "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {ticket.priority || "Unassigned"}
                  </span>
                  <span className="meta-chip bg-[var(--accent-soft)] text-teal-900">
                    {ticket.category || "Uncategorized"}
                  </span>
                  <span
                    className={`meta-chip ${
                      ticket.aiStatus === "success"
                        ? "bg-teal-50 text-teal-900"
                        : ticket.aiStatus === "failed"
                          ? "bg-amber-50 text-amber-950"
                          : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    Triage {ticket.aiStatus}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[var(--ink)]">
                {ticket.message}
              </p>

              <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--surface-solid)] px-4 py-3">
                <p className="text-[0.7rem] font-semibold tracking-[0.08em] text-[var(--muted)] uppercase">
                  Suggested reply
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink)]">
                  {ticket.suggestedReply || "—"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
