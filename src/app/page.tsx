'use client';
import { useEffect, useState } from 'react';

import Navbar from './components/navbar';

import Footer from './components/footer';

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {windowWidth > 1023 && (
        <div className='flex flex-col min-h-screen h-full p-4 bg-gray-100'>
          <div className='w-full h-full pb-4'>
            <Navbar />
          </div>
          <div className='w-full h-full bg-grid bg-white rounded-lg shadow mb-4'>
            <div className='flex w-full h-full space-x-6 px-14 items-center py-16 '>
              <div className='text-left w-1/2 flex flex-col space-y-3 h-full'>
                <div className='space-y-3 h-full flex flex-col justify-center'>
                  <p className='font-bold text-6xl'>Job Postings</p>
                  <div className='text-gray-600'>
                    <p className='font-bold text-xl'>
                      By the Guidance Department
                    </p>
                    <p className='font-bold text-md pt-4'>
                      Search for job postings by local companies.
                    </p>
                    <p className='font-bold text-md'>
                      Create an applicant account to apply for a job posting.
                    </p>
                  </div>

                  <div></div>
                  <a
                    href='/signup'
                    className='bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white hover:cursor-pointer rounded-lg w-fit font-bold'
                  >
                    Get Started
                  </a>
                </div>
              </div>
              <div className='w-1/2 flex-col my-auto p-6 rounded-xl bg-blue-50'>
                <img
                  src='https://cdn.pixabay.com/photo/2021/11/14/18/36/telework-6795505_1280.jpg'
                  className='rounded-xl'
                />
              </div>
            </div>
            <Footer />
          </div>
        </div>
      )}
      {windowWidth < 1024 && (
        <div className='flex flex-col min-h-screen h-full p-4 bg-gray-100'>
          <div className='w-full h-full pb-4'>
            <Navbar />
          </div>
          <div className='w-full h-full bg-grid bg-white rounded-lg shadow mb-4'>
            <div className='flex flex-col w-full h-full px-10 items-center py-16 '>
              <div className='text-center w-full flex flex-col space-y-3 h-full'>
                <div className='space-y-3 h-full flex flex-col justify-center'>
                  <p className='font-bold text-6xl'>Job Postings</p>
                  <div className='text-gray-600'>
                    <p className='font-bold text-xl'>
                      By the Guidance Department
                    </p>
                    <p className='font-bold text-md pt-4'>
                      Search for job postings by local companies.
                    </p>
                    <p className='font-bold text-md'>
                      Create an applicant account to apply for a job posting.
                    </p>
                  </div>

                  <div></div>
                  <a
                    href='/signup'
                    className='bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white hover:cursor-pointer rounded-lg w-full font-bold'
                  >
                    Get Started
                  </a>
                </div>
              </div>

              <div className='w-full flex-col mt-12 p-6 rounded-xl bg-blue-50'>
                <img
                  src='https://cdn.pixabay.com/photo/2021/11/14/18/36/telework-6795505_1280.jpg'
                  className='rounded-xl'
                />
              </div>
            </div>
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}
