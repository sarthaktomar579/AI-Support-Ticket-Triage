import SiteHeader from "../components/SiteHeader";
import SplashIntro from "../components/SplashIntro";
import TicketForm from "../components/TicketForm";

export default function Home() {
  return (
    <SplashIntro>
      <div className="page-shell relative overflow-hidden">
        <div
          className="orb"
          style={{
            width: 220,
            height: 220,
            top: "18%",
            left: "-4%",
            background: "rgb(255 200 120 / 0.35)",
            animationDelay: "0s",
          }}
        />
        <div
          className="orb"
          style={{
            width: 160,
            height: 160,
            top: "58%",
            right: "-2%",
            background: "rgb(255 160 80 / 0.28)",
            animationDelay: "1.5s",
          }}
        />

        <SiteHeader actionHref="/admin" actionLabel="Operations console" />

        <main className="relative mx-auto grid w-full max-w-6xl flex-1 gap-12 px-6 pb-20 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section className="hero-copy space-y-5 lg:pr-6">
            <p className="text-sm font-semibold tracking-[0.14em] text-[var(--accent-deep)] uppercase">
              Customer operations
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-[2.65rem] leading-[1.08] tracking-tight text-[var(--ink)] sm:text-5xl lg:text-[3.35rem]">
              Aitri
            </h1>
            <p className="max-w-md text-lg font-medium leading-snug text-[var(--ink)]">
              Every request classified before it reaches your team.
            </p>
            <p className="max-w-md text-[var(--muted)] leading-relaxed">
              Share your details and a clear description of the issue. Aitri
              assigns priority and category, then drafts a concise reply your
              agents can send.
            </p>
          </section>

          <section className="form-panel">
            <div className="mb-6 border-b border-[var(--line)] pb-4">
              <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--ink)]">
                Open a request
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Typical response starts with automated triage in seconds.
              </p>
            </div>
            <TicketForm />
          </section>
        </main>
      </div>
    </SplashIntro>
  );
}
