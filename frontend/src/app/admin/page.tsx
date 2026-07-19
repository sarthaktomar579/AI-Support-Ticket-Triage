"use client";

import { useCallback, useEffect, useState } from "react";
import AdminDashboard from "../../components/AdminDashboard";
import AdminLoginForm from "../../components/AdminLoginForm";
import SiteHeader from "../../components/SiteHeader";
import { getAdminToken } from "../../lib/auth";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAuthed(Boolean(getAdminToken()));
    setReady(true);
  }, []);

  const onLogout = useCallback(() => setAuthed(false), []);

  return (
    <div className="page-shell relative overflow-hidden">
      <div
        className="orb"
        style={{
          width: 200,
          height: 200,
          top: "12%",
          right: "6%",
          background: "rgb(255 200 120 / 0.3)",
        }}
      />

      <SiteHeader actionHref="/" actionLabel="Customer intake" />

      {!ready ? (
        <p className="px-6 text-[var(--muted)]">Loading workspace…</p>
      ) : authed ? (
        <AdminDashboard onLogout={onLogout} />
      ) : (
        <div className="flex flex-1 items-center justify-center px-6 pb-20 pt-4">
          <AdminLoginForm onSuccess={() => setAuthed(true)} />
        </div>
      )}
    </div>
  );
}
