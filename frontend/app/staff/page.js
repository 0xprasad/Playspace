import NavBar from '@/components/NavBar';

export default function StaffDashboardPage() {
  return (
    <main className="container">
      <h2>Staff Dashboard</h2>
      <p className="muted">Manage slot availability and walk-in bookings in real time.</p>
      <NavBar />

      <div className="grid grid-3">
        <div className="card">
          <h4>Today's Slots</h4>
          <p>36 total · 28 booked · 4 blocked</p>
        </div>
        <div className="card">
          <h4>Walk-ins</h4>
          <p>Add and confirm offline bookings instantly</p>
          <button className="btn">Add Walk-in Booking</button>
        </div>
        <div className="card">
          <h4>Actions</h4>
          <p>Block / Unblock slot operations available</p>
        </div>
      </div>
    </main>
  );
}
