'use client';
import { useEffect, useState } from 'react';

import { a } from '../config';
import SideNav from '../components/sidenav';
import dayjs from 'dayjs';
import MobileNavbar from '../components/mobileNavbar';
import AIHelper from '../components/aiHelper';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { truncate } from '../helpers';
import Modal from '../components/modal';
import { IInterviewSlot, IJobPosting } from '../interfaces';
import ChatsAndAnnouncements from '../components/chatsAndAnnouncements';

export default function Home() {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  const [mobileTitleFilter, setMobileTitleFilter] = useState('');
  const [applicantId, setApplicantId] = useState(-1);
  const [currentPage, setCurrentPage] = useState('All Postings');
  const [backPage, setBackPage] = useState('All Postings');
  const [age, setAge] = useState<number | string>('');
  const [wageExpectation, setWageExpectation] = useState('');
  const [availability, setAvailability] = useState('');
  const [previousExperience, setPreviousExperience] = useState('');

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

  const [currentAppliedJobPosting, setCurrentAppliedJobPosting] =
    useState<IJobPosting | null>();

  const [appliedJobPostings, setAppliedJobPostings] = useState([]);

  const [showApplication, setShowApplication] = useState(false);

  const [resume, setResume] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState('');

  const getOpenJobPostings = async () => {
    const { data: response } = await a.get(`/jobPostings`);

    setJobPostings(response);

    setCurrentJobPosting(response[0]);
  };

  const applyToJobPosting = async (jobPostingId: number) => {
    const { data: response } = await a.put(
      `/jobPostings/apply/${jobPostingId}?applicantId=${+applicantId}`,
    );

    if (response) {
      const { data: response2 } = await a.get(`/jobPostings/${jobPostingId}`);
      setCurrentJobPosting(response2);

      getAppliedJobPostings();
    }

    if (resume) {
      setShowApplication(false);

      const { data: response2 } = await a.post(
        '/jobPostings/createApplication',
        {
          age: age,
          previousExperience: previousExperience,
          wageExpectation: wageExpectation,
          availability: availability,
          applicantId: applicantId,
          jobPostingId: currentJobPosting?.id,
          resumeName: resumeName,
        },
      );

      if (response2) {
        const formData = new FormData();
        formData.append('resumeData', resume);
        await a.put(`/jobPostings/uploadResume/${response2?.id}`, formData);
      }
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
    setCurrentAppliedJobPosting(response.appliedPostings[0]);
  };

  const getFilteredJobPostings = async (titleFilter: string) => {
    const { data: response } = await a.get(`/jobPostings?title=${titleFilter}`);
    setJobPostings(response);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setResume(selectedFile);
    setResumeName(selectedFile?.name || '');
  };

  const applyToInterviewSlot = async (interviewSlotId: number) => {
    const { data: response } = await a.put(
      `/jobPostings/interviewSlots/${interviewSlotId}`,
      { applicantId: +applicantId },
    );

    if (response) {
      getAppliedJobPostings();
      const { data: jobPosting } = await a.get(
        `/jobPostings/${currentAppliedJobPosting?.id}`,
      );
      setCurrentAppliedJobPosting(jobPosting);
    }
  };

  const checkIfAppliedToInterviewSlot = (interviewSlots: IInterviewSlot[]) => {
    for (let i = 0; i < interviewSlots.length; i++) {
      if (interviewSlots[i].applicantId === applicantId) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    setApplicantId(+JSON.parse(localStorage.getItem('Applicant')!).applicantId);
    getOpenJobPostings();
    getAppliedJobPostings();
  }, []);

  useEffect(() => {
    getFilteredJobPostings(mobileTitleFilter);
  }, [mobileTitleFilter]);

  return (
    <div>
      <Modal open={showApplication} setOpen={setShowApplication}>
        <div className='w-full'>
          <div className='flex flex-col p-4 space-y-4'>
            <div className='text-center text-xl font-bold'>
              Apply to &quot;{currentJobPosting.title}&quot;
            </div>
            <div className='flex flex-col space-y-4'>
              <div className='flex flex-col space-y-2'>
                <label className='font-semibold'>Age</label>
                <input
                  type='number'
                  onChange={(v) => setAge(v.target.value)}
                  value={age}
                  className='border border-gray-300 rounded-md p-2'
                />
              </div>
              <div className='flex flex-col space-y-2'>
                <label className='font-semibold'>Wage Expectation</label>
                <input
                  onChange={(v) => setWageExpectation(v.target.value)}
                  value={wageExpectation}
                  type='text'
                  className='border border-gray-300 rounded-md p-2'
                />
              </div>
              <div className='flex flex-col space-y-2'>
                <label className='font-semibold'>
                  Previous Experience(if any)
                </label>
                <textarea
                  onChange={(v) => setPreviousExperience(v.target.value)}
                  value={previousExperience}
                  className='border border-gray-300 rounded-md p-2'
                  rows={5}
                />
              </div>
              <div className='flex flex-col space-y-2'>
                <label className='font-semibold'>Availability</label>
                <textarea
                  onChange={(v) => setAvailability(v.target.value)}
                  value={availability}
                  className='border border-gray-300 rounded-md p-2'
                  rows={5}
                />
              </div>
              <div className='flex flex-col space-y-2'>
                <label className='font-semibold'>Resume</label>
                <div className='w-full py-9 bg-gray-50 rounded-2xl border border-gray-300 gap-3 grid border-dashed'>
                  <div className='grid gap-1'>
                    <div className='w-12 bg-blue-100 p-2.5 rounded-full h-12 text-blue-500 mx-auto'>
                      <DocumentTextIcon />
                    </div>
                    <h2 className='text-center text-gray-400 text-xs'>
                      PDF only
                    </h2>
                  </div>
                  <div className='grid gap-2'>
                    <h4 className='text-center text-gray-900 text-sm font-medium'>
                      Drag and Drop your file here or
                    </h4>
                    <div className='flex items-center justify-center'>
                      <label>
                        <input
                          onChange={handleFileChange}
                          type='file'
                          accept='.pdf'
                          hidden
                        />
                        <div className='flex w-28 h-9 px-2 flex-col bg-blue-500 rounded-full shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none'>
                          Choose File
                        </div>
                      </label>
                    </div>
                    {resumeName !== '' && (
                      <p className='text-sm text-center'>{resumeName}</p>
                    )}
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  applyToJobPosting(currentJobPosting.id);
                }}
                className='w-fit hover:cursor-pointer h-fit px-4 py-2 mt-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-bold text-center'
              >
                Submit Application
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* Desktop Starts here */}
      <div
        className={`bg-white h-screen w-full ${
          (windowWidth ?? 0) > 1023 ? 'flex' : 'hidden'
        }`}
      >
        <div className='bg-blue-500 w-fit'>
          <SideNav
            current={currentPage}
            setCurrent={setCurrentPage}
            type='applicant'
          />
        </div>
        {currentPage === 'All Postings' && (
          <div className='bg-grid w-full h-full overflow-auto flex flex-col'>
            <div className='grid w-full grid-cols-1'>
              <input
                onChange={(v) => {
                  getFilteredJobPostings(v.target.value);
                }}
                type='text'
                placeholder='Search'
                className='col-start-1 row-start-1 block focus:outline-none w-full bg-white py-4 pl-10 pr-3 text-base text-gray-900 border-b border-gray-300 placeholder:text-gray-400'
              />
              <MagnifyingGlassIcon
                aria-hidden='true'
                className='pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400'
              />
            </div>
            <div className='flex w-full h-full p-8 space-x-4'>
              <div className='flex flex-col space-y-4 overflow-auto'>
                {jobPostings.length ? (
                  jobPostings.map(
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
                    },
                  )
                ) : (
                  <div className='font-semibold'>No Job Postings found</div>
                )}
              </div>
              <div className='w-full h-full bg-white overflow-auto rounded-lg border border-gray-300 shadow-md'>
                <div className='border-b h-fit'>
                  <div className='px-6 py-6'>
                    <p className='font-bold text-2xl'>
                      {currentJobPosting?.title}
                    </p>
                    <p className='font-medium text-gray-600 mt-1 text-sm'>
                      {currentJobPosting?.author?.companyName}
                    </p>
                    <div
                      onClick={() => {
                        setShowApplication(true);
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
                  <div className='space-y-1 px-6 py-8'>
                    <p className='text-lg font-bold'>Full description</p>
                    <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                      {currentJobPosting?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentPage === 'Applied Postings' && (
          <div className='flex bg-grid w-full h-full overflow-auto p-8 space-x-4'>
            <div className='flex flex-col space-y-4 w-fit overflow-auto'>
              {appliedJobPostings?.map((v: IJobPosting, i) => {
                return (
                  <div key={i} className='group'>
                    <div
                      onClick={() => setCurrentAppliedJobPosting(v)}
                      className='shadow-sm w-fit group-hover:cursor-pointer group-hover:shadow-md flex flex-col bg-white h-fit rounded-lg border border-gray-300 px-8 py-6'
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
              })}
            </div>
            <div className='w-full h-full overflow-auto bg-white rounded-lg border border-gray-300 shadow-md'>
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
                    On{' '}
                    {dayjs(currentAppliedJobPosting?.createdAt).format('dddd')}
                    {', '}
                    {dayjs(currentAppliedJobPosting?.createdAt).format(
                      'MM/DD/YYYY',
                    )}{' '}
                    at{' '}
                    {dayjs(currentAppliedJobPosting?.createdAt).format(
                      'h:mm a',
                    )}
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
                  <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                    {currentAppliedJobPosting?.description}
                  </p>
                </div>
                {currentAppliedJobPosting?.interviewSlots.length ? (
                  <div className='space-y-1 px-6 py-8 border-t'>
                    <p className='text-lg font-bold'>Interview</p>
                    {checkIfAppliedToInterviewSlot(
                      currentAppliedJobPosting?.interviewSlots,
                    ) ? (
                      <div className='space-y-2 flex flex-col'>
                        <p className='text-sm text-gray-700'>
                          Your interview information
                        </p>
                        <div className='bg-white flex justify-between border border-gray-300 p-4 rounded-md font-medium text-gray-600 text-xs'>
                          <div className='flex flex-col space-y-1'>
                            <p>
                              Date:{' '}
                              {dayjs(
                                currentAppliedJobPosting?.interviewSlots.find(
                                  (v) => v.applicantId === applicantId,
                                )?.startTime,
                              ).format('MM/DD/YYYY')}
                            </p>
                            <p>
                              Start time:{' '}
                              {dayjs(
                                currentAppliedJobPosting?.interviewSlots.find(
                                  (v) => v.applicantId === applicantId,
                                )?.startTime,
                              ).format('h:mm')}
                            </p>
                            <p>
                              End time:{' '}
                              {dayjs(
                                currentAppliedJobPosting?.interviewSlots.find(
                                  (v) => v.applicantId === applicantId,
                                )?.endTime,
                              ).format('h:mm')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className='grid grid-cols-2 gap-x-2'>
                        {currentAppliedJobPosting?.interviewSlots.map(
                          (v: IInterviewSlot, i) => (
                            <div
                              key={i}
                              className='bg-white flex justify-between border border-gray-300 p-4 rounded-md font-medium text-gray-600 text-xs'
                            >
                              <div className='flex flex-col space-y-1'>
                                <p>
                                  Date:{' '}
                                  {dayjs(v.startTime).format('MM/DD/YYYY')}
                                </p>
                                <p>
                                  Start time:{' '}
                                  {dayjs(v.startTime).format('h:mm')}
                                </p>
                                <p>
                                  End time: {dayjs(v.endTime).format('h:mm')}
                                </p>
                              </div>
                              <div className='flex flex-col my-auto space-y-1'>
                                <div
                                  onClick={() => {
                                    applyToInterviewSlot(
                                      currentAppliedJobPosting.id,
                                    );
                                  }}
                                  className='bg-blue-500 text-center hover:cursor-pointer text-xs text-white font-semibold rounded-md py-1 px-2 hover:bg-blue-600'
                                >
                                  Choose this interview
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='space-y-1 px-6 py-8 border-t'>
                    <p className='text-lg font-bold'>Interview slots</p>
                    <p className='text-sm text-gray-700'>
                      Either you haven&apos;t been approved for an interview or
                      there are no available interview slots yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {currentPage === 'Ai Helper' && (
          <div className='h-screen w-full'>
            <AIHelper userType={'APPLICANT'} />
          </div>
        )}
        {currentPage === 'Chats & Announcements' && (
          <div className='bg-grid bg-white h-screen w-full overflow-auto p-6'>
            <ChatsAndAnnouncements userType={'Applicant'} />
          </div>
        )}
      </div>
      {/* Desktop Ends here */}

      {/* Mobile Starts here */}
      <div
        className={`${
          (windowWidth ?? 0) < 1025 ? 'flex flex-col' : 'hidden'
        } h-screen`}
      >
        <MobileNavbar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setTitleFilter={setMobileTitleFilter}
          type={'applicant'}
        />
        <div className='flex flex-col p-8 space-y-4 overflow-auto bg-grid h-full w-full'>
          {currentPage === 'All Postings' &&
            (jobPostings.length ? (
              jobPostings.map(
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
                        onClick={() => {
                          setCurrentJobPosting(v);
                          setCurrentPage('Selected');
                          setBackPage('All Postings');
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
                },
              )
            ) : (
              <div className='font-semibold text-xl text-center'>
                No Job Postings found
              </div>
            ))}
          {currentPage === 'Applied Postings' && (
            <div className='flex flex-col space-y-4 w-full overflow-auto'>
              {appliedJobPostings?.map((v: IJobPosting, i) => {
                return (
                  <div key={i} className='group'>
                    <div
                      onClick={() => {
                        setCurrentAppliedJobPosting(v);
                        setCurrentPage('Selected Applied');
                        setBackPage('Applied Postings');
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
              })}
            </div>
          )}
          {currentPage === 'Selected' && (
            <div className='flex flex-col'>
              <div
                onClick={() => setCurrentPage(backPage)}
                className='w-full h-fit hover:cursor-pointer hover:bg-gray-100 p-2 mb-2 text-center border rounded-lg border-gray-300 bg-white shadow-sm font-semibold text-sm'
              >
                Go Back
              </div>
              <div className='w-full h-full bg-white rounded-lg border border-gray-300 shadow-md'>
                <div className='border-b h-fit'>
                  <div className='px-6 py-6'>
                    <p className='font-bold text-2xl'>
                      {currentJobPosting?.title}
                    </p>
                    <p className='font-medium text-gray-600 mt-1 text-sm'>
                      {currentJobPosting?.author?.companyName}
                    </p>
                    <div
                      onClick={() => {
                        if (!checkIfApplied) {
                          setShowApplication(true);
                        }
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
                  <div className='space-y-1 px-6 py-8'>
                    <p className='text-lg font-bold'>Full description</p>
                    <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                      {currentJobPosting?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {currentPage === 'Selected Applied' && (
            <div className='flex flex-col space-y-2'>
              <div
                onClick={() => setCurrentPage(backPage)}
                className='w-full h-fit hover:cursor-pointer hover:bg-gray-100 p-2 mb-2 text-center border rounded-lg border-gray-300 bg-white shadow-sm font-semibold text-sm'
              >
                Go Back
              </div>
              <div className='w-full h-full bg-white overflow-auto rounded-lg border border-gray-300 shadow-md'>
                <div className='border-b h-fit'>
                  <div className='px-6 py-6'>
                    <p className='font-bold text-2xl'>
                      {currentJobPosting?.title}
                    </p>
                    <p className='font-medium text-gray-600 mt-1 text-sm'>
                      {currentJobPosting?.author?.companyName}
                    </p>
                    <div
                      onClick={() => {
                        if (!checkIfApplied) {
                          setShowApplication(true);
                        }
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
                  <div className='space-y-1 px-6 py-8'>
                    <p className='text-lg font-bold'>Full description</p>
                    <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                      {currentJobPosting?.description}
                    </p>
                  </div>
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
