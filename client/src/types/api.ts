export type ApiErrorResponse = {
  success: boolean;
  message: string;
  stack?: string;
};
export type Profile = {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  profession?: string;
  about?: string;
  location?: string;
};
