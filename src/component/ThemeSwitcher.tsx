'use client';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
export const ThemeSwitcher = ({ className }: { className: string }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <ToastContainer position="top-left" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme={theme === 'light' ? 'light' : 'dark'} />
      <button className={className} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'light' ? <FaMoon /> : <FaSun />}
      </button>
    </>
  );
};
