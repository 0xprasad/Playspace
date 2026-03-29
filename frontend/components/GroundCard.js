import Link from 'next/link';

export default function GroundCard({ ground }) {
  return (
    <div className="card">
      <h3>{ground.name}</h3>
      <p className="muted">
        {ground.address}, {ground.city}
      </p>
      <p>₹{ground.pricePerHour}/hour</p>
      <p className="muted">Amenities: {ground.amenities.join(', ')}</p>
      <Link href={`/grounds/${ground.id}`} className="btn">
        View Slots
      </Link>
    </div>
  );
}
