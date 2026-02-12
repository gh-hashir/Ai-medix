import "./globals.css";
import SessionProvider from '@/components/providers/SessionProvider'
import Cursor from '@/components/Cursor'

export const metadata = {
  title: "AI Medix — AI Medicine Finder",
  description: "Find the right medicine instantly. Get medicine names, chemical formulas, brand names, dosage info — all powered by AI. 100% free.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Cursor />
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
