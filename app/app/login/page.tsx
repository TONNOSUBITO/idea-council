export default async function Login({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  const { err } = await searchParams;
  return (<form method="post" action="/api/login" className="card mx-auto mt-10 max-w-sm space-y-3">
    <h1 className="font-semibold">Accesso operatore</h1>
    <input name="password" type="password" className="w-full rounded bg-zinc-800 p-2" placeholder="Password" />
    {err && <p className="text-sm text-red-400">Password errata</p>}<button className="btn">Entra</button></form>);
}
