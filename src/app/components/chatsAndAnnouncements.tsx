import { useEffect, useRef, useState } from 'react';
import Modal from './modal';
import SelectMenu from './selectMenu';
import { a } from '../config';
import Success from './success';
import dayjs from 'dayjs';
import {
  IEmployer,
  IEmployerAnnouncement,
  IEmployerApplicantChat,
  IEmployerApplicantChatContent,
  IJobPosting,
} from '../interfaces';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';

export default function ChatsAndAnnouncements({
  userType,
}: {
  userType: string;
}) {
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [selected, setSelected] = useState('Announcements');
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');
  const [selectedAnnounceTo, setSelectedAnnounceTo] = useState<{
    id: number;
    text: string;
  }>({ id: 1, text: 'All Applicants of this posting' });
  const [createAnnouncementSuccess, setCreateAnnouncementSuccess] =
    useState(false);
  const [jobPostings, setJobPostings] = useState([]);
  const [selectedJobPosting, setSelectedJobPosting] = useState<IJobPosting>();
  const [announcements, setAnnouncements] = useState<IEmployerAnnouncement[]>(
    [],
  );
  const [announcementsApplicantCanView, setAnnouncementsApplicantCanView] =
    useState<IEmployerAnnouncement[]>([]);
  const [showCreateChat, setShowCreateChat] = useState(false);
  const [employerSearchFilter, setEmployerSearchFilter] = useState('');
  const [filteredEmployers, setFilteredEmployers] = useState<IEmployer[]>([]);
  const [selectedEmployer, setSelectedEmployer] = useState<IEmployer>();
  const [selectedChat, setSelectedChat] = useState<IEmployerApplicantChat>();
  const [chats, setChats] = useState<IEmployerApplicantChat[]>([]);
  const [message, setMessage] = useState('');

  const createAnnouncement = async () => {
    setShowCreateAnnouncement(false);
    const { data: result } = await a.post('/chats/announcements/create', {
      employerId: JSON.parse(localStorage.getItem('Employer')!).id,
      announceTo: selectedAnnounceTo.id === 1 ? 'APPLIERS' : 'INTERVIEWEES',
      title: newAnnouncementTitle,
      content: newAnnouncementContent,
      jobPostingId: selectedJobPosting?.id,
    });
    if (result) {
      setNewAnnouncementContent('');
      setNewAnnouncementTitle('');
      setSelectedAnnounceTo({ id: 1, text: 'All Applicants of this posting' });
      setCreateAnnouncementSuccess(true);
      getCreatedAnnouncements();
      const timer = setTimeout(() => {
        setCreateAnnouncementSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  };

  const getCreatedAnnouncements = async () => {
    const { data: result } = await a.get(
      `/chats/announcements/getByEmployerId/${
        JSON.parse(localStorage.getItem('Employer')!).id
      }`,
    );
    setAnnouncements(result);
  };

  const getAnnouncementsApplicantCanView = async () => {
    const { data: result } = await a.get(
      `/chats/announcements/getByApplicantId/${
        JSON.parse(localStorage.getItem('Applicant')!).applicantId
      }`,
    );
    setAnnouncementsApplicantCanView(result);
  };

  const getJobPostings = async () => {
    const { data: result } = await a.get(
      `/jobPostings/author/${JSON.parse(localStorage.getItem('Employer')!).id}`,
    );
    setJobPostings(result);
  };

  const getAllEmployers = async (searchFilter: string) => {
    const { data: result } = await a.get(
      `/employers?searchFilter=${searchFilter}`,
    );
    setFilteredEmployers(result);
  };

  const createNewChat = async () => {
    const { data: result } = await a.post('/chats/create', {
      employerId: selectedEmployer?.id,
      applicantId: JSON.parse(localStorage.getItem('Applicant')!).applicantId,
    });
    setSelectedChat(result);
    setSelected('Chat');
    setShowCreateChat(false);
  };

  const getChatsForApplicant = async () => {
    const { data: result } = await a.get(
      `/chats/getByApplicantId/${
        JSON.parse(localStorage.getItem('Applicant')!).applicantId
      }`,
    );
    if (selectedChat) {
      setSelectedChat(
        result.find((e: { id: number }) => e.id === selectedChat?.id),
      );
    }
    setChats(result);
  };

  const getChatsForEmployer = async () => {
    const { data: result } = await a.get(
      `/chats/getByEmployerId/${
        JSON.parse(localStorage.getItem('Employer')!).id
      }`,
    );
    if (selectedChat) {
      setSelectedChat(
        result.find((e: { id: number }) => e.id === selectedChat?.id),
      );
    }

    setChats(result);
  };

  const sendChatMessage = async () => {
    if (message !== '') {
      const { data: result } = await a.put(
        `/chats/sendMessage/${selectedChat?.id}`,
        {
          message: message,
          senderId:
            userType === 'Applicant'
              ? JSON.parse(localStorage.getItem('Applicant')!).applicantId
              : JSON.parse(localStorage.getItem('Employer')!).id,
          senderType: userType,
        },
      );
      setSelectedChat(result);
      setMessage('');

      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }

      if (userType === 'Applicant') {
        getChatsForApplicant();
      } else {
        getChatsForEmployer();
      }
    }
  };

  const adjustHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    getAllEmployers('');
    if (userType === 'Applicant') {
      getAnnouncementsApplicantCanView();
      getChatsForApplicant();
    } else {
      getChatsForEmployer();
      getJobPostings();
      getCreatedAnnouncements();
    }
  }, [userType]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (userType === 'Applicant') {
        getChatsForApplicant();
      } else {
        getChatsForEmployer();
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [selectedChat]);

  useEffect(() => {
    return () => {
      localStorage.setItem('lastSeen', JSON.stringify(new Date()));
    };
  }, []);

  return (
    <div className='p-6 w-full h-full'>
      <div className='absolute top-0 right-0'>
        <Success
          title={'Success!'}
          description={'Successfully created announcement.'}
          show={createAnnouncementSuccess}
          setShow={setCreateAnnouncementSuccess}
        />
      </div>
      <Modal open={showCreateAnnouncement} setOpen={setShowCreateAnnouncement}>
        <div className='flex flex-col'>
          <div className='space-y-2'>
            <div>
              <label className='block text-sm/6 font-bold text-gray-900'>
                Title*
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  onChange={(v) => setNewAnnouncementTitle(v.target.value)}
                  value={newAnnouncementTitle}
                  required
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                />
              </div>
            </div>
            <div className='flex flex-col'>
              <label className='block text-sm/6 font-bold text-gray-900'>
                Announce to*
              </label>
              <SelectMenu
                data={[
                  { id: 1, text: 'All Applicants of this posting' },
                  { id: 2, text: 'All Eligible Interviewees of this posting' },
                ]}
                setSelected={setSelectedAnnounceTo}
              />
            </div>
            <div>
              <label className='block text-sm/6 font-bold text-gray-900'>
                Content*
              </label>
              <div className='mt-2'>
                <textarea
                  onChange={(v) => setNewAnnouncementContent(v.target.value)}
                  value={newAnnouncementContent}
                  rows={5}
                  required
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                />
              </div>
            </div>
            <div className='flex flex-col'>
              <label className='block text-sm/6 font-bold text-gray-900'>
                Job Posting*
              </label>
              <div className='flex flex-col space-y-2'>
                {jobPostings.map((v: IJobPosting, i) => (
                  <div
                    className='rounded-md justify-between space-x-4 border flex items-center text-xs border-gray-300 p-2'
                    key={i}
                  >
                    <div className='flex flex-col space-y-0.5 text-gray-700'>
                      <p>{v.title}</p>
                      <p>
                        Created on {dayjs(v.createdAt).format('MM/DD/YYYY')}
                      </p>
                      <p>
                        {v.applicantsCanInterview.length} Eligible Interviewees
                      </p>
                    </div>
                    <div
                      onClick={() => setSelectedJobPosting(v)}
                      className={`font-semibold h-fit px-2 py-1.5 text-sm rounded-md ${
                        selectedJobPosting?.id === v.id
                          ? 'text-gray-700 border hover:cursor-not-allowed'
                          : 'text-white bg-blue-500 hover:bg-blue-600 hover:cursor-pointer'
                      }`}
                    >
                      {selectedJobPosting?.id === v.id
                        ? 'Selected'
                        : 'Select this'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            onClick={() => createAnnouncement()}
            className='bg-blue-500 mt-3.5 w-full text-center hover:bg-blue-600 rounded-md text-white font-semibold py-2 px-3.5 hover:cursor-pointer'
          >
            Create Announcement
          </div>
        </div>
      </Modal>
      <Modal open={showCreateChat} setOpen={setShowCreateChat}>
        <div className='flex flex-col'>
          <div className='space-y-2'>
            <div>
              <label className='block text-sm/6 font-bold text-gray-900'>
                Employer search filter
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  onChange={(v) => {
                    setEmployerSearchFilter(v.target.value);
                    getAllEmployers(v.target.value);
                  }}
                  value={employerSearchFilter}
                  required
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                />
              </div>
            </div>
            <div className='flex flex-col'>
              <label className='block text-md mb-1 font-bold text-gray-900'>
                Employer to create chat with
              </label>
              <div className='flex flex-col space-y-2'>
                {filteredEmployers.map((v: IEmployer, i) => (
                  <div
                    className='rounded-md justify-between space-x-4 border flex items-center text-xs border-gray-300 p-2'
                    key={i}
                  >
                    <div className='flex flex-col space-y-0.5 text-gray-700'>
                      <p>{v.companyName}</p>
                    </div>
                    <div
                      onClick={() => setSelectedEmployer(v)}
                      className={`font-semibold h-fit px-2 py-1.5 text-sm rounded-md ${
                        selectedEmployer?.id === v.id
                          ? 'text-gray-700 border hover:cursor-not-allowed'
                          : 'text-white bg-blue-500 hover:bg-blue-600 hover:cursor-pointer'
                      }`}
                    >
                      {selectedEmployer?.id === v.id ? 'Selected' : 'Select'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            onClick={() => createNewChat()}
            className='bg-blue-500 mt-3.5 w-full text-center hover:bg-blue-600 rounded-md text-white font-semibold py-2 px-3.5 hover:cursor-pointer'
          >
            Create New Chat
          </div>
        </div>
      </Modal>
      <div className='border flex border-gray-300 shadow rounded-md bg-white w-full h-full'>
        {/* Sidebar starts */}
        <div className='max-w-[20rem] flex items-center flex-col w-fit h-full space-y-1 border-r border-gray-300'>
          <div className='px-4 py-4 border-b border-gray-300 w-full'>
            {userType === 'Applicant' && (
              <div
                onClick={() => {
                  setShowCreateChat(true);
                }}
                className='px-4 py-2 text-sm font-semibold w-full text-center mb-2.5 rounded-md border border-gray-300 hover:cursor-pointer hover:bg-gray-100'
              >
                New Chat
              </div>
            )}
            <div
              onClick={() => {
                setSelected('Announcements');
              }}
              className='px-4 py-2 text-sm font-semibold w-full text-center mb-1 rounded-md border border-gray-300 hover:cursor-pointer hover:bg-gray-100'
            >
              Announcements
            </div>
          </div>
          <div className='px-4 py-4 flex overflow-auto scrollbar-hide flex-col'>
            <p className='text-sm text-center mb-1 font-semibold'>
              {chats.length ? 'Existing Chats' : 'No chats yet'}
            </p>
            {chats.map((v: IEmployerApplicantChat, i) => (
              <div
                onClick={() => {
                  setSelected('Chat');
                  setSelectedChat(v);
                }}
                key={i}
                className='text-sm group justify-center overflow-x-clip max-w-[15rem] whitespace-nowrap inline-flex font-semibold text-gray-700 px-4 items-center py-1.5 w-full  hover:bg-gray-100 hover:cursor-pointer rounded-md'
              >
                <div key={i} className='mr-1 max-w-[11.5rem] overflow-x-clip '>
                  <p className='mx-auto'>
                    {userType === 'Applicant'
                      ? v.employer.companyName
                      : v.applicant.fullname}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Sidebar ends */}

        {userType === 'Applicant' && (
          <div className='flex flex-col w-full h-full'>
            {selected === 'Chat' && (
              <div className='flex flex-col w-full h-full'>
                <div className='border-b flex justify-between items-center py-4 px-4'>
                  <p className='text-lg font-semibold'>
                    Chat with {selectedChat?.employer?.companyName}
                  </p>
                </div>
                <div className='mt-6 overflow-auto scrollbar-hide h-full px-6 space-y-4 py-8 w-full'>
                  {JSON.parse(selectedChat?.content ?? '[]').length ? (
                    JSON.parse(selectedChat?.content ?? '[]').map(
                      (content: IEmployerApplicantChatContent, i: number) => (
                        <div key={i} className='w-full flex flex-col'>
                          <div
                            className={`whitespace-pre-wrap text-base font-medium max-w-[75%] py-2 px-3 w-fit rounded-md ${
                              content.senderType === 'Employer'
                                ? 'mr-auto bg-gray-100'
                                : 'ml-auto bg-blue-100'
                            }`}
                          >
                            {content.messageContent}
                          </div>
                        </div>
                      ),
                    )
                  ) : (
                    <div className='text-xl mx-auto font-semibold my-auto'>
                      No messages have been sent yet
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>
                <div className='p-6'>
                  <div className='mt-auto border border-gray-300 rounded-md'>
                    <div className='w-full flex items-start'>
                      <div className='h-full flex mt-[1.15rem] mb-4 flex-col justify-start'>
                        <ChatBubbleLeftEllipsisIcon
                          aria-hidden='true'
                          className='pointer-events-none col-start-1 row-start-1 ml-3 size-5 text-gray-400'
                        />
                      </div>
                      <textarea
                        ref={inputRef}
                        onChange={(v) => {
                          setMessage(v.target.value);
                          adjustHeight();
                        }}
                        value={message}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            sendChatMessage();
                          }
                          if (e.key === 'Tab') {
                            e.preventDefault();

                            const start = (e.target as HTMLTextAreaElement)
                              .selectionStart;
                            const end = (e.target as HTMLTextAreaElement)
                              .selectionEnd;

                            const newValue =
                              message.slice(0, start) +
                              '\t' +
                              message.slice(end);

                            setMessage(newValue);

                            setTimeout(() => {
                              (e.target as HTMLTextAreaElement).selectionStart =
                                (e.target as HTMLTextAreaElement).selectionEnd =
                                  start + 1;
                            }, 0);
                          }
                        }}
                        rows={1}
                        placeholder='Respond to a question'
                        className='col-start-1 resize-none overflow-hidden row-start-1 rounded-md block focus:outline-none w-full bg-white py-4 px-2.5 text-base text-gray-900 placeholder:text-gray-400'
                        style={{
                          overflowY: 'hidden',
                          lineHeight: '1.5',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selected === 'Announcements' && (
              <div className='flex flex-col w-full h-full'>
                <div className='border-b flex justify-between items-center border-b-gray-300 py-[1.055rem] px-4'>
                  <p className='text-lg font-semibold'>
                    Announcements from employers
                  </p>
                </div>
                <div className='flex flex-col w-full h-full space-y-4 p-4 overflow-auto'>
                  {announcementsApplicantCanView.length ? (
                    <div className='space-y-4'>
                      {announcementsApplicantCanView.map(
                        (v: IEmployerAnnouncement, i: number) => (
                          <div
                            key={i}
                            className='flex flex-col shadow border w-full h-fit space-y-2 rounded-md border-gray-300'
                          >
                            <div className='space-y-0.5'>
                              <div className='border-b p-4'>
                                <p className='font-semibold'>{v.title}</p>
                                <p className='text-gray-700 text-sm'>
                                  Created on{' '}
                                  {dayjs(v.createdAt).format('MM/DD/YYYY')}
                                </p>
                              </div>
                              <div className='pt-4 px-4'>
                                <p className='text-gray-700 whitespace-pre-wrap text-sm'>
                                  {v.content}
                                </p>
                              </div>
                            </div>
                            <div className='p-4'>
                              <div className='flex flex-col text-sm border w-full h-fit space-y-1 rounded-md border-gray-300'>
                                <div className='p-4 border-b space-y-1'>
                                  <p className='font-semibold'>
                                    Job Posting Information
                                  </p>
                                  <p className='text-gray-700'>
                                    {v.jobPosting.title}
                                  </p>
                                  <p className='text-gray-700'>
                                    By {v.employer.companyName}
                                  </p>
                                </div>
                                <div className='p-4 space-y-1 border-b'>
                                  <p className='text-gray-700 whitespace-pre-wrap'>
                                    {v.jobPosting.description}
                                  </p>
                                </div>
                                <div className='p-4 space-y-1'>
                                  <p className='text-gray-700 whitespace-pre-wrap'>
                                    Created on{' '}
                                    {dayjs(v.jobPosting.createdAt).format(
                                      'MM/DD/YYYY',
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className='mx-auto my-auto font-semibold text-2xl'>
                      No Created Announcements yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {userType === 'Employer' && (
          <div className='flex flex-col w-full h-full'>
            {selected === 'Chat' && (
              <div className='flex flex-col w-full h-full'>
                <div className='border-b flex justify-between items-center py-4 px-4'>
                  <p className='text-lg font-semibold'>
                    Chat with {selectedChat?.applicant?.fullname}
                  </p>
                </div>
                <div className='mt-6 overflow-auto scrollbar-hide h-full px-6 space-y-4 py-8 w-full'>
                  {JSON.parse(selectedChat?.content ?? '[]').length ? (
                    JSON.parse(selectedChat?.content ?? '[]').map(
                      (content: IEmployerApplicantChatContent, i: number) => (
                        <div key={i} className='w-full flex flex-col'>
                          <div
                            className={`whitespace-pre-wrap text-base font-medium max-w-[75%] py-2 px-3 w-fit rounded-md ${
                              content.senderType === 'Applicant'
                                ? 'mr-auto bg-gray-100'
                                : 'ml-auto bg-blue-100'
                            }`}
                          >
                            {content.messageContent}
                          </div>
                        </div>
                      ),
                    )
                  ) : (
                    <div className='text-xl mx-auto font-semibold my-auto'>
                      No messages have been sent yet
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>
                <div className='p-6'>
                  <div className='mt-auto border border-gray-300 rounded-md'>
                    <div className='w-full flex items-start'>
                      <div className='h-full flex mt-[1.15rem] mb-4 flex-col justify-start'>
                        <ChatBubbleLeftEllipsisIcon
                          aria-hidden='true'
                          className='pointer-events-none col-start-1 row-start-1 ml-3 size-5 text-gray-400'
                        />
                      </div>
                      <textarea
                        ref={inputRef}
                        onChange={(v) => {
                          setMessage(v.target.value);
                          adjustHeight();
                        }}
                        value={message}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            sendChatMessage();
                          }
                          if (e.key === 'Tab') {
                            e.preventDefault();

                            const start = (e.target as HTMLTextAreaElement)
                              .selectionStart;
                            const end = (e.target as HTMLTextAreaElement)
                              .selectionEnd;

                            const newValue =
                              message.slice(0, start) +
                              '\t' +
                              message.slice(end);

                            setMessage(newValue);

                            setTimeout(() => {
                              (e.target as HTMLTextAreaElement).selectionStart =
                                (e.target as HTMLTextAreaElement).selectionEnd =
                                  start + 1;
                            }, 0);
                          }
                        }}
                        rows={1}
                        placeholder='Respond to a question'
                        className='col-start-1 resize-none overflow-hidden row-start-1 rounded-md block focus:outline-none w-full bg-white py-4 px-2.5 text-base text-gray-900 placeholder:text-gray-400'
                        style={{
                          overflowY: 'hidden',
                          lineHeight: '1.5',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selected === 'Announcements' && (
              <div className='flex flex-col w-full h-full'>
                <div className='border-b flex justify-between items-center border-b-gray-300 py-[1.055rem] px-4'>
                  <p className='text-lg font-semibold'>
                    Announcements created by you
                  </p>
                  <div
                    onClick={() => setShowCreateAnnouncement(true)}
                    className='bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold py-2 px-3.5 hover:cursor-pointer'
                  >
                    Create an Announcement
                  </div>
                </div>
                <div className='flex flex-col w-full h-full space-y-4 p-4 overflow-auto'>
                  {announcements.length ? (
                    <div className='space-y-4'>
                      {announcements.map(
                        (v: IEmployerAnnouncement, i: number) => (
                          <div
                            key={i}
                            className='flex flex-col shadow border w-full h-fit space-y-2 rounded-md border-gray-300'
                          >
                            <div className='space-y-0.5'>
                              <div className='border-b p-4'>
                                <p className='font-semibold'>{v.title}</p>
                                <p className='text-gray-700 text-sm'>
                                  Created on{' '}
                                  {dayjs(v.createdAt).format('MM/DD/YYYY')}
                                </p>
                              </div>
                              <div className='pt-4 px-4'>
                                <p className='text-gray-700 whitespace-pre-wrap text-sm'>
                                  {v.content}
                                </p>
                              </div>
                            </div>
                            <div className='p-4'>
                              <div className='flex flex-col text-sm border w-full h-fit space-y-1 rounded-md border-gray-300'>
                                <div className='p-4 border-b space-y-1'>
                                  <p className='font-semibold'>
                                    Job Posting Information
                                  </p>
                                  <p className='text-gray-700'>
                                    {v.jobPosting.title}
                                  </p>
                                </div>
                                <div className='p-4 space-y-1 border-b'>
                                  <p className='text-gray-700 whitespace-pre-wrap'>
                                    {v.jobPosting.description}
                                  </p>
                                </div>
                                <div className='p-4 space-y-1'>
                                  <p className='text-gray-700 whitespace-pre-wrap'>
                                    Created on{' '}
                                    {dayjs(v.jobPosting.createdAt).format(
                                      'MM/DD/YYYY',
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className='mx-auto my-auto font-semibold text-2xl'>
                      No Created Announcements yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
