import '@/styles/globals.scss';
import '@/styles/highcharts.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';

import MantineProvider from '@/lib/mantine';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { clsx } from '@mantine/core';

const links = [
  {
    label: 'Data BMKG',
    href: '/',
  },
  {
    label: 'Chart Generator',
    href: '/chart-generator',
  },
];

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

  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <MantineProvider>
          <div>
            <header className='p-4 border-b bg-white'>
              <nav className='container max-w-screen-xl flex gap-4'>
                {links.map((link) => {
                  let active = link.href === router.pathname;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={clsx(active ? 'text-slate-800 font-medium' : 'text-slate-500')}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </header>

            <Component {...pageProps} />
          </div>
        </MantineProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
