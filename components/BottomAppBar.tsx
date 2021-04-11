import { useRouter } from 'next/router';
import Link from 'next/link';
import AppBar from '@components/AppBar';

const BottomAppBar = () => {
  const { pathname } = useRouter();

  if(pathname.includes('/auth')) {
    return <></>
  };

  return (
    <AppBar>
      <Link href="/">
        <a
          className="p-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </a>
      </Link>
      <div className="relative flex-grow pr-4">
        <input
          type="search"
          className="w-full p-2 pl-8 rounded border border-gray-200 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="Search for books or authors"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </AppBar>
  );
}

export default BottomAppBar;
