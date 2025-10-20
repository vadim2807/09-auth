'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api/clientApi';
import { type NoteTag } from '../../types/note';
import { useNoteStore } from '../../lib/store/noteStore';
import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState<NoteTag>('Todo');
  const [errors, setErrors] = useState({ title: '', content: '' });

  // Load draft on mount
  useEffect(() => {
    setTitle(draft.title);
    setContent(draft.content);
    setTag(draft.tag);
  }, [draft]);

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      clearDraft();
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.back();
    },
  });

  const validateTitle = (value: string): string => {
    if (!value.trim()) return 'Title is required';
    if (value.length < 3) return 'Title must be at least 3 characters';
    if (value.length > 50) return 'Title must be at most 50 characters';
    return '';
  };

  const validateContent = (value: string): string => {
    if (value.length > 500) return 'Content must be at most 500 characters';
    return '';
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    setDraft({ title: value });
    setErrors(prev => ({ ...prev, title: validateTitle(value) }));
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    setDraft({ content: value });
    setErrors(prev => ({ ...prev, content: validateContent(value) }));
  };

  const handleTagChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as NoteTag;
    setTag(value);
    setDraft({ tag: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const titleError = validateTitle(title);
    const contentError = validateContent(content);

    if (titleError || contentError) {
      setErrors({ title: titleError, content: contentError });
      return;
    }

    createNoteMutation.mutate({ title, content, tag });
  };

  const handleCancel = () => {
    // Don't clear draft on cancel
    router.back();
  };

  const isValid = !errors.title && !errors.content && title.trim().length >= 3;

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={title}
          onChange={handleTitleChange}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={content}
          onChange={handleContentChange}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={tag}
          onChange={handleTagChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={handleCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={!isValid || createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
