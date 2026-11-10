import Link from 'next/link';

export default function NotFound() {
  return <main className="flex min-h-screen items-center bg-background px-4 py-16 sm:px-6">
    <section className="mx-auto w-full max-w-2xl rounded-3xl border border-border bg-card p-7 text-center shadow-soft sm:p-12">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Error 404</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">We could not find that page.</h1>
      <p className="mx-auto mt-4 max-w-lg leading-relaxed text-muted-foreground">The link may be out of date, or the page may have moved. You can start selling your kids items, learn how Zapiboo works, or contact our Bangalore team.</p>
      <nav aria-label="Helpful pages" className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">Go to homepage</Link>
        <Link href="/sell/toys" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-5 text-sm font-bold text-foreground transition-colors hover:bg-muted">Explore toys & games</Link>
        <Link href="/pickup" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-5 text-sm font-bold text-foreground transition-colors hover:bg-muted">Sell your items</Link>
        <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border px-5 text-sm font-bold text-foreground transition-colors hover:bg-muted">Contact Zapiboo</Link>
      </nav>
      <p className="mt-7 text-sm text-muted-foreground">Ready to sell? <Link href="/pickup" className="font-semibold text-primary underline underline-offset-4">Tell us about your items</Link>.</p>
    </section>
  </main>;
}
