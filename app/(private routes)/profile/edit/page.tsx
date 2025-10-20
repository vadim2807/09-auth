'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getMe, updateMe } from '../../../../lib/api/clientApi';
import css from './EditProfile.module.css';

export default function EditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState('');

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: getMe,
  });

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      router.push('/profile');
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateMutation.mutate({ username });
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  if (isLoading) {
    return (
      <main className={css.mainContent}>
        <p>Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={css.mainContent}>
        <p>Failed to load profile</p>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className={css.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

