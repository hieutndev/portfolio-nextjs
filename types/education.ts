export type TEducation = {
  id: number;
  title: string;
  organization: string;
  time_start: string;
  time_end: string;
  created_at: string;
  updated_at: string;
  is_deleted: number;
};

export type TNewEducation = Pick<TEducation, "title" | "organization" | "time_start"> & {
  time_end: string | null;
};

export type TUpdateEducation = TNewEducation;
