import { useState, useEffect, MutableRefObject } from 'react';

const useOnScreen = (ref: MutableRefObject<any>) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    console.log(ref.current);
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));
    if (ref.current) {
      observer.observe(ref.current);
    }
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, []);

  return isIntersecting;
};

export default useOnScreen;
