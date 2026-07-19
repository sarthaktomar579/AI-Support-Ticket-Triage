import Link from "next/link";

type Props = {
  actionHref: string;
  actionLabel: string;
};

export default function SiteHeader({ actionHref, actionLabel }: Props) {
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        <span className="brand-mark" aria-hidden>
          H
        </span>
        <span>
          <span className="brand-name">Helix</span>
          <span className="brand-tag">Support intake</span>
        </span>
      </Link>
      <Link href={actionHref} className="nav-link">
        {actionLabel}
      </Link>
    </header>
  );
}
