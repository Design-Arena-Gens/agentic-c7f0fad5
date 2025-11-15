import './globals.css';

export const metadata = {
  title: 'AI Productivity Showcase',
  description: 'AI avatar narrates a high-energy showcase of productivity tools with cinematic B-roll.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
