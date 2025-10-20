import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type NoteTag } from '../../types/note';

export interface NoteDraft {
  title: string;
  content: string;
  tag: NoteTag;
}

const initialDraft: NoteDraft = {
  title: '',
  content: '',
  tag: 'Todo',
};

interface NoteStore {
  draft: NoteDraft;
  setDraft: (note: Partial<NoteDraft>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({
          draft: { ...state.draft, ...note },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'notehub-draft-storage',
    }
  )
);

