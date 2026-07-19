"use client";

import { FormEvent, useState } from "react";
import { loginAdmin } from "../lib/api";
import { setAdminSession } from "../lib/auth";

type Props = {
  onSuccess: () => void;
};

export default function AdminLoginForm({ onSuccess }: Props) {
  const [email, setEmail] = useState("admin@skygnosis.demo");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginAdmin({ email, password });
      setAdminSession(data.token, data.admin.email);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="form-panel w-full max-w-md space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-[0.12em] text-[var(--accent-deep)] uppercase">
          Operations
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)]">
          Console sign-in
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          Review incoming requests, triage results, and suggested replies.
        </p>
      </div>

      <div>
        <label htmlFor="admin-email" className="field-label">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field-input"
          autoComplete="username"
        />
      </div>

      <div>
        <label htmlFor="admin-password" className="field-label">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field-input"
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Authenticating…" : "Enter console"}
      </button>
    </form>
  );
}
