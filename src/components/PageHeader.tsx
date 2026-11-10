import type { ReactNode } from 'react';

export function PageHeader({ eyebrow, title, subtitle, children }: {
  eyebrow?: string; title: ReactNode; subtitle?: string; children?: ReactNode;
}) {
  return <section className="editorial-page-header"><div className="home-shell">{eyebrow && <span className="home-eyebrow"><span className="home-status-dot" />{eyebrow}</span>}<h1>{title}</h1>{subtitle && <p>{subtitle}</p>}{children && <div className="mt-8">{children}</div>}</div></section>;
}
