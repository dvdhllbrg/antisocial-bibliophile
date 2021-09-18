import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { HomeIcon, SearchIcon } from '@heroicons/react/outline';
import HideOnScroll from '@components/HideOnScroll';
import SearchResults from '@components/SearchResults';
import useSearch from '@hooks/swr/useSearch';
import useOnClickOutside from '@hooks/useOnClickOutside';

const BottomAppBar = () => {
  const { events } = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const { results, isError, isValidating } = useSearch(searchTerm);

  const clearSearch = () => setSearchTerm('');

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, clearSearch);

  useEffect(() => {
    events.on('routeChangeStart', clearSearch);
    return () => {
      events.off('routeChangeStart', clearSearch);
    };
  }, []);

  let resultsContent = <></>;
  if (isError) {
    resultsContent = <p>Error!</p>;
  } else if (results) {
    resultsContent = (
      <div ref={ref}>
        <SearchResults results={results} />
        { results.length > 4 && (
        <Link href={`/search?query=${searchTerm}`}>
          <a className="p-3 block font-normal">See all search results</a>
        </Link>
        )}
      </div>
    );
  }

  return (
    <nav className="fixed bottom-0 w-full">
      <HideOnScroll direction="down">
        <div className="bg-white shadow flex flex-col z-10">
          { resultsContent }
          <div
            key="actions-container"
            className="flex items-center"
          >
            <Link href="/">
              <a
                className="p-4"
                aria-label="Home"
              >
                <HomeIcon className="h-6 w-6" />
              </a>
            </Link>
            <div className="relative flex-grow pr-4">
              <input
                key="search"
                type="search"
                className="w-full p-2 pl-8 rounded border border-gray-200 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Search for books or authors"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm || ''}
              />
              {isValidating
                ? <div className="animate-spin absolute left-2.5 top-3.5 rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900" />
                : <SearchIcon className="h-4 w-4 absolute left-2.5 top-3.5" />}
            </div>
          </div>
        </div>
      </HideOnScroll>
    </nav>
  );
};

export default BottomAppBar;
