export default function AdminPlaceholder() {
  return (
    <main className="page-shell mx-auto flex w-full max-w-lg flex-col justify-center px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
        Admin dashboard
      </h1>
      <p className="mt-3 text-[var(--muted)] leading-relaxed">
        Login and ticket filters land in Step 7. Backend auth is already live at{" "}
        <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-sm">
          POST /api/auth/login
        </code>
        .
      </p>
    </main>
  );
}
