import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'SJLVB & SJLKC Annual Function 2026',
  description: 'Official website for the SJLVB & SJLKC Annual Function — March 15, 2026. View schedule, events, register, and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
