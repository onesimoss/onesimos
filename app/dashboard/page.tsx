export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#f7f2eb] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1e1916]">Dashboard</h1>
        <p className="text-[#4a423b] mt-2">Welcome to Onesimos!</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold">📚 Books Read</h2>
            <p className="text-3xl font-bold text-[#b28b6a]">0</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold">🎯 Words Mastered</h2>
            <p className="text-3xl font-bold text-[#b28b6a]">0</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold">📖 Current Level</h2>
            <p className="text-3xl font-bold text-[#b28b6a]">8</p>
          </div>
        </div>
      </div>
    </main>
  );
}