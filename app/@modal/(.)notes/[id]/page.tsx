import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '../../../../lib/utils/queryClient';
import { fetchNoteById } from '../../../../lib/api/serverApi';
import NotePreview from './NotePreview.client';

interface NoteModalPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoteModalPage({ params }: NoteModalPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview noteId={id} />
    </HydrationBoundary>
  );
}

