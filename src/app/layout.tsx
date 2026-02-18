import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat' 
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}