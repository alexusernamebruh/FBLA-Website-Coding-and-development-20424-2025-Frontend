export default function Navbar() {
  return (
    <div className='flex bg-white text-gray-900 items-center rounded-lg px-14 h-16 py-4'>
      <p className='font-bold'>Guidance Department</p>
      <div className='ml-auto flex space-x-8'>
        <a href='/signup' className='font-bold hover:cursor-pointer'>
          Sign Up
        </a>
        <a href='/login' className='font-bold hover:cursor-pointer'>
          Log In
        </a>
      </div>
    </div>
  );
}
