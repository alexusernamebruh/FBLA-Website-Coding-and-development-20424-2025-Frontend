const navigation = {
  contact: [
    { name: 'guidance_department@southwesternsd.org', href: '#' },
    { name: '717-632-2500', href: '#' },
    { name: '225 Bowman Road', href: '#' },
    { name: 'Hanover', href: '#' },
    { name: 'Pennsylvania', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className='w-full mb-8 bg-white py-8 bg-opacity-50'>
      <div className='mx-auto text-center max-w-7xl'>
        <div className=''>
          <div className='mt-16'>
            <div className=''>
              <div>
                <h3 className='text-lg font-semibold text-gray-900'>Contact</h3>
                <ul role='list' className='mt-6 space-y-4'>
                  {navigation.contact.map((item) => (
                    <li key={item.name} className='text-md'>
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
