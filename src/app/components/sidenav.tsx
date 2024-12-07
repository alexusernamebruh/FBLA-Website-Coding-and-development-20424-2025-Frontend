import { BriefcaseIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function SideNav({
  current,
  setCurrent,
}: {
  current: string;
  setCurrent: (v: string) => void;
}) {
  return (
    <div className='flex flex-col text-white space-y-2 items-center rounded-lg px-4 h-full py-8'>
      <p className='font-bold mb-2'>Job Postings</p>
      <div className='flex flex-col space-y-1 font-semibold text-sm w-[15rem]'>
        <div
          className={`${
            current == 'All Postings'
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
      </div>
      <div className='flex flex-col h-full'>
        <div className='mt-auto mb-6 font-bold'>
          {JSON.parse(localStorage.getItem('Applicant')!).username}
        </div>
      </div>
    </div>
  );
}
