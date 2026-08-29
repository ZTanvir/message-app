import { XMarkIcon } from "@heroicons/react/24/outline";
import { useImperativeHandle, useRef } from "react";
import type { Ref } from "react";
import type { DialogHandle } from "../types/types";

type ModalProps = {
  children: React.ReactElement;
  ref: Ref<DialogHandle>;
  title: string;
};

export default function Modal({ children, title, ref }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => dialogRef.current?.showModal(),
    closeModal: () => dialogRef.current?.close(),
  }));

  const handleCloseModal = () => {
    dialogRef.current?.close();
  };
  return (
    <dialog
      className="fixed inset-0 m-auto w-[80%] rounded-xl p-4 backdrop:bg-black/50 backdrop:backdrop-blur-sm md:w-[60%]"
      ref={dialogRef}
    >
      <header className="flex">
        <h2 className="flex-1 text-center text-2xl">{title}</h2>
        <XMarkIcon
          title="close"
          onClick={handleCloseModal}
          className="h-7 w-7 opacity-100 hover:cursor-pointer hover:opacity-60"
        />
      </header>
      <main>{children}</main>
    </dialog>
  );
}
