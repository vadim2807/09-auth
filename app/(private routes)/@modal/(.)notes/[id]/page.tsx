import NotePreview from './NotePreview.client';

interface NoteModalPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoteModalPage({ params }: NoteModalPageProps) {
  await params;

  return <NotePreview />;
}

