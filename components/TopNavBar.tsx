import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

type TopNavBarProps = {
  title?: string;
}

const TopNavBar: FunctionComponent<TopNavBarProps> = ({ title, children }) => {
  const { pathname, back } = useRouter();

  const showBackButton = !['/', '/auth/login'].includes(pathname);

  return (
    <div className="bg-white shadow flex items-center">
      {showBackButton && (
        <button
          type="button"
          className="p-4"
          onClick={() => back()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      <h1 className="text-xl font-bold p-4">{ title }</h1>
      <div className="ml-auto">
        { children }
      </div>
    </div>
  );
}

export default TopNavBar;
