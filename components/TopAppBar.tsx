"use client";

import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import HideOnScroll from "@components/HideOnScroll";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type TopAppBarProps = {
  title?: string;
  children?: ReactNode;
};

const TopAppBar = ({ title, children }: TopAppBarProps) => {
  const { back } = useRouter();
  const pathname = usePathname() ?? "";

  const showBackButton = !["/"].includes(pathname);

  return (
    <header className="sticky top-0 w-full z-10">
      <HideOnScroll direction="up">
        <nav className="bg-gray-50 dark:bg-gray-900 flex items-start">
          {showBackButton && (
            <button type="button" className="p-4" onClick={() => back()}>
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
          )}
          <h1 className="text-xl font-bold p-3">{title}</h1>
          <div className="ml-auto">{children}</div>
        </nav>
      </HideOnScroll>
    </header>
  );
};

export default TopAppBar;
