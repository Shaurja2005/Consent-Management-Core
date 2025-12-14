import { useState, useEffect } from 'react';


interface Purpose {
  id: string;
  code: string;
  description: string;
  retentionPeriod: number;
}

interface Consent {
  id: string;
  userId: string;
  clientId: string;
  status: 'GRANTED' | 'REVOKED' | 'DENIED';
  auditId: string;
  createdAt: string;
  updatedAt: string;
  purpose: Purpose;
}

// Minimalistic Icon Components purely for this file if lucide-react isn't installed, 
// strictly using SVG to avoid dependency issues if user lacks the package. 
// I will assume standard Lucide icons might not be installed, so I'll fallback to SVG if needed, 
// But standard React/Vite usually handles imports if installed. 
// To be safe and self-contained, I will use inline SVGs for the "premium" feel without extra deps.
const Icons = {
  Shield: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Receipt: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  Refresh: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
};

function App() {
  const [userId, setUserId] = useState<string>('user-test-1');
  const [consents, setConsents] = useState<Consent[]>([]);
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);

  const fetchConsents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/v1/consent/list?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setConsents(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsents();
    const interval = setInterval(fetchConsents, 2000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleRevoke = async (consent: Consent) => {
    if (!confirm(`Are you sure you want to revoke consent for ${consent.purpose.code}?`)) return;

    try {
      const res = await fetch('http://localhost:3000/api/v1/consent/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: consent.userId,
          clientId: consent.clientId,
          purposeId: consent.purpose.code,
        }),
      });

      if (res.ok) {
        alert('Consent Revoked Successfully');
        fetchConsents();
      } else {
        const data = await res.json();
        alert(`Failed to revoke: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <Icons.Shield />
            <span className="font-bold text-lg tracking-tight text-slate-900">PrivacyHub</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1.5 border border-transparent focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <span className="text-xs text-gray-400 font-medium mr-2 uppercase tracking-wide">ID</span>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-slate-700 w-32 placeholder-gray-400 font-mono"
                placeholder="User ID"
              />
            </div>
            <button
              onClick={fetchConsents}
              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-gray-50"
              title="Refresh Data"
            >
              <Icons.Refresh />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Mobile Input Fallback */}
        <div className="md:hidden mb-6">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Simulate User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm shadow-sm"
          />
        </div>

        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Consents</h1>
            <p className="text-slate-500 mt-1">Manage data permissions granted to third-party applications.</p>
          </div>
          <div className="text-sm text-gray-400 hidden sm:block">
            Auto-refreshing active
          </div>
        </div>

        {loading && consents.length === 0 ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading permissions...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {consents.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <Icons.Shield />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No Active Permissions</h3>
                <p className="text-gray-500 mt-1 max-w-sm mx-auto">You haven't granted any applications access to your data yet. Run the demo client to see activity here.</p>
              </div>
            ) : (
              consents.map((c) => (
                <div key={c.id} className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">

                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide border ${c.status === 'GRANTED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                        {c.status === 'GRANTED' && <Icons.Check />}
                        {c.status}
                      </div>
                      <span className="text-xs text-gray-400 font-mono">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 mb-1">{c.purpose.description}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-slate-600">{c.purpose.code}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-6 py-3 border-t border-dashed border-gray-100 bg-gray-50/50 flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Authenticated Client</p>
                    <p className="text-sm font-medium text-slate-700">{c.clientId}</p>
                  </div>

                  {/* Card Actions */}
                  <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
                    <button
                      onClick={() => setReceipt(c.auditId)}
                      className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors"
                    >
                      <Icons.Receipt />
                      View Receipt
                    </button>

                    {c.status === 'GRANTED' ? (
                      <button
                        onClick={() => handleRevoke(c)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-md transition-colors"
                      >
                        Revoke Access
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Access Revoked</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setReceipt(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden transform transition-all">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-lg text-slate-900">Compliance Receipt</h3>
              <button onClick={() => setReceipt(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <Icons.X />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Immutable Audit Hash (SHA-256)</p>
                <code className="block text-xs font-mono text-indigo-600 break-all bg-white p-3 rounded border border-slate-200">
                  {receipt}
                </code>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-emerald-500">
                  <Icons.Shield />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  This cryptographic receipt is permanently stored in the compliance ledger. It serves as irrefutable proof that this consent transaction occurred and was authorized by the user.
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 text-center">
              <button
                onClick={() => setReceipt(null)}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
