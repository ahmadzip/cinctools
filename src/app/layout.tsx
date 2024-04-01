'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/component/ThemeProvider';
import { ThemeSwitcher } from '@/component/ThemeSwitcher';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowDown, FaArrowLeft, FaArrowUp } from 'react-icons/fa6';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [scrollUp, setScrollUp] = useState(false) as [boolean | null, React.Dispatch<React.SetStateAction<boolean | null>>];

  useEffect(() => {
    const handleScroll = () => {
      let currentScrollY = document.documentElement.scrollTop;
      let maxScrollY = document.body.scrollHeight - window.innerHeight;
      if (currentScrollY > maxScrollY / 2) {
        setScrollUp(true);
      } else {
        setScrollUp(false);
      }
    };
    document.addEventListener('click', () => {
      console.log('click');
      let maxScrollY = document.body.scrollHeight - window.innerHeight;
      if (maxScrollY == 0) {
        setScrollUp(null);
      } else {
        setScrollUp(false);
      }
    });
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toTop = () => {
    if (scrollUp) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F4F6F9] dark:bg-[#202225] duration-200 flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="flex-grow">
            <Link href={'/'} className="fixed top-0 left-0 mt-4 ml-4 p-4 bg-white dark:bg-[#36393F] rounded-full shadow-md">
              <FaArrowLeft />
            </Link>
            <button onClick={toTop} className={`fixed bottom-0 right-0 mb-4 mr-4 p-4 bg-white dark:bg-[#36393F] rounded-full shadow-md ${scrollUp === null ? 'hidden' : 'block'}`}>
              {scrollUp ? <FaArrowUp /> : <FaArrowDown />}
            </button>
            <ThemeSwitcher className=" fixed top-0 right-0 mt-4 mr-4 p-4 bg-white dark:bg-[#36393F] rounded-full shadow-md " />
            {children}
          </main>
        </ThemeProvider>
        <footer className="flex flex-col items-center justify-center w-full h-24">
          <span className="text-base font-medium text-gray-400">
            Made with ❤️ by
            <a href="https://www.instagram.com/man.zip_/" target="_blank" rel="noopener noreferrer" className="text-[#774FE9]">
              {' '}
              @man.zip_
            </a>
          </span>
        </footer>
      </body>
    </html>
  );
}
