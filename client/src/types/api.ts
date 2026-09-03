export type ApiErrorResponse = {
  success: boolean;
  message: string;
  stack?: string;
};
export type ApiEndPath = "uploadCover" | "uploadProfile";

export type Profile = {
  id: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profession?: string | null;
  about?: string | null;
  location?: string | null;
  coverImgUrl?: string | null;
  profileImgUrl?: string | null;
};
