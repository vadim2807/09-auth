import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '../../../../../lib/api/serverApi';
import NotesClient from './Notes.client';

interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: FilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] || 'All';
  
  const tagDisplay = tag === 'All' ? 'All Notes' : `${tag} Notes`;
  const description = tag === 'All' 
    ? 'View and manage all your notes in one place'
    : `View and manage your notes filtered by ${tag} tag`;

  return {
    title: `${tagDisplay} | NoteHub`,
    description,
    openGraph: {
      title: `${tagDisplay} | NoteHub`,
      description,
      url: `https://notehub.example.com/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub Application",
        },
      ],
    },
  };
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;
  const tag = slug?.[0] === 'All' ? undefined : slug?.[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', { page: 1, perPage: 12, search: '', tag }],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
