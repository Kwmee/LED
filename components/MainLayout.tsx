type MainLayoutProps = {
  header: React.ReactNode;
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
};

export function MainLayout({ header, left, center, right }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#d8dce1] text-slate-900">
      <header className="border-b border-slate-400 bg-[#c7ccd2]">{header}</header>
      <main className="grid min-h-[calc(100vh-57px)] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_320px]">
        <aside className="border-b border-slate-400 bg-[#eef1f4] lg:border-b-0 lg:border-r">
          {left}
        </aside>
        <section className="border-b border-slate-400 bg-[#f4f6f8] lg:border-b-0 lg:border-r">
          {center}
        </section>
        <aside className="bg-[#eef1f4]">{right}</aside>
      </main>
    </div>
  );
}
