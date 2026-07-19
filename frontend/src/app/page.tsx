import Link from "next/link";
import TicketForm from "../components/TicketForm";

export default function Home() {
  return (
    <div className="page-shell">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <p className="font-[family-name:var(--font-display)] text-lg tracking-tight text-[var(--ink)]">
          Ticket Triage
        </p>
        <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
          Admin
        </Link>
      </header>

      <main className="mx-auto grid w-full max-w-5xl flex-1 gap-10 px-6 pb-16 pt-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <section className="space-y-4 lg:pt-6">
          <p className="text-sm font-medium tracking-wide text-[var(--accent)] uppercase">
            Support desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl leading-tight tracking-tight text-[var(--ink)] sm:text-5xl">
            Tell us what went wrong. AI routes it from here.
          </h1>
          <p className="max-w-md text-[var(--muted)] leading-relaxed">
            Submit a ticket with your name, email, and message. We score
            priority, pick a category, and draft a one-line reply for the team.
          </p>
        </section>

        <section className="form-panel">
          <h2 className="mb-6 font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
            New ticket
          </h2>
          <TicketForm />
        </section>
      </main>
    </div>
  );
}
