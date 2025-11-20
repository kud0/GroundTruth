import { SolanaWalletProvider } from '@/components/WalletProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function MarketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SolanaWalletProvider>
        {children}
      </SolanaWalletProvider>
    </ThemeProvider>
  );
}
