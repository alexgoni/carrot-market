"use client";

import { useFormStatus } from "react-dom";

interface Props {
  text: string;
}

export default function FormButton({ text }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="primary-btn h-10 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-neutral-300"
    >
      {pending ? "로딩 중" : text}
    </button>
  );
}
