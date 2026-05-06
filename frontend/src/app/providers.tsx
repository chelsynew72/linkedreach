'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30000 } } }));
  return (
    <QueryClientProvider client={qc}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1928',
            color: '#f0eeff',
            border: '1px solid #272638',
            borderRadius: '10px',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#0b0a13' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#0b0a13' } },
        }}
      />
    </QueryClientProvider>
  );
}
