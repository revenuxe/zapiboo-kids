export function ServiceFaqs({
  title,
  items,
}: {
  title: string;
  items: readonly { question: string; answer: string }[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold">{title}</h2>
      <div className="mt-6 max-w-3xl divide-y divide-border">
        {items.map((item) => (
          <details key={item.question} className="py-5">
            <summary className="cursor-pointer font-bold">{item.question}</summary>
            <p className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
