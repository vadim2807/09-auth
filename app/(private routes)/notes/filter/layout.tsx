import css from './LayoutNotes.module.css';

interface FilterLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function FilterLayout({ children, sidebar }: FilterLayoutProps) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>
        {sidebar}
      </aside>
      <main className={css.notesWrapper}>
        {children}
      </main>
    </div>
  );
}
