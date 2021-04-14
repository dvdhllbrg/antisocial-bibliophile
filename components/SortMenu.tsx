type SortMenuProps = {
  show: boolean;
  sort: string;
  setSort: (sort: string) => void;
  sortOrder: string;
  setSortOrder: (sort: string) => void;
};

const SORT_OPTIONS = [
  { label: 'Date read', value: 'date_read' },
  { label: 'Date updated', value: 'date_updated' },
  { label: 'Date added', value: 'date_added' },
  { label: 'Title', value: 'title' },
  { label: 'Author', value: 'author' },
  { label: 'First published', value: 'year_pub' },
  { label: 'Goodreads rating', value: 'avg_rating' },
  { label: 'My rating', value: 'rating' },
];

export default function SortMenu({
  show, sort, setSort, sortOrder, setSortOrder,
}: SortMenuProps) {
  return (
    <article className={`w-full bg-white p-4 transform-gpu transition-transform duration-200 ease-out ${show ? '' : '-translate-y-full'}`}>
      <label
        htmlFor="sort_by"
        className="text-xs text-gray-600"
      >
        Sort by
      </label>
      <div className="flex items-center">
        <select
          id="sort_by"
          className="bg-white flex-grow border-b border-gray-500 text-gray-800 p-2 pl-0 outline-none"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {SORT_OPTIONS.map(
            (so) => (
              <option
                key={so.value}
                value={so.value}
              >
                {so.label}
              </option>
            ),
          )}
        </select>
        <div className="flex flex-col ml-4">
          <label>
            <input
              type="radio"
              name="sort_direction"
              value="d"
              checked={sortOrder === 'd'}
              onChange={() => setSortOrder('d')}
            />
            {' '}
            Descending
          </label>
          <label>
            <input
              type="radio"
              name="sort_direction"
              value="a"
              checked={sortOrder === 'a'}
              onChange={() => setSortOrder('a')}
            />
            {' '}
            Ascending
          </label>
        </div>
      </div>
    </article>
  );
}
