'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type NoteTag } from '../../types/note';
import css from './TagsMenu.module.css';

const TAGS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export default function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div 
      className={css.menuContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href="/notes/filter/All" className={css.menuTrigger}>
        Notes
      </Link>
      {isOpen && (
        <ul className={css.menuList}>
          <li className={css.menuItem}>
            <Link 
              href="/notes/filter/All" 
              className={css.menuLink}
              onClick={handleLinkClick}
            >
              All notes
            </Link>
          </li>
          {TAGS.map((tag) => (
            <li key={tag} className={css.menuItem}>
              <Link 
                href={`/notes/filter/${tag}`} 
                className={css.menuLink}
                onClick={handleLinkClick}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}