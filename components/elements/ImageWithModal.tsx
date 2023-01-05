"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "@components/Modal";

type ImageWithModalProps = {
  src: string;
};

const ImageWithModal = ({ src }: ImageWithModalProps) => {
  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowImageModal(true)}>
        <div>
          <Image
            alt=""
            src={src}
            width={98}
            height={147}
            className="rounded-l"
          />
        </div>
      </button>
      {showImageModal && (
        <Modal onClose={() => setShowImageModal(false)}>
          <Image
            alt=""
            src={src}
            width={294}
            height={441}
            className="rounded-l"
          />
        </Modal>
      )}
    </div>
  );
};

export default ImageWithModal;
