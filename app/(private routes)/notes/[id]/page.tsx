import type { Metadata } from 'next';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '../../../../lib/utils/queryClient';
import { fetchNoteById } from '../../../../lib/api/serverApi';
import NoteDetailClient from './NoteDetail.client';

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const note = await fetchNoteById(id);
    return {
      title: `${note.title} | NoteHub`,
      description: note.content.substring(0, 160),
    };
  } catch {
    return {
      title: "Note Details | NoteHub",
      description: "View detailed information about a specific note.",
    };
  }
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailClient noteId={id} />
    </HydrationBoundary>
  );
}
