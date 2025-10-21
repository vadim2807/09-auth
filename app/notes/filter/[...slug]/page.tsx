import type { Metadata } from 'next';
import NotesClient from './Notes.client';

interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
}

export const metadata: Metadata = {
  title: "Notes | NoteHub",
  description: "View and manage your notes.",
};

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;
  const tag = slug?.[0] === 'All' ? undefined : slug?.[0];

  return <NotesClient tag={tag} />;
}
