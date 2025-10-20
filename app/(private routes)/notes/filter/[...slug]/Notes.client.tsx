'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';
import SearchBox from '../../../../../components/SearchBox/SearchBox';
import Pagination from '../../../../../components/Pagination/Pagination';
import NoteList from '../../../../../components/NoteList/NoteList';
import { fetchNotes } from '../../../../../lib/api/clientApi';

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, tag]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['notes', { page: currentPage, perPage: 12, search: debouncedSearchTerm, tag }],
    queryFn: async () => {
      try {
        return await fetchNotes({
          page: currentPage,
          perPage: 12,
          search: debouncedSearchTerm,
          tag,
        });
      } catch (err) {
        const error = err as { response?: { status?: number } };
        if (error.response?.status === 400) {
          return { notes: [], totalPages: 0 };
        }
        throw err;
      }
    },
    placeholderData: (previousData) => previousData,
  });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div style={{ padding: '1rem' }}>
        <p>Could not fetch the list of notes. {error.message}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa' }}>
        <SearchBox value={searchTerm} onChange={handleSearchChange} />
        <Pagination
          currentPage={currentPage}
          totalPages={data?.totalPages || 0}
          onPageChange={handlePageChange}
        />
        <Link 
          href="/notes/action/create" 
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#0d6efd', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Create Note
        </Link>
      </div>

      {isLoading && !data ? (
        <p>Loading, please wait...</p>
      ) : data?.notes && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
}
