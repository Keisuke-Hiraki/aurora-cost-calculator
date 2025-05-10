import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aurora Cost Calculator',
  description: 'AWS Auroraのコスト計算ツール - Aurora StandardとI/O-Optimizedの損益分岐点を計算',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <header className="bg-amazon-navy text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Aurora Cost Calculator</h1>
            <p className="text-sm text-gray-300">AWS Auroraのコスト最適化ツール</p>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Aurora Cost Calculator</p>
        </footer>
      </body>
    </html>
  );
}
