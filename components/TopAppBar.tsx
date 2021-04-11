import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import AppBar from '@components/AppBar';

type TopAppBarProps = {
  title?: string;
}

const TopAppBar: FunctionComponent<TopAppBarProps> = ({ title, children }) => {
  const { pathname, back } = useRouter();

  const showBackButton = !['/', '/auth/login'].includes(pathname);

  return (
    <AppBar position="top">
      {showBackButton && (
        <button
          type="button"
          className="p-4"
          onClick={() => back()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
        </button>
      )}
      <h1 className="text-xl font-bold p-4">{ title }</h1>
      <div className="ml-auto">
        { children }
      </div>
    </AppBar>
  );
}

export default TopAppBar;
