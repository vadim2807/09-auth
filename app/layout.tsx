import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";
import AuthProvider from "../components/AuthProvider/AuthProvider";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  variable: "--font-roboto",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "NoteHub - Your Personal Note Manager",
  description: "A simple and efficient application for managing personal notes. Create, organize, and filter your notes with ease.",
  openGraph: {
    title: "NoteHub - Your Personal Note Manager",
    description: "A simple and efficient application for managing personal notes. Create, organize, and filter your notes with ease.",
    url: "https://notehub.example.com",
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

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <AuthProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <main style={{ flex: 1 }}>
                {children}
              </main>
              <Footer />
            </div>
            {modal}
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}

