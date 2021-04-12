import { useState, useEffect, ReactNode } from 'react';

type AppBarProps = {
  position?: 'top' | 'bottom';
  children?: ReactNode;
};

const AppBar = ({ position = 'bottom', children }: AppBarProps) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;

    setVisible((prevScrollPos > currentScrollPos || currentScrollPos < 100));

    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

  const transformedClass = position === 'top' ? '-translate-y-full' : 'translate-y-full';
  const positionClass = position === 'top' ? 'sticky top-0' : 'fixed bottom-0';

  return (
    <nav className={`bg-white shadow flex items-center w-full ${positionClass} z-10 transition-transform duration-200 ease-out transform-gpu ${visible ? '' : transformedClass}`}>
      { children }
    </nav>
  );
};

export default AppBar;
