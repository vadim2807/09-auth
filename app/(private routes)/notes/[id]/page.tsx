import type { Metadata } from 'next';
import NoteDetailClient from './NoteDetail.client';

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Note Details | NoteHub",
  description: "View detailed information about a specific note.",
};

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;

  return <NoteDetailClient noteId={id} />;
}
