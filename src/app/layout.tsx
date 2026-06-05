import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PitchVerdict | AI Football Matchup Simulator & TV Lineup Broadcaster',
  description: 'Select teams from Europe’s top 10 leagues, tactical mentalities, view TV-style lineups, and simulate matchups with AI generated commentary.',
};

export default function RootLayout({
  children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
