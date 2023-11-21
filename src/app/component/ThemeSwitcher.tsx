'use client';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
export const ThemeSwitcher = () => {
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
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme={theme === 'light' ? 'light' : 'dark'} />
      <button className={`absolute top-0 right-0 mt-4 mr-4 p-4 bg-white dark:bg-[#36393F] rounded-full shadow-md`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'light' ? <FaMoon /> : <FaSun />}
      </button>
    </>
  );
};
