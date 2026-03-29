import NavBar from '@/components/NavBar';

export default function AdminDashboardPage() {
  return (
    <main className="container">
      <h2>Admin Control Center</h2>
      <p className="muted">Monitor platform operations, grounds, disputes, and integrations.</p>
      <NavBar />

      <div className="grid grid-3">
        <div className="card">
          <h4>Active Grounds</h4>
          <p>42 grounds across 3 cities</p>
        </div>
        <div className="card">
          <h4>Today's GMV</h4>
          <p>₹1,42,000</p>
        </div>
        <div className="card">
          <h4>Disputes Queue</h4>
          <p>3 open tickets</p>
        </div>
      </div>
    </main>
  );
}
