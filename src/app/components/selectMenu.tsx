'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function SelectMenu({
  data,
  setSelected,
}: {
  data: { id: number; text: string }[];
  setSelected: (v: { id: number; text: string }) => void;
}) {
  return (
    <div>
      <div className='mt-2 grid grid-cols-1'>
        <select className='col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2.5 pr-8 pl-3 text-xs font-semibold text-gray-700 border border-gray-300'>
          {data.map((v, i) => (
            <option onClick={() => setSelected(v)} key={i}>
              {v.text}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden='true'
          className='pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4'
        />
      </div>
    </div>
  );
}
