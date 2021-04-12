import Link from 'next/link';
import Image from 'next/image';
import { SearchResult } from '@custom-types/searchResult';

type SearchResultsProps = {
  results: SearchResult[]
};

const SearchResults = ({ results }: SearchResultsProps) => {
  if (results.length === 0) {
    return (
      <p className="py-2 px-1">No search results!</p>
    );
  }
  return (
    <div className="py-2 px-1">
      {results.map((result) => (
        <Link
          href={`/book/${result.id}`}
          key={result.id}
        >
          <a className="flex items-center no-underline font-normal p-1">
            <Image
              src={result.image || '/cover.png'}
              width={33}
              height={49}
              layout="fixed"
              className="rounded-l object-cover"
            />
            <div className="flex-grow ml-2">
              <p className="mb-0 mt-1">{ result.title }</p>
              <span className="mt-0 text-sm">{ result.authors?.map((a) => a.name).join(', ') || 'unknown'}</span>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default SearchResults;
