import NavBar from '@/components/NavBar';

export default function UserDashboardPage() {
  return (
    <main className="container">
      <h2>User Dashboard</h2>
      <p className="muted">View bookings, upcoming matches, and payment history.</p>
      <NavBar />

      <div className="grid grid-3">
        <div className="card">
          <h4>My Bookings</h4>
          <p>2 upcoming, 14 completed</p>
        </div>
        <div className="card">
          <h4>Pending Payments</h4>
          <p>1 booking awaiting payment confirmation</p>
        </div>
        <div className="card">
          <h4>Saved Grounds</h4>
          <p>5 grounds bookmarked</p>
        </div>
      </div>
    </main>
  );
}
