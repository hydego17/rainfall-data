import '@/styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';

import MantineProvider from '@/lib/mantine';

export default function App({ Component, pageProps }: AppProps) {
  // Create global queryClient instance
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 seconds
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <MantineProvider>
            <Component {...pageProps} />
        </MantineProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
