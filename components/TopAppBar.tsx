import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import HideOnScroll from '@components/HideOnScroll';
import { ArrowLeftIcon } from '@heroicons/react/outline';

type TopAppBarProps = {
  title?: string;
  children?: ReactNode;
};

const TopAppBar = ({ title, children }: TopAppBarProps) => {
  const { pathname, back } = useRouter();

  const showBackButton = !['/'].includes(pathname);

  return (
    <header className="sticky top-0 w-full z-10">
      <HideOnScroll direction="up">
        <nav className="bg-white shadow flex items-center">
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
        </nav>
      </HideOnScroll>
    </header>
  );
};

export default TopAppBar;
