import GroundCard from '@/components/GroundCard';
import NavBar from '@/components/NavBar';
import { grounds } from '@/lib/mockData';

export default function HomePage() {
  return (
    <main className="container">
      <h1>🏏 Playspace</h1>
      <p className="muted">Book grounds, manage slots, and run operations in one platform.</p>
      <NavBar />

      <div className="grid grid-3">
        {grounds.map((ground) => (
          <GroundCard key={ground.id} ground={ground} />
        ))}
      </div>
    </main>
  );
}
