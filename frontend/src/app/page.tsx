export default function Home() {
  return (
    <main className="mx-auto flex min-h-full max-w-2xl flex-col justify-center gap-4 px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
        Skygnosis take-home
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        AI Support Ticket Triage
      </h1>
      <p className="text-zinc-600 leading-relaxed">
        Scaffold ready. User ticket form and admin dashboard will be added in
        later steps. Backend API health:{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          GET /api/health
        </code>
      </p>
    </main>
  );
}
