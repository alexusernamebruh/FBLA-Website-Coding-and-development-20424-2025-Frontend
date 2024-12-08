import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/16/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function MobileNavbar({
  currentPage,
  setCurrentPage,
  setTitleFilter,
  type,
}: {
  currentPage: string;
  type: string;
  setCurrentPage: (v: string) => void;
  setTitleFilter?: (v: string) => void;
}) {
  const router = useRouter();
  return (
    <div className='flex bg-blue-500 text-gray-900 justify-between items-center px-8 h-16 py-4'>
      {setTitleFilter !== undefined ? (
        <div className='grid w-full grid-cols-1'>
          <input
            onChange={(v) => {
              setTitleFilter(v.target.value);
            }}
            type='text'
            placeholder='Search'
            className='col-start-1 row-start-1 block focus:outline-none w-full bg-transparent text-sm py-2 caret-white rounded-md pl-10 pr-3 font-semibold text-white border border-white placeholder:text-white'
          />
          <MagnifyingGlassIcon
            aria-hidden='true'
            className='pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-white'
          />
        </div>
      ) : (
        <div className='w-full' />
      )}

      <div className='flex space-x-8'>
        <Menu as='div' className='relative ml-3'>
          <div>
            <MenuButton className='relative flex'>
              <div className='w-6 h-6 text-white'>
                <Bars3Icon />
              </div>
            </MenuButton>
          </div>
          <MenuItems
            transition
            className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'
          >
            {type === 'applicant' && (
              <div>
                <MenuItem>
                  <div
                    className={`${
                      currentPage === 'All Postings'
                        ? ' text-gray-700 font-semibold'
                        : 'text-gray-600 font-medium hover:cursor-pointer hover:bg-gray-100'
                    } block px-4 py-2 text-sm`}
                    onClick={() =>
                      currentPage !== 'All Postings' &&
                      setCurrentPage('All Postings')
                    }
                  >
                    All Postings
                  </div>
                </MenuItem>
                <MenuItem>
                  <div
                    className={`${
                      currentPage === 'Applied Postings'
                        ? ' text-gray-700 font-semibold'
                        : 'text-gray-600 font-medium hover:cursor-pointer hover:bg-gray-100'
                    } block px-4 py-2 text-sm`}
                    onClick={() =>
                      currentPage !== 'Applied Postings' &&
                      setCurrentPage('Applied Postings')
                    }
                  >
                    Applied Postings
                  </div>
                </MenuItem>
                <MenuItem>
                  <div
                    className={`font-semibold hover:bg-red-50 text-red-500 hover:cursor-pointer block px-4 py-2 text-sm`}
                    onClick={() => {
                      localStorage.removeItem('Applicant');
                      router.push('/login');
                    }}
                  >
                    Logout
                  </div>
                </MenuItem>
              </div>
            )}
            {type === 'employer' && (
              <div>
                <MenuItem>
                  <div
                    className={`${
                      currentPage === 'Created Postings'
                        ? ' text-gray-700 font-semibold'
                        : 'text-gray-600 font-medium hover:cursor-pointer hover:bg-gray-100'
                    } block px-4 py-2 text-sm`}
                    onClick={() =>
                      currentPage !== 'Created Postings' &&
                      setCurrentPage('Created Postings')
                    }
                  >
                    Created Postings
                  </div>
                </MenuItem>
                <MenuItem>
                  <div
                    className={`${
                      currentPage === 'Create Posting'
                        ? ' text-gray-700 font-semibold'
                        : 'text-gray-600 font-medium hover:cursor-pointer hover:bg-gray-100'
                    } block px-4 py-2 text-sm`}
                    onClick={() =>
                      currentPage !== 'Create Posting' &&
                      setCurrentPage('Create Posting')
                    }
                  >
                    Create a posting
                  </div>
                </MenuItem>
                <MenuItem>
                  <div
                    className={`font-semibold text-red-500 hover:bg-red-50 hover:cursor-pointer block px-4 py-2 text-sm`}
                    onClick={() => {
                      localStorage.removeItem('employer');
                      router.push('/employer/login');
                    }}
                  >
                    Logout
                  </div>
                </MenuItem>
              </div>
            )}
            {type === 'admin' && (
              <div>
                <MenuItem>
                  <div
                    className={`${
                      currentPage === 'Pending Job Postings'
                        ? ' text-gray-700 font-semibold'
                        : 'text-gray-600 font-medium hover:cursor-pointer hover:bg-gray-100'
                    } block px-4 py-2 text-sm`}
                    onClick={() =>
                      currentPage !== 'Pending Job Postings' &&
                      setCurrentPage('Pending Job Postings')
                    }
                  >
                    Pending Job Postings
                  </div>
                </MenuItem>
                <MenuItem>
                  <div
                    className={`${
                      currentPage === 'Accepted Job Postings'
                        ? ' text-gray-700 font-semibold'
                        : 'text-gray-600 font-medium hover:cursor-pointer hover:bg-gray-100'
                    } block px-4 py-2 text-sm`}
                    onClick={() =>
                      currentPage !== 'Accepted Job Postings' &&
                      setCurrentPage('Accepted Job Postings')
                    }
                  >
                    Accepted Job Postings
                  </div>
                </MenuItem>
                <MenuItem>
                  <div
                    className={`${
                      currentPage === 'Declined Job Postings'
                        ? ' text-gray-700 font-semibold'
                        : 'text-gray-600 font-medium hover:cursor-pointer hover:bg-gray-100'
                    } block px-4 py-2 text-sm`}
                    onClick={() =>
                      currentPage !== 'Declined Job Postings' &&
                      setCurrentPage('Declined Job Postings')
                    }
                  >
                    Declined Job Postings
                  </div>
                </MenuItem>
                <MenuItem>
                  <div
                    className={`${
                      currentPage === 'Create Employer'
                        ? ' text-gray-700 font-semibold'
                        : 'text-gray-600 font-medium hover:cursor-pointer hover:bg-gray-100'
                    } block px-4 py-2 text-sm`}
                    onClick={() =>
                      currentPage !== 'Create Employer' &&
                      setCurrentPage('Create Employer')
                    }
                  >
                    Create an employer
                  </div>
                </MenuItem>
                <MenuItem>
                  <div
                    className={`${
                      currentPage === 'All Employers'
                        ? ' text-gray-700 font-semibold'
                        : 'text-gray-600 font-medium hover:cursor-pointer hover:bg-gray-100'
                    } block px-4 py-2 text-sm`}
                    onClick={() =>
                      currentPage !== 'All Employers' &&
                      setCurrentPage('All Employers')
                    }
                  >
                    View all employers
                  </div>
                </MenuItem>
              </div>
            )}
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
}
