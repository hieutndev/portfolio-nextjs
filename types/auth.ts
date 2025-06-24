export type TSignUp = {
  email: string;
  password: string;
  confirm_password: string;
};

export type TSignIn = Omit<TSignUp, "confirm_password">;

export type TSignInResponse = {
  access_token: string;
  refresh_token: string;
  role: number;
};