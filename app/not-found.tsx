import type { Metadata } from "next";
import css from './not-found.module.css';

export const metadata: Metadata = {
  title: "404 - Page Not Found | NoteHub",
  description: "Sorry, the page you are looking for does not exist. Return to NoteHub to continue managing your notes.",
  openGraph: {
    title: "404 - Page Not Found | NoteHub",
    description: "Sorry, the page you are looking for does not exist. Return to NoteHub to continue managing your notes.",
    url: "https://notehub.example.com/404",
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

export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </>
  );
}