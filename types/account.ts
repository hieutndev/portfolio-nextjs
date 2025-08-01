export type TAccount = {
  user_id: number;
  email: string;
  role: number;
  username: string;
  created_at: string;
  updated_at: string;
  is_active: number;
};

export type TNewAccount = {
  email: string;
  username: string;
  password: string;
  role: number;
};

export type TUpdateAccount = {
  email?: string;
  username?: string;
  role?: number;
  is_active?: number;
};
