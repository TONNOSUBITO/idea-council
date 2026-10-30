import "./globals.css";
import Link from "next/link";
import { EPHEMERAL } from "@/lib/store";
export const metadata = { title: "Idea Council — Demo Desk", robots: { index: false, follow: false } };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it"><body>
      <div className="bg-amber-500 px-4 py-2 text-center text-sm font-bold text-black">DEMO / PAPER ONLY — NOT LIVE — non consiglio di investimento. Uso interno, non condividere.</div>
      {EPHEMERAL && <div className="bg-red-700 px-4 py-1 text-center text-xs">Archivio effimero su serverless (/tmp): i dati possono sparire. Configura un DB (KV/Postgres/Blob) prima dell'uso reale.</div>}
      <nav className="mx-auto flex max-w-5xl gap-4 px-4 py-3 text-sm">
        <Link href="/" className="font-bold">Idea Council</Link>
        <Link href="/scout">Scout</Link><Link href="/call/new">Nuova call</Link><Link href="/log">Registro</Link><Link href="/settings">Impostazioni</Link>
      </nav>
      <main className="mx-auto max-w-5xl px-4 pb-16">{children}</main>
      <footer className="mx-auto max-w-5xl px-4 pb-6 text-xs text-zinc-500">Demo signal only. Not investment advice. Human demo execution. No live money. No zero-error promise.</footer>
    </body></html>
  );
}
