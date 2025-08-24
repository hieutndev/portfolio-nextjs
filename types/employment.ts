export type TEmployment = {
  id: number;
  title: string;
  organization: string;
  time_start: string;
  time_end: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: number;
};

export type TNewEmployment = Pick<TEmployment, "title" | "organization" | "time_start" | "time_end">;
