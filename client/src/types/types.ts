export type User = {
  email: string;
  id: string;
};
export interface DialogHandle {
  openModal: () => void;
  closeModal: () => void;
}
