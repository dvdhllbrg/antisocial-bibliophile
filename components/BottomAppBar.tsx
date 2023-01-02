import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { HomeIcon, MagnifyingGlassIcon, CogIcon } from "@heroicons/react/24/outline";
import HideOnScroll from "@components/HideOnScroll";
import SearchResults from "@components/SearchResults";
import Spinner from "@components/elements/Spinner";
import useSearch from "@hooks/swr/useSearch";
import useOnClickOutside from "@hooks/useOnClickOutside";

const BottomAppBar = () => {
  const { events } = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const { results, isError, isValidating } = useSearch(searchTerm);

  const clearSearch = () => setSearchTerm("");

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, clearSearch);

  useEffect(() => {
    events.on("routeChangeStart", clearSearch);
    return () => {
      events.off("routeChangeStart", clearSearch);
    };
  }, [events]);

  let resultsContent = <></>;
  if (isError) {
    resultsContent = <p>Error!</p>;
  } else if (results) {
    resultsContent = (
      <div ref={ref}>
        <SearchResults results={results} />
        {results.length > 4 && (
          <Link href={`/search?query=${searchTerm}`} className="p-3 block font-normal">
            See all search results
          </Link>
        )}
      </div>
    );
  }

  return (
    <nav className="fixed bottom-0 w-full">
      <HideOnScroll direction="down">
        <div className="bg-white dark:bg-gray-900 shadow flex flex-col z-10">
          {resultsContent}
          <div key="actions-container" className="flex items-center">
            <Link href="/" className="p-4" aria-label="Home">

              <HomeIcon className="h-6 w-6" />

            </Link>
            <Link href="/settings" className="p-4" aria-label="Home">

              <CogIcon className="h-6 w-6" />

            </Link>
            <div className="relative flex-grow pr-4">
              <input
                key="search"
                type="search"
                className="w-full p-2 pl-8 rounded border border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                placeholder="Search for books or authors"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm || ""}
              />
              {isValidating ? (
                <Spinner
                  width={4}
                  height={4}
                  className="absolute left-2.5 top-3.5"
                />
              ) : (
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-2.5 top-3.5" />
              )}
            </div>
          </div>
        </div>
      </HideOnScroll>
    </nav>
  );
};

export default BottomAppBar;
