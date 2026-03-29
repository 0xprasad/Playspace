import Link from 'next/link';

export default function NavBar() {
  return (
    <div className="nav">
      <Link href="/">Home</Link>
      <Link href="/user">User</Link>
      <Link href="/staff">Staff</Link>
      <Link href="/admin">Admin</Link>
    </div>
  );
}
