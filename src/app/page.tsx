'use client';
import React, { useEffect } from 'react';
import { FaArrowRightLong, FaArrowsToCircle, FaFileImage, FaRegFileImage, FaRegFilePdf } from 'react-icons/fa6';
import Link from 'next/link';

const Home = () => {
  return (
    <>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex px-4 py-1.5 mx-auto rounded-full  ">
            <p className="text-4xl font-semibold tracking-widest text-g uppercase mt-10">CinC TOOLS</p>
          </div>
          <p className="mt-4 text-base leading-relaxed text-gray-600 group-hover:text-white">Tools Gratis Untuk Membantu Pekerjaan Anda</p>
        </div>
        <div className="grid grid-cols-1 gap-2 mt-12 sm:grid-cols-3 lg:mt-20   ">
          <Link href={'/imagetopdf'} className="transition-all duration-300 bg-white dark:bg-[#36393F] hover:bg-blue-500 dark:hover:bg-blue-500 hover:shadow-xl m-2 p-4 relative z-40 group">
            <div className="absolute bg-blue-500/50 top-0 left-0 w-24 h-1 z-30 transition-all duration-200 group-hover:bg-white group-hover:w-1/2"></div>
            <div className="py-2 px-9 relative">
              <div className="flex items-center space-x-4">
                <FaRegFileImage className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
                <FaArrowRightLong className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
                <FaRegFilePdf className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
              </div>
              <h3 className="mt-8 text-lg text-gray-500 font-semibold group-hover:text-white">Image TO PDF</h3>
              <p className="mt-4 text-base text-gray-600 group-hover:text-white">Ubah gambar menjadi PDF dengan mudah dan gratis dengan aplikasi ini</p>
            </div>
          </Link>

          <Link href={'/pdfmarge'} className="transition-all duration-300 bg-white dark:bg-[#36393F] hover:bg-blue-500 dark:hover:bg-blue-500 hover:shadow-xl m-2 p-4 relative z-40 group">
            <div className=" absolute bg-blue-500/50 top-0 left-0 w-24 h-1 z-30  transition-all duration-200   group-hover:bg-white group-hover:w-1/2  "></div>
            <div className="py-2 px-9 relative  ">
              <div className="flex items-center space-x-4">
                <FaRegFilePdf className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
                <FaArrowsToCircle className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
                <FaRegFilePdf className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
              </div>
              <h3 className="mt-8 text-lg text-gray-500 font-semibold group-hover:text-white ">PDF Marge</h3>
              <p className="mt-4 text-base text-gray-500 group-hover:text-white">Gabungkan beberapa PDF dengan mudah dan gratis dengan aplikasi ini.</p>
            </div>
          </Link>
          {/* 
          <Link href={'/pdfmarge'} className="transition-all  duration-1000 bg-white hover:bg-blue-500  hover:shadow-xl m-2 p-4 relative z-40 group  ">
            <div className=" absolute  bg-blue-500/50 top-0 left-0 w-24 h-1 z-30  transition-all duration-200   group-hover:bg-white group-hover:w-1/2  "></div>
            <div className="py-2 px-9 relative  ">
              <div className="flex items-center space-x-4">
                <FaRegFilePdf className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
                <FaArrowsToCircle className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
                <FaRegFilePdf className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
              </div>
              <h3 className="mt-8 text-lg font-semibold text-black group-hover:text-white ">PDF Marge</h3>
              <p className="mt-4 text-base text-gray-600 group-hover:text-white">Gabungkan beberapa PDF dengan mudah dan gratis dengan aplikasi ini.</p>
            </div>
          </Link>

          <Link href={'/pdfmarge'} className="transition-all  duration-1000 bg-white hover:bg-blue-500  hover:shadow-xl m-2 p-4 relative z-40 group  ">
            <div className=" absolute  bg-blue-500/50 top-0 left-0 w-24 h-1 z-30  transition-all duration-200   group-hover:bg-white group-hover:w-1/2  "></div>
            <div className="py-2 px-9 relative  ">
              <div className="flex items-center space-x-4">
                <FaRegFilePdf className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
                <FaArrowsToCircle className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
                <FaRegFilePdf className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
              </div>
              <h3 className="mt-8 text-lg font-semibold text-black group-hover:text-white ">PDF Marge</h3>
              <p className="mt-4 text-base text-gray-600 group-hover:text-white">Gabungkan beberapa PDF dengan mudah dan gratis dengan aplikasi ini.</p>
            </div>
          </Link>

          <Link href={'/pdfmarge'} className="transition-all  duration-1000 bg-white hover:bg-blue-500  hover:shadow-xl m-2 p-4 relative z-40 group  ">
            <div className=" absolute  bg-blue-500/50 top-0 left-0 w-24 h-1 z-30  transition-all duration-200   group-hover:bg-white group-hover:w-1/2  "></div>
            <div className="py-2 px-9 relative  ">
              <div className="flex items-center space-x-4">
                <FaRegFilePdf className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
                <FaArrowsToCircle className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
                <FaRegFilePdf className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
              </div>
              <h3 className="mt-8 text-lg font-semibold text-black group-hover:text-white ">PDF Marge</h3>
              <p className="mt-4 text-base text-gray-600 group-hover:text-white">Gabungkan beberapa PDF dengan mudah dan gratis dengan aplikasi ini.</p>
            </div>
          </Link>

          <Link href={'/pdfmarge'} className="transition-all  duration-1000 bg-white hover:bg-blue-500  hover:shadow-xl m-2 p-4 relative z-40 group  ">
            <div className=" absolute  bg-blue-500/50 top-0 left-0 w-24 h-1 z-30  transition-all duration-200   group-hover:bg-white group-hover:w-1/2  "></div>
            <div className="py-2 px-9 relative  ">
              <div className="flex items-center space-x-4">
                <FaRegFilePdf className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
                <FaArrowsToCircle className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
                <FaRegFilePdf className="w-16 h-16 fill-gray-400 group-hover:fill-white" />
              </div>
              <h3 className="mt-8 text-lg font-semibold text-black group-hover:text-white ">PDF Marge</h3>
              <p className="mt-4 text-base text-gray-600 group-hover:text-white">Gabungkan beberapa PDF dengan mudah dan gratis dengan aplikasi ini.</p>
            </div>
          </Link> */}
        </div>
      </div>
    </>
  );
};

export default Home;
