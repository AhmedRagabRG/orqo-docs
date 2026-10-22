import Link from 'next/link';

const cards = [
  { title: 'Quickstart', href: '/docs/quickstart', text: 'Create a token, add a contact and send a WhatsApp message in five minutes.' },
  { title: 'Authentication', href: '/docs/authentication', text: 'Organization API tokens, scopes and rotation.' },
  { title: 'Errors', href: '/docs/errors', text: 'One envelope, stable codes, and when to retry.' },
  { title: 'API reference', href: '/docs/api', text: 'Every endpoint with request, response and code samples.' },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-16">
      <section className="flex flex-col gap-4">
        <p className="text-sm font-medium text-fd-primary">ORQO developer docs</p>
        <h1 className="text-4xl font-bold tracking-tight">Build on ORQO</h1>
        <p className="max-w-2xl text-lg text-fd-muted-foreground">
          Sync contacts, send WhatsApp messages, run campaigns and read conversations from your own
          systems with one REST API.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/docs/quickstart" className="rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground">
            Get started
          </Link>
          <Link href="/docs/api" className="rounded-lg border px-4 py-2 text-sm font-medium">
            API reference
          </Link>
        </div>
        <pre className="mt-2 overflow-x-auto rounded-xl border bg-fd-card p-4 text-sm">
          <code>{`curl https://app.orqo.site/api/v1/contacts \\
  -H "Authorization: Bearer $ORQO_API_TOKEN"`}</code>
        </pre>
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="rounded-xl border bg-fd-card p-5 transition-colors hover:bg-fd-accent">
            <h2 className="font-semibold">{card.title}</h2>
            <p className="mt-1 text-sm text-fd-muted-foreground">{card.text}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
