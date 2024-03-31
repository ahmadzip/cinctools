'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/component/ThemeProvider';
import { ThemeSwitcher } from '@/component/ThemeSwitcher';
import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';
import RuningText from '@/component/RunningText';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 dark:bg-[#202225] duration-200 flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="flex-grow">
            <Link href={'/'} className="absolute top-0 left-0 mt-4 ml-4 p-4 bg-white dark:bg-[#36393F] rounded-full shadow-md">
              <FaArrowLeft />
            </Link>
            <ThemeSwitcher className="absolute top-0 right-0 mt-4 mr-4 p-4 bg-white dark:bg-[#36393F] rounded-full shadow-md " />
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
