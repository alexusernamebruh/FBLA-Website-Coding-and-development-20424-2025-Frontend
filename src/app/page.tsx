

export default function Home() {
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-100'>
      <div className='min-h-screen min-w-screen bg-grid flex justify-center '>
        <div className='my-auto flex-col'>
          <p className='bg-clip-text text-9xl font-bold text-transparent bg-gradient-to-r from-sky-400 to-blue-500'>
            Jobs Postings
          </p>
          <p className=' text-xl font-medium text-center'>Find Job Postings!</p>
        </div>
        {/* <div className='overflow-hidden w-screen h-screen absolute opacity-[10%] bg-[conic-gradient(var(--tw-gradient-stops))] from-sky-400 via-emerald-400 to-sky-400'></div> */}
      </div>
    </div>
  );
}
