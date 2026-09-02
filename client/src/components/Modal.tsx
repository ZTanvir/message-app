import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";
import type { DialogHandle } from "../types/types";

type ModalProps = {
  children: React.ReactElement;
  title: string;
  ref: Ref<DialogHandle>;
};

export default function Modal({ children, title, ref }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      openModal: () => {
        setIsOpenModal(true);
        dialogRef.current?.showModal();
      },
      closeModal: () => dialogRef.current?.close(),
    }),
    [],
  );

  const handleCloseModal = () => {
    dialogRef.current?.close();
  };

  useEffect(() => {
    const modalEl = dialogRef.current;
    if (!modalEl) return;
    const closeModal = () => setIsOpenModal(false);
    modalEl.addEventListener("close", closeModal);
    return () => modalEl.removeEventListener("close", closeModal);
  }, []);

  return (
    <dialog
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="fixed inset-0 m-auto w-[80%] rounded-xl p-4 backdrop:bg-black/50 backdrop:backdrop-blur-sm md:w-[60%]"
      ref={dialogRef}
    >
      <header className="flex">
        <h2 className="flex-1 text-center text-2xl">{title}</h2>
        <button type="button" onClick={handleCloseModal}>
          <XMarkIcon
            title="close"
            className="h-7 w-7 opacity-100 hover:cursor-pointer hover:opacity-60"
          />
        </button>
      </header>
      <main>{isOpenModal && children}</main>
    </dialog>
  );
}
