'use client';

import { useParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '../../../../lib/api/clientApi';
import css from '../NoteDetails.module.css';

export default function NoteDetailsClient() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;

  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: !!noteId,
  });

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/notes/filter/All');
    }
  };

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (error) {
    const axiosError = error as { response?: { status?: number } };
    if (axiosError?.response?.status === 404) {
      notFound();
    }
    return <p>Something went wrong.</p>;
  }

  if (!note) {
    notFound();
  }

  const formattedDate = note.updatedAt
    ? `Updated at: ${new Date(note.updatedAt).toLocaleDateString()}`
    : `Created at: ${new Date(note.createdAt).toLocaleDateString()}`;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <button onClick={handleGoBack}>Back</button>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{formattedDate}</p>
      </div>
    </div>
  );
}
