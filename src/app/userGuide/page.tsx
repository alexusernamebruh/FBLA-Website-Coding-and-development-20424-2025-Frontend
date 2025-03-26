'use client';
import {
  AcademicCapIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  ScaleIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function UserGuide() {
  const [selected, setSelected] = useState('Applicants');
  return (
    <div className='w-full h-full min-h-screen min-w-screen flex'>
      {/* Sidenav starts */}
      <div className='bg-blue-500 w-fit overflow-hidden h-screen max-h-screen'>
        <div className='flex flex-col text-white space-y-2 items-center rounded-lg px-8 h-full py-8'>
          <p className='font-bold mb-2'>Guide for {selected}</p>
          <div className='flex flex-col space-y-1 font-semibold text-sm w-[15rem]'>
            <div className='space-y-1'>
              <div
                className={`${
                  selected === 'Applicants'
                    ? 'bg-blue-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                    : 'bg-blue-500 hover:cursor-pointer text-blue-200 hover:text-white hover:bg-blue-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                }`}
                onClick={() => {
                  if (selected !== 'Applicants') {
                    setSelected('Applicants');
                  }
                }}
              >
                <div className='w-5 h-5'>
                  <BriefcaseIcon />
                </div>
                <p>Applicant's guide</p>
              </div>
              <div
                className={`${
                  selected === 'Employers'
                    ? 'bg-blue-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                    : 'bg-blue-500 hover:cursor-pointer text-blue-200 hover:text-white hover:bg-blue-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                }`}
                onClick={() => {
                  if (selected !== 'Employers') {
                    setSelected('Employers');
                  }
                }}
              >
                <div className='w-5 h-5'>
                  <BuildingOffice2Icon />
                </div>
                <p>Employer's guide</p>
              </div>
              <div
                className={`${
                  selected === 'Admins'
                    ? 'bg-blue-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                    : 'bg-blue-500 hover:cursor-pointer text-blue-200 hover:text-white hover:bg-blue-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                }`}
                onClick={() => {
                  if (selected !== 'Admins') {
                    setSelected('Admins');
                  }
                }}
              >
                <div className='w-5 h-5'>
                  <ScaleIcon />
                </div>
                <p>Admins's guide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sidenav ends */}
      <div className='w-full h-full max-h-screen overflow-auto'>
        {selected === 'Applicants' && (
          <div className='bg-grid p-8 w-full min-h-screen h-full space-y-8 overflow-auto'>
            <div className='rounded-md shadow border w-full h-full bg-white flex flex-col'>
              <div className='border-b p-4'>
                <p className='text-2xl font-semibold'>Job Postings</p>
              </div>
              <div className='p-4 flex flex-col space-y-2 text-gray-700 text-sm font-semibold'>
                <p>
                  1. A job posting is created by an employer who is looking for
                  hires.
                </p>
                <p>2. Applicants will apply to job postings.</p>
                <p>
                  3. Each applicant's application will be reviewed by the
                  employer, and the employer will select some applicants to move
                  on to interviews.
                </p>
                <div className='flex flex-col'>
                  <p>
                    4. Applicants selected for interviews will pick an interview
                    time from a interview slot list that an employer has
                    created.
                  </p>
                  <p className='ml-4'>
                    Note: Interview slots are first come, first serve.
                  </p>
                </div>
              </div>
            </div>
            <div className='rounded-md shadow border w-full h-full bg-white flex flex-col'>
              <div className='border-b p-4'>
                <p className='text-2xl font-semibold'>AI helper</p>
              </div>
              <div className='p-4 flex flex-col space-y-2 text-gray-700 text-sm font-semibold'>
                <p>
                  The AI helper is a tool you can use to help with many things
                  concerning applications.
                </p>
                <div className='flex flex-col space-y-2'>
                  <p className='ml-4'>
                    - You can ask it to help you write your resume.
                  </p>
                  <p className='ml-4'>
                    - You can ask it to recommend you jobs off the job postings
                    lists; type in "Recommend me a job" or "Recommend me a job
                    ... (your desired filter here)."
                  </p>
                  <p className='ml-8'>
                    For example: "Recommend me a job that pays at least 11
                    dollars a hour and is looking for weekend workers."
                  </p>
                  <p className='ml-4'>
                    - You can ask it general questions about jobs, such as
                    average pay, what to expect, and caveats about a job.
                  </p>
                </div>
              </div>
            </div>
            <div className='rounded-md shadow border w-full h-full bg-white flex flex-col'>
              <div className='border-b p-4'>
                <p className='text-2xl font-semibold'>Chats & Announcements</p>
              </div>
              <div className='p-4 flex flex-col space-y-2 text-gray-700 text-sm font-semibold'>
                <p>
                  Employers may post announcements concerning a specific job
                  posting.
                </p>
                <div className='flex flex-col space-y-2'>
                  <p className='ml-4'>
                    - Announcements will include important information such as
                    updates to a posting, or interviewee instructions.
                  </p>
                  <p className='ml-4'>
                    - You will not see announcements on job postings that you
                    have not applied to.
                  </p>
                </div>
                <p>You can directly chat with an employer.</p>
                <div className='flex flex-col space-y-2'>
                  <p className='ml-4'>
                    - This chat is not for casual conversation.
                  </p>
                  <p className='ml-4'>
                    - You may want to ask for further clarifications on a
                    description or an instruction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {selected === 'Employers' && (
          <div className='bg-grid p-8 min-h-screen w-full h-full space-y-8 overflow-auto'>
            <div className='rounded-md shadow border w-full h-full bg-white flex flex-col'>
              <div className='border-b p-4'>
                <p className='text-2xl font-semibold'>Job Postings</p>
              </div>
              <div className='p-4 flex flex-col space-y-2 text-gray-700 text-sm font-semibold'>
                <p>
                  1. You will create job postings for jobs you want applications
                  for.
                </p>
                <p>
                  2. Job postings will be shown to applicants after they are
                  approved by an admin.
                </p>
                <p>3. Applicants will apply to your job posting.</p>
                <div className='flex flex-col'>
                  <p>
                    4. You will review the applications submitted by applicants,
                    and choose which applicants to move on and interview.
                  </p>
                  <p className='ml-4'>
                    4a. You will then create interview slots(times) that any
                    interviewees can sign up for.
                  </p>
                </div>
                <p>5. Applicants will sign up for interview slots.</p>
              </div>
            </div>
            <div className='rounded-md shadow border w-full h-full bg-white flex flex-col'>
              <div className='border-b p-4'>
                <p className='text-2xl font-semibold'>Chats & Announcements</p>
              </div>
              <div className='p-4 flex flex-col space-y-2 text-gray-700 text-sm font-semibold'>
                <p>
                  You may post announcements concerning a specific job posting.
                </p>
                <div className='flex flex-col space-y-2'>
                  <p className='ml-4'>
                    - Announcements will include important information such as
                    updates to a posting, or interviewee instructions.
                  </p>
                  <p className='ml-4'>
                    - You can choose to announce an announcement to either all
                    interviewees of a job posting or all applicants.
                  </p>
                </div>
                <p>
                  You can directly chat with an applicant after they have
                  created a chat with you.
                </p>
                <div className='flex flex-col space-y-2'>
                  <p className='ml-4'>
                    - This chat is not for casual conversation.
                  </p>
                  <p className='ml-4'>
                    - The applicant may ask for clarifying information or
                    instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {selected === 'Admins' && (
          <div className='bg-grid p-8 min-h-screen w-full h-full space-y-8 overflow-auto'>
            <div className='rounded-md shadow border w-full h-full bg-white flex flex-col'>
              <div className='border-b p-4'>
                <p className='text-2xl font-semibold'>Job Postings</p>
              </div>
              <div className='p-4 flex flex-col space-y-2 text-gray-700 text-sm font-semibold'>
                <p>
                  1. An employer will create a job posting that they want hires
                  for.
                </p>
                <p>
                  2. You can choose to approve or decline the job posting, this
                  way you can manage appropriate postings that you want to be
                  shown.
                </p>
              </div>
            </div>
            <div className='rounded-md shadow border w-full h-full bg-white flex flex-col'>
              <div className='border-b p-4'>
                <p className='text-2xl font-semibold'>Employers</p>
              </div>
              <div className='p-4 flex flex-col space-y-2 text-gray-700 text-sm font-semibold'>
                <p>You can create employer accounts.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
