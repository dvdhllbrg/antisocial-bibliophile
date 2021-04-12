import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import AppBar from '@components/AppBar';
import { ArrowLeftIcon } from '@heroicons/react/outline';

type TopAppBarProps = {
  title?: string;
  children?: ReactNode;
};

const TopAppBar = ({ title, children }: TopAppBarProps) => {
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
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
      )}
      <h1 className="text-xl font-bold p-4">{ title }</h1>
      <div className="ml-auto">
        { children }
      </div>
    </AppBar>
  );
};

export default TopAppBar;
