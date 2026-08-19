export type Banner = "none" | "success" | "warning" | "negative";

export type SignUpFormErrors = {
  first_name?: string[];
  last_name?: string[];
  email?: string[];
  password?: string[];
};
