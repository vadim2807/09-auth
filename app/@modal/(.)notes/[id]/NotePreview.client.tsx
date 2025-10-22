'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '../../../../lib/api/clientApi';
import Modal from '../../../../components/Modal/Modal';
import css from './NotePreview.module.css';

interface NotePreviewProps {
  noteId: string;
}

export default function NotePreview({ noteId }: NotePreviewProps) {
  const router = useRouter();

  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: !!noteId,
    refetchOnMount: false,
  });

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/notes/filter/All');
    }
  };

  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        <div className={css.container}>
          <p>Loading, please wait...</p>
        </div>
      </Modal>
    );
  }

  if (error || !note) {
    return (
      <Modal onClose={handleClose}>
        <div className={css.container}>
          <p>Something went wrong.</p>
          <button onClick={handleClose}>Close</button>
        </div>
      </Modal>
    );
  }

  const formattedDate = note.updatedAt
    ? `Updated at: ${new Date(note.updatedAt).toLocaleDateString()}`
    : `Created at: ${new Date(note.createdAt).toLocaleDateString()}`;

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          {note.tag && <p className={css.tag}>Tag: {note.tag}</p>}
          <p className={css.date}>{formattedDate}</p>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
}

