import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Link href={'/'} className="absolute top-0 left-0 mt-4 ml-4 p-4 bg-white dark:bg-[#36393F] rounded-full shadow-md">
        <FaArrowLeft />
      </Link>
      {children}
    </>
  );
}
