"use client";

import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function Modal() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="bg-opacity-60 absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black">
      <button
        onClick={handleClose}
        className="absolute top-5 right-5 text-neutral-200"
      >
        <XMarkIcon className="size-10" />
      </button>
      <div className="flex h-1/2 w-full max-w-screen-sm justify-center">
        <div className="flex aspect-square items-center justify-center rounded-md bg-neutral-700 text-neutral-200">
          <PhotoIcon className="h-28" />
        </div>
      </div>
    </div>
  );
}
