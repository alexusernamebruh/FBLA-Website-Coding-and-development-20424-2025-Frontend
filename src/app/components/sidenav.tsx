import {
  BriefcaseIcon,
  ChatBubbleLeftEllipsisIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  MegaphoneIcon,
  PlusCircleIcon,
  UserGroupIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function SideNav({
  current,
  setCurrent,
  type,
}: {
  current: string;
  setCurrent: (v: string) => void;
  type: string;
}) {
  const router = useRouter();
  return (
    <div className='flex flex-col text-white space-y-2 items-center rounded-lg px-4 h-full py-8'>
      <p className='font-bold mb-2'>Job Postings</p>
      <div className='flex flex-col space-y-1 font-semibold text-sm w-[15rem]'>
        {type === 'applicant' && (
          <div className='space-y-1'>
            <div
              className={`${
                current === 'All Postings'
                  ? 'bg-blue-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                  : 'bg-blue-500 hover:cursor-pointer text-blue-200 hover:text-white hover:bg-blue-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
              }`}
              onClick={() => {
                if (current !== 'All Postings') {
                  setCurrent('All Postings');
                }
              }}
            >
              <div className='w-5 h-5'>
                <BriefcaseIcon />
              </div>
              <p>All Postings</p>
            </div>
            <div
              className={`${
                current == 'Applied Postings'
                  ? 'bg-blue-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                  : 'bg-blue-500 hover:cursor-pointer text-blue-200 hover:text-white hover:bg-blue-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
              }`}
              onClick={() => {
                if (current !== 'Applied Postings') {
                  setCurrent('Applied Postings');
                }
              }}
            >
              <div className='w-5 h-5'>
                <EnvelopeIcon />
              </div>
              <p>Applied Postings</p>
            </div>
            <div
              className={`${
                current == 'Ai Helper'
                  ? 'bg-blue-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                  : 'bg-blue-500 hover:cursor-pointer text-blue-200 hover:text-white hover:bg-blue-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
              }`}
              onClick={() => {
                if (current !== 'Ai Helper') {
                  setCurrent('Ai Helper');
                }
              }}
            >
              <div className='w-5 h-5'>
                <ChatBubbleLeftEllipsisIcon />
              </div>
              <p>Ai Helper</p>
            </div>
            <div
              className={`${
                current == 'Chats & Announcements'
                  ? 'bg-blue-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                  : 'bg-blue-500 hover:cursor-pointer text-blue-200 hover:text-white hover:bg-blue-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
              }`}
              onClick={() => {
                if (current !== 'Chats & Announcements') {
                  setCurrent('Chats & Announcements');
                }
              }}
            >
              <div className='w-5 h-5'>
                <MegaphoneIcon />
              </div>
              <p>Chats & Announcements</p>
            </div>
          </div>
        )}
        {type === 'employer' && (
          <div className='space-y-1'>
            <div
              className={`${
                current === 'Created Postings'
                  ? 'bg-blue-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                  : 'bg-blue-500 hover:cursor-pointer text-blue-200 hover:text-white hover:bg-blue-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
              }`}
              onClick={() => {
                if (current !== 'Created Postings') {
                  setCurrent('Created Postings');
                }
              }}
            >
              <div className='w-5 h-5'>
                <BriefcaseIcon />
              </div>
              <p>Created Postings</p>
            </div>
            <div
              className={`${
                current == 'Create Posting'
                  ? 'bg-blue-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                  : 'bg-blue-500 hover:cursor-pointer text-blue-200 hover:text-white hover:bg-blue-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
              }`}
              onClick={() => {
                if (current !== 'Create Posting') {
                  setCurrent('Create Posting');
                }
              }}
            >
              <div className='w-5 h-5'>
                <PlusCircleIcon />
              </div>
              <p>Create a posting</p>
            </div>
            <div
              className={`${
                current == 'Chats & Announcements'
                  ? 'bg-blue-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                  : 'bg-blue-500 hover:cursor-pointer text-blue-200 hover:text-white hover:bg-blue-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
              }`}
              onClick={() => {
                if (current !== 'Chats & Announcements') {
                  setCurrent('Chats & Announcements');
                }
              }}
            >
              <div className='w-5 h-5'>
                <MegaphoneIcon />
              </div>
              <p>Chats & Announcements</p>
            </div>
          </div>
        )}
        {type === 'admin' && (
          <div className='space-y-1'>
            <div
              className={`${
                current === 'Pending Job Postings'
                  ? 'bg-blue-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                  : 'bg-blue-500 hover:cursor-pointer text-blue-200 hover:text-white hover:bg-blue-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
              }`}
              onClick={() => {
                if (current !== 'Pending Job Postings') {
                  setCurrent('Pending Job Postings');
                }
              }}
            >
              <div className='w-5 h-5'>
                <BriefcaseIcon />
              </div>
              <p>Pending Job Postings</p>
            </div>

            <div
              className={`${
                current === 'Accepted Job Postings'
                  ? 'bg-blue-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                  : 'bg-blue-500 hover:cursor-pointer text-blue-200 hover:text-white hover:bg-blue-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
              }`}
              onClick={() => {
                if (current !== 'Accepted Job Postings') {
                  setCurrent('Accepted Job Postings');
                }
              }}
            >
              <div className='w-5 h-5'>
                <CheckBadgeIcon />
              </div>
              <p>Accepted Job Postings</p>
            </div>

            <div
              className={`${
                current === 'Declined Job Postings'
                  ? 'bg-blue-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                  : 'bg-blue-500 hover:cursor-pointer text-blue-200 hover:text-white hover:bg-blue-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
              }`}
              onClick={() => {
                if (current !== 'Declined Job Postings') {
                  setCurrent('Declined Job Postings');
                }
              }}
            >
              <div className='w-5 h-5'>
                <XCircleIcon />
              </div>
              <p>Declined Job Postings</p>
            </div>

            <div
              className={`${
                current == 'Create Employer'
                  ? 'bg-blue-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                  : 'bg-blue-500 hover:cursor-pointer text-blue-200 hover:text-white hover:bg-blue-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
              }`}
              onClick={() => {
                if (current !== 'Create Employer') {
                  setCurrent('Create Employer');
                }
              }}
            >
              <div className='w-5 h-5'>
                <PlusCircleIcon />
              </div>
              <p>Create an employer</p>
            </div>
            <div
              className={`${
                current == 'All Employers'
                  ? 'bg-blue-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                  : 'bg-blue-500 hover:cursor-pointer text-blue-200 hover:text-white hover:bg-blue-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
              }`}
              onClick={() => {
                if (current !== 'All Employers') {
                  setCurrent('All Employers');
                }
              }}
            >
              <div className='w-5 h-5'>
                <UserGroupIcon />
              </div>
              <p>View all employers</p>
            </div>
          </div>
        )}
      </div>

      <div className='flex flex-col items-center mb-6 h-full space-y-2'>
        <div className='font-bold mt-auto'>
          {type === 'applicant' &&
            JSON.parse(localStorage.getItem('Applicant')!).username}
          {type === 'employer' &&
            JSON.parse(localStorage.getItem('Employer')!).username}
          {type === 'admin' && 'Admin'}
        </div>
        {type !== 'admin' && (
          <div
            onClick={() => {
              if (type === 'applicant') {
                localStorage.removeItem('applicant');
                router.push('/login');
              }
              if (type === 'employer') {
                localStorage.removeItem('employer');
                router.push('/employer/login');
              }
            }}
            className='font-bold hover:text-red-500 hover:border-red-500 hover:cursor-pointer border border-white px-3 py-1 rounded-md w-full text-center'
          >
            Logout
          </div>
        )}
      </div>
    </div>
  );
}
