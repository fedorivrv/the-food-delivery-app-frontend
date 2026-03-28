import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/NavBar/NavBar';

export const metadata: Metadata = {
  title: 'Delivery — Food at Your Door',
  description: 'Order food from the best local restaurants',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
