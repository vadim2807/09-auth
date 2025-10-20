import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
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
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content.substring(0, 160),
        url: `https://notehub.example.com/notes/${id}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: note.title,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: "Note Not Found | NoteHub",
      description: "The requested note could not be found.",
    };
  }
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  
  const queryClient = new QueryClient();

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
