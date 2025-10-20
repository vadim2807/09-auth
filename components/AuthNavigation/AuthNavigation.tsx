'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/authStore';
import { logout } from '../../lib/api/clientApi';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, clearIsAuthenticated } = useAuthStore();

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      await logout();
      clearIsAuthenticated();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <>
        <li>
          <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
            Login
          </Link>
        </li>
        <li>
          <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
            Sign up
          </Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li>
        <Link href="/profile" prefetch={false} className={css.navigationLink}>
          Profile
        </Link>
      </li>
      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user?.email}</p>
        <a href="#" className={css.logoutLink} onClick={handleLogout}>
          Logout
        </a>
      </li>
    </>
  );
}

