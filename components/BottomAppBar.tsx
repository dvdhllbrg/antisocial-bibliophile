import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import { HomeIcon, SearchIcon } from '@heroicons/react/outline';
import useDebounce from '@hooks/useDebounce';
import AppBar from '@components/AppBar';
import SearchResults from '@components/SearchResults';
import { SearchResult } from '@custom-types/searchResult';

const BottomAppBar = () => {
  const { pathname, events } = useRouter();

  if (pathname.includes('/auth/')) {
    return <></>;
  }

  const [searchTerm, setSearchTerm] = useState('');
  // const [results, setResults] = useState<SearchResult[]>([]);
  // const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 250);

  const { data: results, error, isValidating } = useSWR<SearchResult[]>(
    debouncedSearchTerm
      ? `/api/search?query=${debouncedSearchTerm}`
      : null,
  );
  useEffect(() => {
    const handleRouteChange = () => {
      setSearched(false);
      setSearchTerm('');
    };

    events.on('routeChangeStart', handleRouteChange);
    return () => {
      events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

  useEffect(() => setSearched(!isValidating), [isValidating]);
  useEffect(() => {
    if (!searchTerm) {
      setSearched(false);
    }
  }, [searchTerm]);

  return (
    <>
      <AppBar>
        <div className="flex flex-col w-full">
          { searched && (
            <div>
              <SearchResults results={results || []} />
              {results && results.length > 0 && (
                <Link href={`/search?query=${searchTerm}`}>
                  <a className="p-3 block font-normal">See all search results</a>
                </Link>
              )}
            </div>
          )}
          <div className="flex items-center">
            <Link href="/">
              <a
                className="p-4"
              >
                <HomeIcon className="h-6 w-6" />
              </a>
            </Link>
            <div className="relative flex-grow pr-4">
              <input
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
      </AppBar>
    </>
  );
};

export default BottomAppBar;