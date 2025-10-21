'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../../lib/store/authStore';
import { checkSession } from '../../lib/api/clientApi';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearIsAuthenticated, setLoading, isLoading, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      const checkAuth = async () => {
        setLoading(true);
        try {
          const user = await checkSession();
          if (user) {
            setUser(user);
          } else {
            clearIsAuthenticated();
          }
        } catch {
          clearIsAuthenticated();
        }
      };

      checkAuth();
    }
  }, [setUser, clearIsAuthenticated, setLoading, isInitialized]);

  if (isLoading && !isInitialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}

