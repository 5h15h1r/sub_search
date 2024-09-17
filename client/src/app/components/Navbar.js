'use client';

import Link from 'next/link';

const Navbar = ({uploadButton}) => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link href="/" className="text-white">
          SubSearch
        </Link>
      </div>
      {uploadButton?
      <div>
      <Link href="/upload">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          Upload
        </button>
      </Link>
    </div>
    :
    <div className='hidden'></div>  
    }
    </nav>
  );
};

export default Navbar;
