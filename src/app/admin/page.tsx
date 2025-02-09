/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { a } from '../config';
import SideNav from '../components/sidenav';
import { IJobPosting } from '../interfaces';
import { truncate } from '../helpers';
import dayjs from 'dayjs';
import Success from '../components/success';
import MobileNavbar from '../components/mobileNavbar';

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (window !== undefined) {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [currentPage, setCurrentPage] = useState('Pending Job Postings');
  const [approveSuccess, setApproveSuccess] = useState(false);
  const [declineSuccess, setDeclineSuccess] = useState(false);
  const [createEmployerSuccess, setCreateEmployerSuccess] = useState(false);
  const [pendingJobPostings, setPendingJobPostings] = useState<IJobPosting[]>(
    [],
  );
  const [acceptedJobPostings, setAcceptedJobPostings] = useState<IJobPosting[]>(
    [],
  );
  const [declinedJobPostings, setDeclinedJobPostings] = useState<IJobPosting[]>(
    [],
  );
  const [selectedPending, setSelectedPending] = useState<IJobPosting>({
    id: -1,
    title: '...',
    description: '...',
    address: '',
    createdAt: '...',
    author: { companyName: '...', email: '', phoneNumber: '' },
    applicants: [],
    postingStatus: 'OPEN',
    status: 'PENDING',
  });
  const [selectedAccepted, setSelectedAccepted] = useState<IJobPosting>({
    id: -1,
    title: '...',
    description: '...',
    address: '',
    createdAt: '...',
    author: { companyName: '...', email: '', phoneNumber: '' },
    applicants: [],
    postingStatus: 'OPEN',
    status: 'PENDING',
  });
  const [selectedDeclined, setSelectedDeclined] = useState<IJobPosting>({
    id: -1,
    title: '...',
    description: '...',
    address: '',
    createdAt: '...',
    author: { companyName: '...', email: '', phoneNumber: '' },
    applicants: [],
    postingStatus: 'OPEN',
    status: 'PENDING',
  });
  const [newEmployerUsername, setNewEmployerUsername] = useState('');
  const [newEmployerPassword, setNewEmployerPassword] = useState('');
  const [newEmployerCompanyName, setNewEmployerCompanyName] = useState('');
  const [newEmployerEmail, setNewEmployerEmail] = useState('');
  const [newEmployerPhoneNumber, setNewEmployerPhoneNumber] = useState('');
  const [allEmployers, setAllEmployers] = useState<any>([]);

  const authenticate = async () => {
    const { data: response } = await a.post('/admin', { password: password });
    if (response === 'Authenticated') {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  };

  const getPendingJobPostings = async () => {
    const { data: response } = await a.get(
      '/jobPostings/admin/getJobPostingsForAdmin?status=PENDING',
    );
    setPendingJobPostings(response);
    if (selectedPending.id === -1) {
      setSelectedPending(response[0]);
    }
  };

  const getAcceptedJobPostings = async () => {
    const { data: response } = await a.get(
      '/jobPostings/admin/getJobPostingsForAdmin?status=ACCEPTED',
    );
    setAcceptedJobPostings(response);
    if (selectedPending.id === -1) {
      setSelectedAccepted(response[0]);
    }
  };

  const getDeclinedJobPostings = async () => {
    const { data: response } = await a.get(
      '/jobPostings/admin/getJobPostingsForAdmin?status=DECLINED',
    );
    setDeclinedJobPostings(response);
    if (selectedPending.id === -1) {
      setSelectedDeclined(response[0]);
    }
  };

  const approveJobPosting = async (jobPostingId: number) => {
    const { data: response } = await a.put(
      `/jobPostings/approve/${jobPostingId}`,
    );
    if (response) {
      getPendingJobPostings();
      getAcceptedJobPostings();
      getDeclinedJobPostings();
      setApproveSuccess(true);
      const timer = setTimeout(() => {
        setApproveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  };

  const declineJobPosting = async (jobPostingId: number) => {
    const { data: response } = await a.put(
      `/jobPostings/decline/${jobPostingId}`,
    );
    if (response) {
      getPendingJobPostings();
      getPendingJobPostings();
      getAcceptedJobPostings();
      getDeclinedJobPostings();
      setDeclineSuccess(true);
      const timer = setTimeout(() => {
        setDeclineSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  };

  const createEmployer = async () => {
    const { data: response } = await a.post('/employers', {
      username: newEmployerUsername,
      password: newEmployerPassword,
      companyName: newEmployerCompanyName,
      phoneNumber:
        newEmployerPhoneNumber === '' ? null : newEmployerPhoneNumber,
      email: newEmployerEmail === '' ? null : newEmployerEmail,
    });
    if (response) {
      setNewEmployerUsername('');
      setNewEmployerCompanyName('');
      setNewEmployerEmail('');
      setNewEmployerPassword('');
      setNewEmployerPhoneNumber('');
      setCreateEmployerSuccess(true);
      getAllEmployers();
      const timer = setTimeout(() => {
        setCreateEmployerSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  };

  const getAllEmployers = async () => {
    const { data: response } = await a.get('/employers');
    setAllEmployers(response);
  };
  useEffect(() => {
    getPendingJobPostings();
    getAcceptedJobPostings();
    getDeclinedJobPostings();
    getAllEmployers();
  }, []);

  return (
    <div className='h-screen'>
      {authenticated === false ? (
        <div className='bg-grid h-screen w-full flex flex-col'>
          <div
            className={`mx-auto my-auto p-8 border border-gray-300 shadow-md bg-white rounded-lg ${
              windowWidth < 1024 ? 'min-w-[75%]' : 'min-w-[25%]'
            }`}
          >
            <div className='text-center text-2xl font-bold mb-5'>
              Admin Panel
            </div>
            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='block text-sm/6 font-bold text-gray-900'
                >
                  Password*
                </label>
              </div>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  onChange={(v) => setPassword(v.target.value)}
                  value={password}
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                />
              </div>
            </div>
            <div
              onClick={() => authenticate()}
              className='bg-blue-500 text-center mt-2 hover:bg-blue-600 hover:cursor-pointer text-white font-semibold rounded-md px-3 py-2'
            >
              Submit
            </div>
          </div>
        </div>
      ) : (
        <div className='w-full h-screen'>
          <div className='absolute pointer-events-none top-0 right-0'>
            <Success
              title={'Success!'}
              description={'Successfully approved a job posting.'}
              show={approveSuccess}
              setShow={setApproveSuccess}
            />
            <Success
              title={'Success'}
              description={'Successfully declined a job posting.'}
              show={declineSuccess}
              setShow={setDeclineSuccess}
            />
            <Success
              title={'Success'}
              description={'Successfully created an employer'}
              show={createEmployerSuccess}
              setShow={setCreateEmployerSuccess}
            />
          </div>
          {/* Desktop Starts here */}
          <div
            className={`bg-grid h-full w-full ${
              windowWidth > 1023 ? 'flex' : 'hidden'
            }`}
          >
            <div className='bg-blue-500 w-fit'>
              <SideNav
                current={currentPage}
                setCurrent={setCurrentPage}
                type={'admin'}
              />
            </div>
            {currentPage === 'Pending Job Postings' && (
              <div className='flex flex-col w-full h-full p-8 space-x-4'>
                <div className='flex w-full h-full p-8 space-x-4'>
                  <div className='flex flex-col space-y-4 overflow-auto'>
                    {pendingJobPostings.length ? (
                      pendingJobPostings.map((v: IJobPosting, i) => {
                        return (
                          <div key={i} className='group'>
                            <div
                              onClick={() => setSelectedPending(v)}
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
                                  Created on{' '}
                                  {dayjs(v.createdAt).format('MM/DD/YYYY')}{' '}
                                </p>
                                <p className='font-medium text-xs mt-1 text-gray-500'>
                                  {v.address || 'No address listed'}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className='font-semibold'>No Job Postings found</div>
                    )}
                  </div>
                  <div className='w-full h-full bg-white overflow-auto rounded-lg border border-gray-300 shadow-md'>
                    <div className='border-b h-fit'>
                      <div className='px-6 py-6'>
                        <p className='font-bold text-2xl'>
                          {selectedPending?.title}
                        </p>
                        <p className='font-medium text-gray-600 mt-1 text-sm'>
                          {selectedPending?.author?.companyName}
                        </p>
                        <div className='space-x-2 flex'>
                          <div
                            onClick={() =>
                              approveJobPosting(+selectedPending?.id)
                            }
                            className='w-fit h-fit px-4 py-2 mt-4 rounded-md bg-green-500 hover:cursor-pointer hover:bg-green-600 text-white font-bold text-center'
                          >
                            Accept this posting
                          </div>
                          <div
                            onClick={() =>
                              declineJobPosting(+selectedPending?.id)
                            }
                            className='w-fit h-fit px-4 py-2 mt-4 rounded-md bg-red-500 hover:cursor-pointer hover:bg-red-600 text-white font-bold text-center'
                          >
                            Decline this posting
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=''>
                      <div className='space-y-1 px-6 py-8 border-b'>
                        <p className='text-lg font-bold'>Date created</p>
                        <p className='text-sm text-gray-600'>
                          On {dayjs(selectedPending?.createdAt).format('dddd')}
                          {', '}
                          {dayjs(selectedPending?.createdAt).format(
                            'MM/DD/YYYY',
                          )}{' '}
                          at{' '}
                          {dayjs(selectedPending?.createdAt).format('h:mm a')}
                        </p>
                      </div>
                      <div className='space-y-1 px-6 py-8 border-b'>
                        <p className='text-lg font-bold'>
                          Employer Information
                        </p>
                        <p className='text-sm text-gray-600'>
                          {selectedPending?.author?.companyName}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {selectedPending?.address === ''
                            ? 'No address listed'
                            : selectedPending?.address || 'No address listed'}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {selectedPending?.author?.email === ''
                            ? 'No email listed'
                            : selectedPending?.author?.email ||
                              'No email listed'}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {selectedPending?.author?.phoneNumber === ''
                            ? 'No phone number listed'
                            : selectedPending?.author?.phoneNumber ||
                              'No phone number listed'}
                        </p>
                      </div>
                      <div className='space-y-1 px-6 py-8'>
                        <p className='text-lg font-bold'>Full description</p>
                        <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                          {selectedPending?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentPage === 'Accepted Job Postings' && (
              <div className='flex flex-col w-full h-full p-8 space-x-4'>
                <div className='flex w-full h-full p-8 space-x-4'>
                  <div className='flex flex-col space-y-4 overflow-auto'>
                    {acceptedJobPostings.length ? (
                      acceptedJobPostings.map((v: IJobPosting, i) => {
                        return (
                          <div key={i} className='group'>
                            <div
                              onClick={() => setSelectedAccepted(v)}
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
                                  Created on{' '}
                                  {dayjs(v.createdAt).format('MM/DD/YYYY')}{' '}
                                </p>
                                <p className='font-medium text-xs mt-1 text-gray-500'>
                                  {v.address || 'No address listed'}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className='font-semibold'>No Job Postings found</div>
                    )}
                  </div>
                  <div className='w-full h-full bg-white overflow-auto rounded-lg border border-gray-300 shadow-md'>
                    <div className='border-b h-fit'>
                      <div className='px-6 py-6'>
                        <p className='font-bold text-2xl'>
                          {selectedAccepted?.title}
                        </p>
                        <p className='font-medium text-gray-600 mt-1 text-sm'>
                          {selectedAccepted?.author?.companyName}
                        </p>
                        <div className='space-x-2 flex'>
                          <div
                            onClick={() =>
                              declineJobPosting(+selectedAccepted?.id)
                            }
                            className='w-fit h-fit px-4 py-2 mt-4 rounded-md bg-red-500 hover:cursor-pointer hover:bg-red-600 text-white font-bold text-center'
                          >
                            Decline this posting
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=''>
                      <div className='space-y-1 px-6 py-8 border-b'>
                        <p className='text-lg font-bold'>Date created</p>
                        <p className='text-sm text-gray-600'>
                          On {dayjs(selectedAccepted?.createdAt).format('dddd')}
                          {', '}
                          {dayjs(selectedAccepted?.createdAt).format(
                            'MM/DD/YYYY',
                          )}{' '}
                          at{' '}
                          {dayjs(selectedAccepted?.createdAt).format('h:mm a')}
                        </p>
                      </div>
                      <div className='space-y-1 px-6 py-8 border-b'>
                        <p className='text-lg font-bold'>
                          Employer Information
                        </p>
                        <p className='text-sm text-gray-600'>
                          {selectedAccepted?.author?.companyName}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {selectedAccepted?.address === ''
                            ? 'No address listed'
                            : selectedAccepted?.address || 'No address listed'}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {selectedAccepted?.author?.email === ''
                            ? 'No email listed'
                            : selectedAccepted?.author?.email ||
                              'No email listed'}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {selectedAccepted?.author?.phoneNumber === ''
                            ? 'No phone number listed'
                            : selectedAccepted?.author?.phoneNumber ||
                              'No phone number listed'}
                        </p>
                      </div>
                      <div className='space-y-1 px-6 py-8'>
                        <p className='text-lg font-bold'>Full description</p>
                        <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                          {selectedAccepted?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentPage === 'Declined Job Postings' && (
              <div className='flex flex-col w-full h-full p-8 space-x-4'>
                <div className='flex w-full h-full p-8 space-x-4'>
                  <div className='flex flex-col space-y-4 overflow-auto'>
                    {declinedJobPostings.length ? (
                      declinedJobPostings.map((v: IJobPosting, i) => {
                        return (
                          <div key={i} className='group'>
                            <div
                              onClick={() => setSelectedDeclined(v)}
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
                                  Created on{' '}
                                  {dayjs(v.createdAt).format('MM/DD/YYYY')}{' '}
                                </p>
                                <p className='font-medium text-xs mt-1 text-gray-500'>
                                  {v.address || 'No address listed'}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className='font-semibold'>No Job Postings found</div>
                    )}
                  </div>
                  <div className='w-full h-full bg-white overflow-auto rounded-lg border border-gray-300 shadow-md'>
                    <div className='border-b h-fit'>
                      <div className='px-6 py-6'>
                        <p className='font-bold text-2xl'>
                          {selectedDeclined?.title}
                        </p>
                        <p className='font-medium text-gray-600 mt-1 text-sm'>
                          {selectedDeclined?.author?.companyName}
                        </p>
                        <div className='space-x-2 flex'>
                          <div
                            onClick={() =>
                              approveJobPosting(+selectedPending?.id)
                            }
                            className='w-fit h-fit px-4 py-2 mt-4 rounded-md bg-green-500 hover:cursor-pointer hover:bg-green-600 text-white font-bold text-center'
                          >
                            Accept this posting
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=''>
                      <div className='space-y-1 px-6 py-8 border-b'>
                        <p className='text-lg font-bold'>Date created</p>
                        <p className='text-sm text-gray-600'>
                          On {dayjs(selectedDeclined?.createdAt).format('dddd')}
                          {', '}
                          {dayjs(selectedDeclined?.createdAt).format(
                            'MM/DD/YYYY',
                          )}{' '}
                          at{' '}
                          {dayjs(selectedDeclined?.createdAt).format('h:mm a')}
                        </p>
                      </div>
                      <div className='space-y-1 px-6 py-8 border-b'>
                        <p className='text-lg font-bold'>
                          Employer Information
                        </p>
                        <p className='text-sm text-gray-600'>
                          {selectedDeclined?.author?.companyName}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {selectedDeclined?.address === ''
                            ? 'No address listed'
                            : selectedDeclined?.address || 'No address listed'}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {selectedDeclined?.author?.email === ''
                            ? 'No email listed'
                            : selectedDeclined?.author?.email ||
                              'No email listed'}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {selectedDeclined?.author?.phoneNumber === ''
                            ? 'No phone number listed'
                            : selectedDeclined?.author?.phoneNumber ||
                              'No phone number listed'}
                        </p>
                      </div>
                      <div className='space-y-1 px-6 py-8'>
                        <p className='text-lg font-bold'>Full description</p>
                        <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                          {selectedDeclined?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentPage === 'Create Employer' && (
              <div className='w-full h-full m-8 bg-white flex flex-col rounded-lg border border-gray-300 shadow-md'>
                <div className='border-b h-fit'>
                  <div className='px-6 py-6'>
                    <p className='font-bold text-2xl'>
                      Create an Employer account
                    </p>
                  </div>
                </div>
                <div className='p-6 space-y-4 flex flex-col'>
                  <div className='space-y-2'>
                    <div>
                      <label
                        htmlFor='username'
                        className='block text-sm/6 font-bold text-gray-900'
                      >
                        Username*
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          onChange={(v) =>
                            setNewEmployerUsername(v.target.value)
                          }
                          value={newEmployerUsername}
                          required
                          className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                        />
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm/6 font-bold text-gray-900'>
                        Company Name*
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          onChange={(v) =>
                            setNewEmployerCompanyName(v.target.value)
                          }
                          value={newEmployerCompanyName}
                          className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                        />
                      </div>
                    </div>

                    <div className=''>
                      <label className='block text-sm/6 font-bold text-gray-900'>
                        Password*
                      </label>
                      <div className='mt-2'>
                        <input
                          type='password'
                          onChange={(v) =>
                            setNewEmployerPassword(v.target.value)
                          }
                          value={newEmployerPassword}
                          className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                        />
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm/6 font-bold text-gray-900'>
                        Email*
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          onChange={(v) => setNewEmployerEmail(v.target.value)}
                          value={newEmployerEmail}
                          className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                        />
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm/6 font-bold text-gray-900'>
                        Phone Number
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          onChange={(v) =>
                            setNewEmployerPhoneNumber(v.target.value)
                          }
                          value={newEmployerPhoneNumber}
                          className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => createEmployer()}
                    className='bg-blue-500 w-fit hover:bg-blue-600 hover:cursor-pointer font-bold text-lg text-white rounded-md px-4 py-2'
                  >
                    Create an employer account
                  </div>
                </div>
              </div>
            )}
            {currentPage === 'All Employers' && (
              <div className='p-8 w-full h-full'>
                <div className='w-full h-full bg-white flex flex-col overflow-auto rounded-lg border border-gray-300 shadow-md'>
                  {allEmployers.map((v: any, i: number) => (
                    <div
                      className='flex flex-col space-y-2 border-b py-6 px-8'
                      key={i}
                    >
                      <p className='font-semibold text-lg'>{v.companyName}</p>
                      <p className='font-medium text-sm text-gray-600'>
                        {v.username}
                      </p>
                      <p className='font-medium text-sm text-gray-600'>
                        {v.email || 'No email listed'}
                      </p>
                      <p className='font-medium text-sm text-gray-600'>
                        {v.phoneNumber || 'No phone number listed'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Desktop Ends here */}

          {/* Mobile Starts here */}
          <div
            className={`${
              windowWidth < 1025 ? 'flex flex-col' : 'hidden'
            } h-screen w-full`}
          >
            <MobileNavbar
              currentPage={currentPage}
              type={'admin'}
              setCurrentPage={setCurrentPage}
            />
            {currentPage === 'Pending Job Postings' && (
              <div className='flex bg-grid flex-col w-full h-full p-8 space-x-4'>
                <div className='flex flex-col space-y-4 overflow-auto'>
                  {pendingJobPostings.length ? (
                    pendingJobPostings.map((v: IJobPosting, i) => {
                      return (
                        <div key={i} className='group'>
                          <div
                            onClick={() => {
                              setSelectedPending(v);
                              setCurrentPage('Selected Pending');
                            }}
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
                                Created on{' '}
                                {dayjs(v.createdAt).format('MM/DD/YYYY')}{' '}
                              </p>
                              <p className='font-medium text-xs mt-1 text-gray-500'>
                                {v.address || 'No address listed'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className='font-semibold'>
                      No pending JobPostings found
                    </div>
                  )}
                </div>
              </div>
            )}
            {currentPage === 'Selected Pending' && (
              <div className='flex flex-col bg-grid h-full w-full p-8'>
                <div
                  onClick={() => setCurrentPage('Pending Job Postings')}
                  className='w-full h-fit hover:cursor-pointer p-2 mb-2 text-center border rounded-lg border-gray-300 bg-white hover:bg-gray-100 shadow-sm font-semibold text-sm'
                >
                  Go Back
                </div>
                <div className='w-full h-full bg-white overflow-auto rounded-lg border border-gray-300 shadow-md'>
                  <div className='border-b h-fit'>
                    <div className='px-6 py-6'>
                      <p className='font-bold text-2xl'>
                        {selectedPending?.title}
                      </p>
                      <p className='font-medium text-gray-600 mt-1 text-sm'>
                        {selectedPending?.author?.companyName}
                      </p>
                      <div className='space-x-2 flex'>
                        <div
                          onClick={() => {
                            approveJobPosting(+selectedPending?.id);
                            setCurrentPage('Pending Job Postings');
                          }}
                          className='w-fit h-fit px-4 py-2 mt-4 rounded-md bg-green-500 hover:cursor-pointer hover:bg-green-600 text-white font-bold text-center'
                        >
                          Accept this posting
                        </div>
                        <div
                          onClick={() => {
                            declineJobPosting(+selectedPending?.id);
                            setCurrentPage('Pending Job Postings');
                          }}
                          className='w-fit h-fit px-4 py-2 mt-4 rounded-md bg-red-500 hover:cursor-pointer hover:bg-red-600 text-white font-bold text-center'
                        >
                          Decline this posting
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=''>
                    <div className='space-y-1 px-6 py-8 border-b'>
                      <p className='text-lg font-bold'>Date created</p>
                      <p className='text-sm text-gray-600'>
                        On {dayjs(selectedPending?.createdAt).format('dddd')}
                        {', '}
                        {dayjs(selectedPending?.createdAt).format(
                          'MM/DD/YYYY',
                        )}{' '}
                        at {dayjs(selectedPending?.createdAt).format('h:mm a')}
                      </p>
                    </div>
                    <div className='space-y-1 px-6 py-8 border-b'>
                      <p className='text-lg font-bold'>Employer Information</p>
                      <p className='text-sm text-gray-600'>
                        {selectedPending?.author?.companyName}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {selectedPending?.address === ''
                          ? 'No address listed'
                          : selectedPending?.address || 'No address listed'}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {selectedPending?.author?.email === ''
                          ? 'No email listed'
                          : selectedPending?.author?.email || 'No email listed'}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {selectedPending?.author?.phoneNumber === ''
                          ? 'No phone number listed'
                          : selectedPending?.author?.phoneNumber ||
                            'No phone number listed'}
                      </p>
                    </div>
                    <div className='space-y-1 px-6 py-8'>
                      <p className='text-lg font-bold'>Full description</p>
                      <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                        {selectedPending?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'Accepted Job Postings' && (
              <div className='flex bg-grid flex-col w-full h-full p-8 space-x-4'>
                <div className='flex flex-col space-y-4 overflow-auto'>
                  {acceptedJobPostings.length ? (
                    acceptedJobPostings.map((v: IJobPosting, i) => {
                      return (
                        <div key={i} className='group'>
                          <div
                            onClick={() => {
                              setSelectedPending(v);
                              setCurrentPage('Selected Accepted');
                            }}
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
                                Created on{' '}
                                {dayjs(v.createdAt).format('MM/DD/YYYY')}{' '}
                              </p>
                              <p className='font-medium text-xs mt-1 text-gray-500'>
                                {v.address || 'No address listed'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className='font-semibold'>
                      No accepted JobPostings found
                    </div>
                  )}
                </div>
              </div>
            )}
            {currentPage === 'Selected Accepted' && (
              <div className='flex flex-col bg-grid h-full w-full p-8'>
                <div
                  onClick={() => setCurrentPage('Accepted Job Postings')}
                  className='w-full h-fit hover:cursor-pointer p-2 mb-2 text-center border rounded-lg border-gray-300 bg-white hover:bg-gray-100 shadow-sm font-semibold text-sm'
                >
                  Go Back
                </div>
                <div className='w-full h-full bg-white overflow-auto rounded-lg border border-gray-300 shadow-md'>
                  <div className='border-b h-fit'>
                    <div className='px-6 py-6'>
                      <p className='font-bold text-2xl'>
                        {selectedAccepted?.title}
                      </p>
                      <p className='font-medium text-gray-600 mt-1 text-sm'>
                        {selectedAccepted?.author?.companyName}
                      </p>
                      <div className='space-x-2 flex'>
                        <div
                          onClick={() => {
                            declineJobPosting(+selectedAccepted?.id);
                            setCurrentPage('Accepted Job Postings');
                          }}
                          className='w-fit h-fit px-4 py-2 mt-4 rounded-md bg-red-500 hover:cursor-pointer hover:bg-red-600 text-white font-bold text-center'
                        >
                          Decline this posting
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=''>
                    <div className='space-y-1 px-6 py-8 border-b'>
                      <p className='text-lg font-bold'>Date created</p>
                      <p className='text-sm text-gray-600'>
                        On {dayjs(selectedAccepted?.createdAt).format('dddd')}
                        {', '}
                        {dayjs(selectedAccepted?.createdAt).format(
                          'MM/DD/YYYY',
                        )}{' '}
                        at {dayjs(selectedAccepted?.createdAt).format('h:mm a')}
                      </p>
                    </div>
                    <div className='space-y-1 px-6 py-8 border-b'>
                      <p className='text-lg font-bold'>Employer Information</p>
                      <p className='text-sm text-gray-600'>
                        {selectedAccepted?.author?.companyName}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {selectedAccepted?.address === ''
                          ? 'No address listed'
                          : selectedAccepted?.address || 'No address listed'}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {selectedAccepted?.author?.email === ''
                          ? 'No email listed'
                          : selectedAccepted?.author?.email ||
                            'No email listed'}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {selectedAccepted?.author?.phoneNumber === ''
                          ? 'No phone number listed'
                          : selectedAccepted?.author?.phoneNumber ||
                            'No phone number listed'}
                      </p>
                    </div>
                    <div className='space-y-1 px-6 py-8'>
                      <p className='text-lg font-bold'>Full description</p>
                      <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                        {selectedAccepted?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'Declined Job Postings' && (
              <div className='flex bg-grid flex-col w-full h-full p-8 space-x-4'>
                <div className='flex flex-col space-y-4 overflow-auto'>
                  {declinedJobPostings.length ? (
                    declinedJobPostings.map((v: IJobPosting, i) => {
                      return (
                        <div key={i} className='group'>
                          <div
                            onClick={() => {
                              setSelectedPending(v);
                              setCurrentPage('Selected Declined');
                            }}
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
                                Created on{' '}
                                {dayjs(v.createdAt).format('MM/DD/YYYY')}{' '}
                              </p>
                              <p className='font-medium text-xs mt-1 text-gray-500'>
                                {v.address || 'No address listed'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className='font-semibold'>
                      No declined JobPostings found
                    </div>
                  )}
                </div>
              </div>
            )}
            {currentPage === 'Selected Declined' && (
              <div className='flex flex-col bg-grid h-full w-full p-8'>
                <div
                  onClick={() => setCurrentPage('Declined Job Postings')}
                  className='w-full h-fit hover:cursor-pointer p-2 mb-2 text-center border rounded-lg border-gray-300 bg-white hover:bg-gray-100 shadow-sm font-semibold text-sm'
                >
                  Go Back
                </div>
                <div className='w-full h-full bg-white overflow-auto rounded-lg border border-gray-300 shadow-md'>
                  <div className='border-b h-fit'>
                    <div className='px-6 py-6'>
                      <p className='font-bold text-2xl'>
                        {selectedDeclined?.title}
                      </p>
                      <p className='font-medium text-gray-600 mt-1 text-sm'>
                        {selectedDeclined?.author?.companyName}
                      </p>
                      <div className='space-x-2 flex'>
                        <div
                          onClick={() => {
                            approveJobPosting(+selectedPending?.id);
                            setCurrentPage('Declined Job Postings');
                          }}
                          className='w-fit h-fit px-4 py-2 mt-4 rounded-md bg-green-500 hover:cursor-pointer hover:bg-green-600 text-white font-bold text-center'
                        >
                          Accept this posting
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=''>
                    <div className='space-y-1 px-6 py-8 border-b'>
                      <p className='text-lg font-bold'>Date created</p>
                      <p className='text-sm text-gray-600'>
                        On {dayjs(selectedDeclined?.createdAt).format('dddd')}
                        {', '}
                        {dayjs(selectedDeclined?.createdAt).format(
                          'MM/DD/YYYY',
                        )}{' '}
                        at {dayjs(selectedDeclined?.createdAt).format('h:mm a')}
                      </p>
                    </div>
                    <div className='space-y-1 px-6 py-8 border-b'>
                      <p className='text-lg font-bold'>Employer Information</p>
                      <p className='text-sm text-gray-600'>
                        {selectedDeclined?.author?.companyName}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {selectedDeclined?.address === ''
                          ? 'No address listed'
                          : selectedDeclined?.address || 'No address listed'}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {selectedDeclined?.author?.email === ''
                          ? 'No email listed'
                          : selectedDeclined?.author?.email ||
                            'No email listed'}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {selectedDeclined?.author?.phoneNumber === ''
                          ? 'No phone number listed'
                          : selectedDeclined?.author?.phoneNumber ||
                            'No phone number listed'}
                      </p>
                    </div>
                    <div className='space-y-1 px-6 py-8'>
                      <p className='text-lg font-bold'>Full description</p>
                      <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                        {selectedDeclined?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'Create Employer' && (
              <div className='w-full h-full bg-grid'>
                <div className='m-8 bg-white flex flex-col rounded-lg border border-gray-300 shadow-md'>
                  <div className='border-b h-fit'>
                    <div className='px-6 py-6'>
                      <p className='font-bold text-2xl'>
                        Create an Employer account
                      </p>
                    </div>
                  </div>
                  <div className='p-6 space-y-4 flex flex-col'>
                    <div className='space-y-2'>
                      <div>
                        <label
                          htmlFor='username'
                          className='block text-sm/6 font-bold text-gray-900'
                        >
                          Username*
                        </label>
                        <div className='mt-2'>
                          <input
                            type='text'
                            onChange={(v) =>
                              setNewEmployerUsername(v.target.value)
                            }
                            value={newEmployerUsername}
                            required
                            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                          />
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm/6 font-bold text-gray-900'>
                          Company Name*
                        </label>
                        <div className='mt-2'>
                          <input
                            type='text'
                            onChange={(v) =>
                              setNewEmployerCompanyName(v.target.value)
                            }
                            value={newEmployerCompanyName}
                            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                          />
                        </div>
                      </div>

                      <div className=''>
                        <label className='block text-sm/6 font-bold text-gray-900'>
                          Password*
                        </label>
                        <div className='mt-2'>
                          <input
                            type='password'
                            onChange={(v) =>
                              setNewEmployerPassword(v.target.value)
                            }
                            value={newEmployerPassword}
                            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                          />
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm/6 font-bold text-gray-900'>
                          Email*
                        </label>
                        <div className='mt-2'>
                          <input
                            type='text'
                            onChange={(v) =>
                              setNewEmployerEmail(v.target.value)
                            }
                            value={newEmployerEmail}
                            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                          />
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm/6 font-bold text-gray-900'>
                          Phone Number
                        </label>
                        <div className='mt-2'>
                          <input
                            type='text'
                            onChange={(v) =>
                              setNewEmployerPhoneNumber(v.target.value)
                            }
                            value={newEmployerPhoneNumber}
                            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={() => createEmployer()}
                      className='bg-blue-500 w-fit hover:bg-blue-600 hover:cursor-pointer font-bold text-lg text-white rounded-md px-4 py-2'
                    >
                      Create an employer account
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'All Employers' && (
              <div className='p-8 w-full h-full'>
                <div className='w-full h-full bg-white flex flex-col overflow-auto rounded-lg border border-gray-300 shadow-md'>
                  {allEmployers.map((v: any, i: number) => (
                    <div
                      className='flex flex-col space-y-2 border-b py-6 px-8'
                      key={i}
                    >
                      <p className='font-semibold text-lg'>{v.companyName}</p>
                      <p className='font-medium text-sm text-gray-600'>
                        {v.username}
                      </p>
                      <p className='font-medium text-sm text-gray-600'>
                        {v.email || 'No email listed'}
                      </p>
                      <p className='font-medium text-sm text-gray-600'>
                        {v.phoneNumber || 'No phone number listed'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* {authenticated === false ? (
        <div className='mx-auto my-auto min-w-[25%]'>
          <div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='password'
                className='block text-sm/6 font-bold text-gray-900'
              >
                Password*
              </label>
            </div>
            <div className='mt-2'>
              <input
                id='password'
                name='password'
                type='password'
                required
                onChange={(v) => setPassword(v.target.value)}
                value={password}
                className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
              />
            </div>
          </div>
          <div
            onClick={() => authenticate()}
            className='bg-blue-500 text-center mt-2 hover:bg-blue-600 hover:cursor-pointer text-white font-semibold rounded-md px-3 py-2'
          >
            Submit
          </div>
        </div>
      ) : (
        <div>
          {/* Desktop Starts here */}
      {/* <div
        className={`bg-white h-screen w-full ${
          windowWidth > 1023 ? 'flex' : 'hidden'
        }`}
      ></div> */}
      {/* Desktop Ends here */}

      {/* Mobile Starts here */}
      {/* <div
            className={`${
              windowWidth < 1025 ? 'flex flex-col' : 'hidden'
            } h-screen`}
          ></div> */}
      {/* Mobile Ends here */}
      {/* </div> */}
      {/* )} */}
    </div>
  );
}
