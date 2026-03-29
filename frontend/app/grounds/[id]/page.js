import NavBar from '@/components/NavBar';
import { grounds, slots } from '@/lib/mockData';

export default function GroundDetailPage({ params }) {
  const ground = grounds.find((item) => item.id === Number(params.id));
  const groundSlots = slots.filter((slot) => slot.groundId === Number(params.id));

  if (!ground) {
    return (
      <main className="container">
        <NavBar />
        <p>Ground not found.</p>
      </main>
    );
  }

  return (
    <main className="container">
      <NavBar />
      <h2>{ground.name}</h2>
      <p className="muted">
        {ground.address}, {ground.city}
      </p>

      <div className="grid">
        {groundSlots.map((slot) => (
          <div key={slot.id} className="card">
            <strong>{slot.time}</strong>
            <p className="muted">Status: {slot.status}</p>
            <button className="btn" disabled={slot.status !== 'available'}>
              {slot.status === 'available' ? 'Book Now' : 'Unavailable'}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
