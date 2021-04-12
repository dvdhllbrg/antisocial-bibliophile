import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import useDebounce from '@hooks/useDebounce';
import AppBar from '@components/AppBar';
import SearchResults from '@components/SearchResults';
import { SearchResult } from '@custom-types/searchResult';

const BottomAppBar = () => {
  const { pathname, events } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 250);

  useEffect(() => {
    const handleRouteChange = () => {
      setResults([]);
      setSearchTerm('');
    };

    events.on('routeChangeStart', handleRouteChange);
    return () => {
      events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    const search = async () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        const { data } = await axios.get(`/api/search?query=${debouncedSearchTerm}`);
        setIsSearching(false);
        setResults(data);
        setSearched(true);
      } else {
        setResults([]);
        setIsSearching(false);
        setSearched(false);
      }
    };
    search();
  }, [debouncedSearchTerm]);

  if (pathname.includes('/auth')) {
    return <></>;
  }

  return (
    <>
      <AppBar>
        <div className="flex flex-col w-full">
          { searched && (
            <div>
              <SearchResults results={results} />
              {results.length > 0 && (
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
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
              {isSearching ? (
                <div className="animate-spin absolute left-2.5 top-3.5 rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 absolute left-2.5 top-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </AppBar>
    </>
  );
};

export default BottomAppBar;
