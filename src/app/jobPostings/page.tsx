'use client';
import { useEffect, useState } from 'react';

import { a } from '../config';
import SideNav from '../components/sidenav';
import dayjs from 'dayjs';

export default function Home() {
  const [jobPostings, setJobPostings] = useState<
    {
      id: number;
      title: string;
      description: string;
      address: string;
      createdAt: string;
      author: { companyName: string; email: string; phoneNumber: string };
      applicants: { username: string; id: number }[];
    }[]
  >([]);
  const [applicantId, setApplicantId] = useState(-1);
  const [currentPage, setCurrentPage] = useState('All Postings');

  const [currentJobPosting, setCurrentJobPosting] = useState<{
    id: number;
    title: string;
    description: string;
    address: string;
    createdAt: string;
    author: { companyName: string; email: string; phoneNumber: string };
    applicants: { username: string; id: number }[];
  }>({
    id: -1,
    title: '...',
    description: '...',
    address: '',
    createdAt: '...',
    author: { companyName: '...', email: '', phoneNumber: '' },
    applicants: [],
  });

  const [currentAppliedJobPosting, setCurrentAppliedJobPosting] = useState<{
    id: number;
    title: string;
    description: string;
    address: string;
    createdAt: string;
    author: { companyName: string; email: string; phoneNumber: string };
    applicants: { username: string; id: number }[];
  }>({
    id: -1,
    title: '...',
    description: '...',
    address: '',
    createdAt: '...',
    author: { companyName: '...', email: '', phoneNumber: '' },
    applicants: [],
  });

  const [appliedJobPostings, setAppliedJobPostings] = useState([]);

  const getOpenJobPostings = async () => {
    const { data: response } = await a.get('/jobPostings');

    setJobPostings(response);

    setCurrentJobPosting(response[0]);

    console.log(response);
  };

  const applyToJobPosting = async (jobPostingId: number) => {
    const { data: response } = await a.put(
      `/jobPostings/apply/${jobPostingId}?applicantId=${+applicantId}`,
    );

    if (response) {
      const { data: response2 } = await a.get(`/jobPostings/${jobPostingId}`);
      setCurrentJobPosting(response2);
      console.log(response2);
      getAppliedJobPostings();
    }
  };

  const truncate = (str: string, truncateLength: number) => {
    if (str.length > truncateLength) {
      return str.slice(0, truncateLength) + '...';
    } else {
      return str;
    }
  };

  const checkIfApplied = () => {
    let isApplied = false;
    for (let i = 0; i < currentJobPosting?.applicants?.length; i++) {
      if (currentJobPosting?.applicants[i]?.id === applicantId) {
        isApplied = true;
        break;
      }
    }
    return isApplied;
  };

  const getAppliedJobPostings = async () => {
    const { data: response } = await a.get(
      `/applicants/${
        JSON.parse(localStorage.getItem('Applicant')!).applicantId
      }`,
    );
    setAppliedJobPostings(response.appliedPostings);
    if (currentAppliedJobPosting?.id === -1) {
      setCurrentAppliedJobPosting(response.appliedPostings[0]);
    }

    console.log(response);
  };

  useEffect(() => {
    setApplicantId(+JSON.parse(localStorage.getItem('Applicant')!).applicantId);
    getOpenJobPostings();
    getAppliedJobPostings();
  }, []);

  return (
    <div className='bg-white flex h-screen w-full'>
      <div className='bg-blue-500 w-fit'>
        <SideNav current={currentPage} setCurrent={setCurrentPage} />
      </div>
      {currentPage === 'All Postings' && (
        <div className='flex bg-grid w-full h-full min-h-screen p-8 space-x-4'>
          <div className='flex flex-col space-y-4 overflow-auto'>
            {jobPostings.map(
              (
                v: {
                  title: string;
                  description: string;
                  createdAt: string;
                  address: string;
                  author: {
                    companyName: string;
                    email: string;
                    phoneNumber: string;
                  };
                  id: number;
                  applicants: { username: string; id: number }[];
                },
                i,
              ) => {
                return (
                  <div key={i} className='group'>
                    <div
                      onClick={() => setCurrentJobPosting(v)}
                      className='shadow-sm group-hover:cursor-pointer group-hover:shadow-md flex flex-col bg-white w-full h-fit rounded-lg border border-gray-300 px-8 py-6'
                    >
                      <div className='group-hover:cursor-pointer'>
                        <p className='font-bold group-hover:underline'>
                          {v.title}
                        </p>
                        <p className='font-medium mt-2 text-sm/6'>
                          {truncate(v.description, 50)}
                        </p>
                        <p className='font-medium text-xs mt-2 text-gray-500'>
                          {v.author?.companyName}
                        </p>
                        <p className='font-medium text-xs mt-1 text-gray-500'>
                          Created on {dayjs(v.createdAt).format('MM/DD/YYYY')}{' '}
                        </p>
                        <p className='font-medium text-xs mt-1 text-gray-500'>
                          {v.address || 'No address listed'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
          <div className='w-full h-full bg-white rounded-lg border border-gray-300 shadow-md'>
            <div className='border-b h-fit'>
              <div className='px-6 py-6'>
                <p className='font-bold text-2xl'>{currentJobPosting?.title}</p>
                <p className='font-medium text-gray-600 mt-1 text-sm'>
                  {currentJobPosting?.author?.companyName}
                </p>
                <div
                  onClick={() => {
                    !checkIfApplied() &&
                      applyToJobPosting(currentJobPosting.id);
                  }}
                  className={`w-fit h-fit px-4 py-2 mt-4 rounded-md ${
                    checkIfApplied()
                      ? 'bg-white border hover:cursor-not-allowed text-gray-600'
                      : 'bg-blue-500 hover:cursor-pointer hover:bg-blue-600 text-white'
                  } font-bold text-center`}
                >
                  {checkIfApplied()
                    ? 'Applied for this posting'
                    : 'Apply for this posting'}
                </div>
              </div>
            </div>
            <div className=''>
              <div className='space-y-1 px-6 py-8 border-b'>
                <p className='text-lg font-bold'>Date created</p>
                <p className='text-sm text-gray-600'>
                  On {dayjs(currentJobPosting?.createdAt).format('dddd')}
                  {', '}
                  {dayjs(currentJobPosting?.createdAt).format(
                    'MM/DD/YYYY',
                  )} at {dayjs(currentJobPosting?.createdAt).format('h:mm a')}
                </p>
              </div>
              <div className='space-y-1 px-6 py-8 border-b'>
                <p className='text-lg font-bold'>Employer Information</p>
                <p className='text-sm text-gray-600'>
                  {currentJobPosting?.author?.companyName}
                </p>
                <p className='text-sm text-gray-600'>
                  {currentJobPosting?.address === ''
                    ? 'No address listed'
                    : currentJobPosting?.address || 'No address listed'}
                </p>
                <p className='text-sm text-gray-600'>
                  {currentJobPosting?.author?.email === ''
                    ? 'No email listed'
                    : currentJobPosting?.author?.email || 'No email listed'}
                </p>
                <p className='text-sm text-gray-600'>
                  {currentJobPosting?.author?.phoneNumber === ''
                    ? 'No phone number listed'
                    : currentJobPosting?.author?.phoneNumber ||
                      'No phone number listed'}
                </p>
              </div>
              <div className='space-y-1 px-6 py-8'>
                <p className='text-lg font-bold'>Full description</p>
                <p className='text-sm text-gray-600'>
                  {currentJobPosting?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {currentPage === 'Applied Postings' && (
        <div className='flex bg-grid w-full h-full min-h-screen p-8 space-x-4'>
          <div className='flex flex-col space-y-4 w-fit overflow-auto'>
            {appliedJobPostings?.map(
              (
                v: {
                  title: string;
                  description: string;
                  createdAt: string;
                  address: string;
                  author: {
                    companyName: string;
                    email: string;
                    phoneNumber: string;
                  };
                  id: number;
                  applicants: { username: string; id: number }[];
                },
                i,
              ) => {
                return (
                  <div key={i} className='group'>
                    <div
                      onClick={() => setCurrentAppliedJobPosting(v)}
                      className='shadow-sm w-fit group-hover:cursor-pointer group-hover:shadow-md flex flex-col bg-white w-full h-fit rounded-lg border border-gray-300 px-8 py-6'
                    >
                      <div className='group-hover:cursor-pointer'>
                        <p className='font-bold group-hover:underline'>
                          {v.title}
                        </p>
                        <p className='font-medium mt-2 text-sm/6'>
                          {truncate(v.description, 50)}
                        </p>
                        <p className='font-medium text-xs mt-2 text-gray-500'>
                          {v.author?.companyName}
                        </p>
                        <p className='font-medium text-xs mt-1 text-gray-500'>
                          Created on {dayjs(v.createdAt).format('MM/DD/YYYY')}{' '}
                        </p>
                        <p className='font-medium text-xs mt-1 text-gray-500'>
                          {v.address || 'No address listed'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
          <div className='w-full h-full bg-white rounded-lg border border-gray-300 shadow-md'>
            <div className='border-b h-fit'>
              <div className='px-6 py-6'>
                <p className='font-bold text-2xl'>
                  {currentAppliedJobPosting?.title}
                </p>
                <p className='font-medium text-gray-600 mt-1 text-sm'>
                  {currentAppliedJobPosting?.author?.companyName}
                </p>
                <div
                  className={`w-fit h-fit px-4 py-2 mt-4 rounded-md bg-white border hover:cursor-not-allowed text-gray-600 font-bold text-center`}
                >
                  Applied for this posting
                </div>
              </div>
            </div>
            <div className=''>
              <div className='space-y-1 px-6 py-8 border-b'>
                <p className='text-lg font-bold'>Date created</p>
                <p className='text-sm text-gray-600'>
                  On {dayjs(currentAppliedJobPosting?.createdAt).format('dddd')}
                  {', '}
                  {dayjs(currentAppliedJobPosting?.createdAt).format(
                    'MM/DD/YYYY',
                  )}{' '}
                  at{' '}
                  {dayjs(currentAppliedJobPosting?.createdAt).format('h:mm a')}
                </p>
              </div>
              <div className='space-y-1 px-6 py-8 border-b'>
                <p className='text-lg font-bold'>Employer Information</p>
                <p className='text-sm text-gray-600'>
                  {currentAppliedJobPosting?.author?.companyName}
                </p>
                <p className='text-sm text-gray-600'>
                  {currentAppliedJobPosting?.address === ''
                    ? 'No address listed'
                    : currentJobPosting?.address || 'No address listed'}
                </p>
                <p className='text-sm text-gray-600'>
                  {currentAppliedJobPosting?.author?.email === ''
                    ? 'No email listed'
                    : currentJobPosting?.author?.email || 'No email listed'}
                </p>
                <p className='text-sm text-gray-600'>
                  {currentAppliedJobPosting?.author?.phoneNumber === ''
                    ? 'No phone number listed'
                    : currentJobPosting?.author?.phoneNumber ||
                      'No phone number listed'}
                </p>
              </div>
              <div className='space-y-1 px-6 py-8'>
                <p className='text-lg font-bold'>Full description</p>
                <p className='text-sm text-gray-600'>
                  {currentAppliedJobPosting?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
