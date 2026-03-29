import './globals.css';

export const metadata = {
  title: 'Playspace',
  description: 'Sports infrastructure platform'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
