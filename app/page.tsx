import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="max-w-3xl rounded-3xl border border-stroke bg-surface/70 p-10 shadow-2xl shadow-black/30 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.24em] text-orange-300">
          LED Wall Configurator
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white">
          Design LED screens, validate processing capacity, and map ports visually.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-300">
          This base architecture provides the MVP flow: screen sizing, panel selection,
          processor validation, Konva visualization, and project persistence through Supabase.
        </p>
        <div className="mt-8">
          <Link
            href="/configurator"
            className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-medium text-black transition hover:bg-orange-300"
          >
            Open configurator
          </Link>
        </div>
      </div>
    </main>
  );
}
