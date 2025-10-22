import { QueryClient } from '@tanstack/react-query';

let client: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    });
  } else {
    // Browser: make a new query client if we don't already have one
    if (!client) client = new QueryClient();
    return client;
  }
}
