'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote as apiDeleteNote } from '../../lib/api/clientApi';
import { type Note } from '../../types/note';
import Link from 'next/link';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: apiDeleteNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      await queryClient.refetchQueries({ queryKey: ['notes'] });
    },
  });

  if (notes.length === 0) {
    return null;
  }

  const handleDelete = (noteId: string) => {
    deleteNoteMutation.mutate(noteId);
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link 
                href={`/notes/${note.id}`}
                style={{
                  padding: '6px 12px',
                  fontSize: '14px',
                  color: '#fff',
                  backgroundColor: '#0d6efd',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                View details
              </Link>
              <button 
                style={{
                  padding: '6px 12px',
                  fontSize: '14px',
                  color: '#fff',
                  backgroundColor: '#dc3545',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => handleDelete(note.id)}
                disabled={deleteNoteMutation.isPending}
              >
                {deleteNoteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
