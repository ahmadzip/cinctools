import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/app/component/theme-provider';
import { ThemeSwitcher } from '@/app/component/ThemeSwitcher';
import React from 'react';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 dark:bg-[#202225] duration-200 flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeSwitcher />
          <main className="flex-grow">{children}</main>
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
