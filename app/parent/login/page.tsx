// app/parent/login/page.tsx
export default function ParentLogin() {
  return (
    <main className="min-h-screen bg-parent-bg flex items-center justify-center p-6 font-parent">
      <div className="w-full max-w-md bg-parent-card rounded-xl shadow-sm p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-parent-text mb-6">Parent Dashboard</h1>
        
        {/* Placeholder for actual auth form */}
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-parent-accent"
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-parent-accent"
          />
          <button className="w-full py-2 bg-parent-accent text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
            Login
          </button>
        </div>
      </div>
    </main>
  );
}