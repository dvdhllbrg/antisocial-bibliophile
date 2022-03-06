import { useState, useEffect, ReactNode, useCallback } from "react";

type HideOnScrollProps = {
  direction: "up" | "down";
  children?: ReactNode;
};

const HideOnScroll = ({ direction, children }: HideOnScrollProps) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.pageYOffset;
    setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 100);
    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

  const transformedClass =
    direction === "up" ? "-translate-y-full" : "translate-y-full";

  return (
    <div
      className={`transition-transform duration-200 ease-out transform-gpu ${
        visible ? "" : transformedClass
      }`}
    >
      {children}
    </div>
  );
};

export default HideOnScroll;
