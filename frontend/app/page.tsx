export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 p-6">
      <main className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-amber-500">
          Mobilya Atölyesi
        </h1>
        <p className="text-lg text-slate-300">
          Özel Üretim Mobilya Atölyesi Web Uygulaması ve Yönetim Sistemi
        </p>
        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-sm text-slate-400 font-mono">
          Status: Frontend Development Foundation Ready
        </div>
      </main>
    </div>
  );
}
