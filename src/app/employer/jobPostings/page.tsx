'use client';
import { useEffect, useState } from 'react';
import { bufferToBlob, downloadBlob, truncate } from '@/app/helpers';
import { a } from '../../config';

import MobileNavbar from '@/app/components/mobileNavbar';
import SideNav from '@/app/components/sidenav';
import dayjs from 'dayjs';
import Success from '@/app/components/success';
import { IApplication, IInterviewSlot, IJobPosting } from '@/app/interfaces';
import Modal from '@/app/components/modal';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import ChatsAndAnnouncements from '@/app/components/chatsAndAnnouncements';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
export default function Home() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentPage, setCurrentPage] = useState('Created Postings');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);
  const [jobPostings, setJobPostings] = useState<IJobPosting[]>([]);
  const [currentJobPosting, setCurrentJobPosting] =
    useState<IJobPosting | null>();
  const [backPage, setBackPage] = useState('Created Postings');
  const [showApplication, setShowApplication] = useState(false);
  const [interviewSlots, setInterviewSlots] = useState<IInterviewSlot[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showCreateInterviewSlotModal, setShowCreateInterviewSlotModal] =
    useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<IApplication | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const createJobPosting = async () => {
    const { data: response } = await a.post('/jobPostings', {
      title: newTitle,
      description: newDescription,
      address: newAddress === '' ? null : newAddress,
      authorId: JSON.parse(localStorage.getItem('Employer')!).id,
    });
    setNewAddress('');
    setNewDescription('');
    setNewTitle('');
    getJobPostings();
    if (response) {
      setCreateSuccess(true);
      const timer = setTimeout(() => {
        setCreateSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  };

  const getJobPostings = async () => {
    const { data: response } = await a.get(
      `/jobPostings/author/${JSON.parse(localStorage.getItem('Employer')!).id}`,
    );

    setJobPostings(response);

    setCurrentJobPosting(response[0]);
    getInterviewSlots(response[0]?.id);
  };

  const changeJobPostingStatus = async (status: string) => {
    if (currentJobPosting) {
      const { data: response } = await a.put(
        `/jobPostings/updateStatus/${currentJobPosting.id}?postingStatus=${status}`,
      );
      if (response) {
        const { data: response2 } = await a.get(
          `/jobPostings/${currentJobPosting.id}`,
        );
        setCurrentJobPosting(response2);
        getJobPostings();
      }
    }
  };

  const createInterviewSlot = async (
    jobPostingId: number,
    startTime: string,
    endTime: string,
  ) => {
    setShowCreateInterviewSlotModal(false);
    await a.post('/jobPostings/interviewSlots', {
      jobPostingId: jobPostingId,
      startTime: startTime,
      endTime: endTime,
    });
    getInterviewSlots(jobPostingId);
  };

  const getInterviewSlots = async (jobPostingId: number) => {
    const { data: response } = await a.get(
      `/jobPostings/interviewSlots/${jobPostingId}`,
    );
    console.log(response);
    setInterviewSlots(response);
  };

  const requestInterview = async (
    jobPostingId: number,
    applicantId: number,
  ) => {
    const { data: response } = await a.put(
      `/jobPostings/interviewSlots/requestInterview/${jobPostingId}`,
      { applicantId: applicantId },
    );
    getJobPostings();
    setCurrentJobPosting(response);
  };

  useEffect(() => {
    getJobPostings();
  }, []);

  return (
    <div>
      <div className='absolute top-0 right-0'>
        <Success
          title={'Success!'}
          description={'Successfully created a job posting.'}
          show={createSuccess}
          setShow={setCreateSuccess}
        />
      </div>
      <div>
        <Modal open={showApplication} setOpen={setShowApplication}>
          <div className='flex flex-col space-y-5 p-4 w-full min-w-96'>
            <p className='text-xl font-semibold mb-1'>Application</p>
            <div className='flex flex-col'>
              <p className='font-semibold'>Full Name</p>
              <p className='text-sm text-gray-700'>
                {selectedApplication?.applicant.fullname}
              </p>
            </div>
            <div className='flex flex-col'>
              <p className='font-semibold'>Email</p>
              <p className='text-sm text-gray-700'>
                {selectedApplication?.applicant.email || 'No email listed'}
              </p>
            </div>
            <div className='flex flex-col'>
              <p className='font-semibold'>Phone number</p>
              <p className='text-sm text-gray-700'>
                {selectedApplication?.applicant.phoneNumber ||
                  'No phone number listed'}
              </p>
            </div>
            <div className='flex flex-col'>
              <p className='font-semibold'>Age</p>
              <p className='text-sm text-gray-700'>
                {selectedApplication?.age} years old
              </p>
            </div>
            <div className='flex flex-col'>
              <p className='font-semibold'>Wage Expectation</p>
              <p className='text-sm text-gray-700'>
                {selectedApplication?.wageExpectation}
              </p>
            </div>
            <div className='flex flex-col'>
              <p className='font-semibold'>Previous Experience</p>
              <p className='text-sm text-gray-700 whitespace-pre-wrap'>
                {selectedApplication?.previousExperience}
              </p>
            </div>
            <div className='flex flex-col'>
              <p className='font-semibold'>Availability</p>
              <p className='text-sm text-gray-700 whitespace-pre-wrap'>
                {selectedApplication?.availability}
              </p>
            </div>
            <div className='flex flex-col'>
              <p className='font-semibold'>Resume(Preview)</p>
              <div className=''>
                <div className=''>
                  <Document file={selectedApplication?.resumeData}>
                    <Page pageNumber={1} />
                  </Document>
                </div>
                <div
                  onClick={() => {
                    if (selectedApplication?.resumeData !== undefined) {
                      downloadBlob(
                        bufferToBlob(selectedApplication?.resumeData),
                        selectedApplication?.resumeName || 'resume.pdf',
                      );
                    }
                  }}
                  className='py-3 px-4 rounded-md w-fit text-white font-semibold bg-blue-500 hover:bg-blue-600 hover:cursor-pointer'
                >
                  Download Resume
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              <p className='font-semibold'>Application Creation Date</p>
              <p className='text-sm text-gray-700 whitespace-pre-wrap'>
                {dayjs(selectedApplication?.createdAt).format('MM/DD/YYYY')}
              </p>
            </div>
          </div>
        </Modal>
        <Modal
          open={showCreateInterviewSlotModal}
          setOpen={setShowCreateInterviewSlotModal}
        >
          <div className='flex flex-col space-y-4 p-4 w-full min-w-96'>
            <p className='text-xl font-semibold mb-1'>Create Interview Slot</p>
            <div className='flex flex-col'>
              <p className='font-semibold'>Start Time</p>
              <input
                type='datetime-local'
                className='rounded-md px-3 py-1.5 border border-gray-300'
                onChange={(v) => {
                  setStartTime(v.target.value);
                }}
              />
            </div>
            <div className='flex flex-col'>
              <p className='font-semibold'>End Time</p>
              <input
                type='datetime-local'
                className='rounded-md px-3 py-1.5 border border-gray-300'
                onChange={(v) => {
                  setEndTime(v.target.value);
                }}
              />
            </div>
            <div
              onClick={() =>
                currentJobPosting?.id &&
                createInterviewSlot(currentJobPosting.id, startTime, endTime)
              }
              className='bg-blue-500 w-fit hover:bg-blue-600 hover:cursor-pointer font-bold text-lg text-white rounded-md px-4 py-2'
            >
              Create Interview Slot
            </div>
          </div>
        </Modal>
      </div>

      {/* Desktop Starts here */}
      <div
        className={`bg-white h-screen w-full ${
          windowWidth > 1023 ? 'flex' : 'hidden'
        }`}
      >
        <div className='bg-blue-500 w-fit'>
          <SideNav
            current={currentPage}
            setCurrent={setCurrentPage}
            type={'employer'}
          />
        </div>
        <div className='h-screen w-full bg-grid p-8'>
          {currentPage === 'Created Postings' && (
            <div className='w-full h-full flex flex-col'>
              <div className='flex w-full h-full p-8 space-x-4'>
                <div className='flex flex-col space-y-4 overflow-auto'>
                  {jobPostings.length ? (
                    jobPostings.map((v: IJobPosting, i) => {
                      return (
                        <div key={i} className='group'>
                          <div
                            onClick={() => {
                              setCurrentJobPosting(v);
                              getInterviewSlots(v.id);
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
                    <div className='font-semibold'>No Job Postings found</div>
                  )}
                </div>
                <div className='w-full h-full bg-white rounded-lg border overflow-auto border-gray-300 shadow-md'>
                  <div className='border-b h-fit'>
                    <div className='px-6 py-6'>
                      <p className='font-bold text-2xl'>
                        {currentJobPosting?.title}
                      </p>
                      <p className='font-medium text-gray-600 mt-1 text-sm'>
                        {currentJobPosting?.author?.companyName}
                      </p>

                      <div className='flex space-x-2'>
                        {currentJobPosting?.postingStatus === 'OPEN' && (
                          <div className='flex space-x-2'>
                            <div className='w-fit h-fit px-4 py-2 mt-4 font-bold text-center rounded-md bg-white border hover:cursor-not-allowed text-gray-600'>
                              Open for applications
                            </div>
                            <div
                              onClick={() => changeJobPostingStatus('CLOSED')}
                              className='w-fit h-fit px-4 py-2 mt-4 font-bold text-center rounded-md bg-blue-500 hover:cursor-pointer hover:bg-blue-600 text-white'
                            >
                              Close
                            </div>
                          </div>
                        )}
                        {currentJobPosting?.postingStatus === 'CLOSED' && (
                          <div className='flex space-x-2'>
                            <div className='w-fit h-fit px-4 py-2 mt-4 font-bold text-center rounded-md bg-white border hover:cursor-not-allowed text-gray-600'>
                              Closed for applications
                            </div>
                            <div
                              onClick={() => changeJobPostingStatus('OPEN')}
                              className='w-fit h-fit px-4 py-2 mt-4 font-bold text-center rounded-md bg-blue-500 hover:cursor-pointer hover:bg-blue-600 text-white'
                            >
                              Open
                            </div>
                          </div>
                        )}
                        {currentJobPosting?.status === 'PENDING' && (
                          <div className='w-fit h-fit px-4 py-2 mt-4 font-bold text-center rounded-md bg-orange-500 text-white'>
                            Approval Status: Pending
                          </div>
                        )}
                        {currentJobPosting?.status === 'ACCEPTED' && (
                          <div className='w-fit h-fit px-4 py-2 mt-4 font-bold text-center rounded-md bg-green-500 text-white'>
                            Approval Status: Accepted
                          </div>
                        )}
                        {currentJobPosting?.status === 'DECLINED' && (
                          <div className='w-fit h-fit px-4 py-2 mt-4 font-bold text-center rounded-md bg-red-500 text-white'>
                            Approval Status: Declined
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className='space-y-1 px-6 py-8 border-b'>
                      <p className='text-lg font-bold'>Date created</p>
                      <p className='text-sm text-gray-600'>
                        On {dayjs(currentJobPosting?.createdAt).format('dddd')}
                        {', '}
                        {dayjs(currentJobPosting?.createdAt).format(
                          'MM/DD/YYYY',
                        )}{' '}
                        at{' '}
                        {dayjs(currentJobPosting?.createdAt).format('h:mm a')}
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
                          : currentJobPosting?.author?.email ||
                            'No email listed'}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {currentJobPosting?.author?.phoneNumber === ''
                          ? 'No phone number listed'
                          : currentJobPosting?.author?.phoneNumber ||
                            'No phone number listed'}
                      </p>
                    </div>
                    <div className='space-y-1 px-6 py-8 border-b'>
                      <p className='text-lg font-bold'>Full description</p>
                      <p className='text-sm  text-gray-600 whitespace-pre-wrap'>
                        {currentJobPosting?.description}
                      </p>
                    </div>
                    <div className='space-y-1 px-6 py-8 border-b'>
                      <p className='text-lg font-bold'>Interview Schedule</p>
                      <div
                        onClick={() => setShowCreateInterviewSlotModal(true)}
                        className='bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-md font-semibold text-white rounded-md py-2 px-3.5 w-fit'
                      >
                        Create new interview slot
                      </div>
                      <div className='py-1 grid grid-flow-row grid-cols-2 gap-2 w-full h-full'>
                        {interviewSlots.map((v: IInterviewSlot, i: number) => (
                          <div
                            key={i}
                            className='bg-white flex justify-between border border-gray-300 p-4 rounded-md font-medium text-gray-600 text-xs'
                          >
                            <div className='flex flex-col space-y-1'>
                              <p>
                                {v?.applicant?.fullname || 'No applicant yet'}
                              </p>
                              <p>
                                Starts{' '}
                                {dayjs(v?.startTime).format('h:mm a, MM/DD/YY')}
                              </p>
                              <p>
                                Ends{' '}
                                {dayjs(v?.endTime).format('h:mm a, MM/DD/YY')}
                              </p>
                            </div>
                          </div>
                        ))}
                        {interviewSlots.length === 0 && (
                          <div className='font-medium text-sm text-gray-600'>
                            No interview slots created yet
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='space-y-1 px-6 py-8'>
                      <p className='text-lg font-bold mb-2'>Applications</p>
                      <div className='grid grid-cols-2 gap-x-2'>
                        {currentJobPosting?.applications?.length ? (
                          currentJobPosting?.applications?.map((v, i) => (
                            <div
                              key={i}
                              className='bg-white flex justify-between border border-gray-300 p-4 rounded-md font-medium text-gray-600 text-xs'
                            >
                              <div className='flex flex-col space-y-1'>
                                <p>{v.applicant.fullname}</p>
                                <p>{v.applicant.email || 'No email listed'}</p>
                                <p>
                                  {v.applicant.phoneNumber ||
                                    'No phone number listed'}
                                </p>
                              </div>
                              <div className='flex flex-col my-auto space-y-1'>
                                {currentJobPosting.applicantsCanInterview.find(
                                  (e) => e.id === v.applicant.id,
                                ) === undefined ? (
                                  <div
                                    onClick={() =>
                                      requestInterview(
                                        currentJobPosting?.id,
                                        v?.applicant?.id,
                                      )
                                    }
                                    className='bg-blue-500 text-center hover:cursor-pointer text-xs text-white font-semibold rounded-md py-1 px-2 hover:bg-blue-600'
                                  >
                                    Request Interview
                                  </div>
                                ) : interviewSlots.find(
                                    (e) => e.applicantId === v?.applicant?.id,
                                  ) === undefined ? (
                                  <div className='text-center border hover:cursor-not-allowed text-xs text-gray-600 font-semibold rounded-md py-1 px-2'>
                                    Interview requested
                                  </div>
                                ) : (
                                  <div className='text-center border hover:cursor-not-allowed text-xs text-gray-600 font-semibold rounded-md py-1 px-2'>
                                    Interview accepted
                                  </div>
                                )}
                                <div
                                  onClick={() => {
                                    setSelectedApplication(v);
                                    setShowApplication(true);
                                  }}
                                  className='bg-blue-500 text-center hover:cursor-pointer text-xs text-white font-semibold rounded-md py-1 px-2 hover:bg-blue-600'
                                >
                                  View Application
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className='text-gray-600 text-sm'>
                            No Applications yet
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {currentPage === 'Create Posting' && (
            <div className='w-full h-full bg-white flex flex-col rounded-lg border border-gray-300 shadow-md'>
              <div className='border-b h-fit'>
                <div className='px-6 py-6'>
                  <p className='font-bold text-2xl'>Create a Job Posting</p>
                </div>
              </div>
              <div className='p-6 space-y-4 flex flex-col'>
                <div className='space-y-2'>
                  <div>
                    <label
                      htmlFor='username'
                      className='block text-sm/6 font-bold text-gray-900'
                    >
                      Title*
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        onChange={(v) => setNewTitle(v.target.value)}
                        value={newTitle}
                        required
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                      />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm/6 font-bold text-gray-900'>
                      Address
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        onChange={(v) => setNewAddress(v.target.value)}
                        value={newAddress}
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                      />
                    </div>
                  </div>

                  <div className=''>
                    <label
                      htmlFor='username'
                      className='block text-sm/6 font-bold text-gray-900'
                    >
                      Description*
                    </label>
                    <div className='mt-2'>
                      <textarea
                        onChange={(v) => setNewDescription(v.target.value)}
                        value={newDescription}
                        rows={10}
                        required
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                      />
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => createJobPosting()}
                  className='bg-blue-500 w-fit hover:bg-blue-600 hover:cursor-pointer font-bold text-lg text-white rounded-md px-4 py-2'
                >
                  Create Job Posting
                </div>
              </div>
            </div>
          )}
          {currentPage === 'Chats & Announcements' && (
            <div className='w-full h-full'>
              <ChatsAndAnnouncements userType={'Employer'} />
            </div>
          )}
        </div>
      </div>
      {/* Desktop Ends here */}

      {/* Mobile Starts here */}
      <div
        className={`${
          windowWidth < 1025 ? 'flex flex-col' : 'hidden'
        } h-screen`}
      >
        <MobileNavbar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          type={'employer'}
        />

        <div className='flex flex-col space-y-4 bg-grid h-full w-full overflow-auto p-8'>
          {currentPage === 'Created Postings' &&
            (jobPostings.length ? (
              jobPostings.map((v: IJobPosting, i) => {
                return (
                  <div key={i} className='group'>
                    <div
                      onClick={() => {
                        setCurrentJobPosting(v);
                        getInterviewSlots(v.id);
                        setCurrentPage('Selected');
                        setBackPage('Created Postings');
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
                          Created on {dayjs(v.createdAt).format('MM/DD/YYYY')}{' '}
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
            ))}
          {currentPage === 'Selected' && (
            <div className='flex flex-col'>
              <div
                onClick={() => setCurrentPage(backPage)}
                className='w-full h-fit hover:cursor-pointer hover:bg-gray-100 p-2 mb-2 text-center border rounded-lg border-gray-300 bg-white shadow-sm font-semibold text-sm'
              >
                Go Back
              </div>
              <div className='w-full h-full bg-white rounded-lg border overflow-auto border-gray-300 shadow-md'>
                <div className='border-b h-fit'>
                  <div className='px-6 py-6'>
                    <p className='font-bold text-2xl'>
                      {currentJobPosting?.title}
                    </p>
                    <p className='font-medium text-gray-600 mt-1 text-sm'>
                      {currentJobPosting?.author?.companyName}
                    </p>

                    <div className='flex space-x-2'>
                      {currentJobPosting?.postingStatus === 'OPEN' && (
                        <div className='flex space-x-2'>
                          <div className='w-fit h-fit px-4 py-2 mt-4 font-bold text-center rounded-md bg-white border hover:cursor-not-allowed text-gray-600'>
                            Open for applications
                          </div>
                          <div
                            onClick={() => changeJobPostingStatus('CLOSED')}
                            className='w-fit h-fit px-4 py-2 mt-4 font-bold text-center rounded-md bg-blue-500 hover:cursor-pointer hover:bg-blue-600 text-white'
                          >
                            Close
                          </div>
                        </div>
                      )}
                      {currentJobPosting?.postingStatus === 'CLOSED' && (
                        <div className='flex space-x-2'>
                          <div className='w-fit h-fit px-4 py-2 mt-4 font-bold text-center rounded-md bg-white border hover:cursor-not-allowed text-gray-600'>
                            Closed for applications
                          </div>
                          <div
                            onClick={() => changeJobPostingStatus('OPEN')}
                            className='w-fit h-fit px-4 py-2 mt-4 font-bold text-center rounded-md bg-blue-500 hover:cursor-pointer hover:bg-blue-600 text-white'
                          >
                            Open
                          </div>
                        </div>
                      )}
                      {currentJobPosting?.status === 'PENDING' && (
                        <div className='w-fit h-fit px-4 py-2 mt-4 font-bold text-center rounded-md bg-orange-500 text-white'>
                          Approval Status: Pending
                        </div>
                      )}
                      {currentJobPosting?.status === 'ACCEPTED' && (
                        <div className='w-fit h-fit px-4 py-2 mt-4 font-bold text-center rounded-md bg-green-500 text-white'>
                          Approval Status: Accepted
                        </div>
                      )}
                      {currentJobPosting?.status === 'DECLINED' && (
                        <div className='w-fit h-fit px-4 py-2 mt-4 font-bold text-center rounded-md bg-red-500 text-white'>
                          Approval Status: Declined
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className='space-y-1 px-6 py-8 border-b'>
                    <p className='text-lg font-bold'>Date created</p>
                    <p className='text-sm text-gray-600'>
                      On {dayjs(currentJobPosting?.createdAt).format('dddd')}
                      {', '}
                      {dayjs(currentJobPosting?.createdAt).format(
                        'MM/DD/YYYY',
                      )}{' '}
                      at {dayjs(currentJobPosting?.createdAt).format('h:mm a')}
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
                  <div className='space-y-1 px-6 py-8 border-b'>
                    <p className='text-lg font-bold'>Full description</p>
                    <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                      {currentJobPosting?.description}
                    </p>
                  </div>
                  <div className='space-y-1 px-6 py-8'>
                    <p className='text-lg font-bold mb-2'>Applications</p>
                    <div className='grid grid-cols-2 gap-x-2'>
                      {currentJobPosting?.applicants?.length ? (
                        currentJobPosting?.applicants?.map((v, i) => (
                          <div
                            key={i}
                            className='bg-white border border-gray-300 p-4 flex flex-col space-y-1 rounded-md font-medium text-gray-600 text-xs'
                          >
                            <p>{v.fullname}</p>
                            <p>{v.email || 'No email listed'}</p>
                            <p>{v.phoneNumber || 'No phone number listed'}</p>
                          </div>
                        ))
                      ) : (
                        <p className='text-gray-600 text-sm'>
                          No Applications yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {currentPage === 'Create Posting' && (
            <div className='w-full h-full bg-white flex flex-col rounded-lg border border-gray-300 shadow-md'>
              <div className='border-b h-fit'>
                <div className='px-6 py-6'>
                  <p className='font-bold text-2xl'>Create a Job Posting</p>
                </div>
              </div>
              <div className='p-6 space-y-4 flex flex-col'>
                <div className='space-y-2'>
                  <div>
                    <label
                      htmlFor='username'
                      className='block text-sm/6 font-bold text-gray-900'
                    >
                      Title*
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        onChange={(v) => setNewTitle(v.target.value)}
                        value={newTitle}
                        required
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                      />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm/6 font-bold text-gray-900'>
                      Address
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        onChange={(v) => setNewAddress(v.target.value)}
                        value={newAddress}
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                      />
                    </div>
                  </div>

                  <div className=''>
                    <label
                      htmlFor='username'
                      className='block text-sm/6 font-bold text-gray-900'
                    >
                      Description*
                    </label>
                    <div className='mt-2'>
                      <textarea
                        onChange={(v) => setNewDescription(v.target.value)}
                        value={newDescription}
                        rows={10}
                        required
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                      />
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => createJobPosting()}
                  className='bg-blue-500 w-fit hover:bg-blue-600 hover:cursor-pointer font-bold text-lg text-white rounded-md px-4 py-2'
                >
                  Create Job Posting
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Ends here */}
    </div>
  );
}
