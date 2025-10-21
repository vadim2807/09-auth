'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '../../../../lib/api/clientApi';
import css from './NoteDetail.module.css';

interface NoteDetailClientProps {
  noteId: string;
}

export default function NoteDetailClient({ noteId }: NoteDetailClientProps) {
  const router = useRouter();
  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className={css.container}>
        <p>Loading, please wait...</p>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className={css.container}>
        <p>Something went wrong.</p>
        <button onClick={handleBack} className={css.button}>Go Back</button>
      </div>
    );
  }

  const formattedDate = note.updatedAt
    ? `Updated at: ${new Date(note.updatedAt).toLocaleDateString()}`
    : `Created at: ${new Date(note.createdAt).toLocaleDateString()}`;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <span className={css.tag}>{note.tag}</span>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{formattedDate}</p>
        <button onClick={handleBack} className={css.backBtn}>Go Back</button>
      </div>
    </div>
  );
}
