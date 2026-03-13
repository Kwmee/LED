type MainLayoutProps = {
  header: React.ReactNode;
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
};

export function MainLayout({ header, left, center, right }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#d8dce1] text-slate-900">
      <header className="border-b border-slate-500 bg-[#c7ccd2]">{header}</header>
      <main className="grid min-h-[calc(100vh-49px)] grid-cols-1 lg:grid-cols-[292px_minmax(0,1fr)_292px]">
        <aside className="border-b border-slate-400 bg-[#eef1f4] lg:border-b-0 lg:border-r lg:border-r-slate-400">
          {left}
        </aside>
        <section className="border-b border-slate-400 bg-[#f4f6f8] lg:border-b-0 lg:border-r lg:border-r-slate-400">
          {center}
        </section>
        <aside className="bg-[#eef1f4]">{right}</aside>
      </main>
    </div>
  );
}
