import { ReactNode, useRef } from 'react';
import FocusLock from 'react-focus-lock';
import { XIcon } from '@heroicons/react/solid';
import useOnClickOutside from '@hooks/useOnClickOutside';
import useLockBodyScroll from '@hooks/useLockBodyScroll';

type ModalProps = {
  onClose: () => void;
  children?: ReactNode;
};

const Modal = ({ onClose, children }: ModalProps) => {
  useLockBodyScroll();

  const modalRef = useRef(null);
  useOnClickOutside(modalRef, onClose);

  return (
    <FocusLock>
      <div className="p-2 fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300">
        <div
          ref={modalRef}
          className="flex flex-col max-w-3xl max-h-full overflow-auto"
        >
          <div className="z-50">
            <button
              className="float-right pt-2 pr-2"
              onClick={onClose}
            >
              <XIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="p-2">
            { children }
          </div>
        </div>
      </div>
    </FocusLock>
  );
};

export default Modal;
