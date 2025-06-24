export type TProject = {
  id: string | number;
  project_fullname: string;
  project_shortname: string;
  start_date: string;
  end_date: string;
  short_description: string;
  project_thumbnail: string;
  article_body: string;
  created_at: string;
  updated_at: string;
  is_deleted: number;
  github_link: string;
  demo_link: string;
};

export type TProjectResponse = TProject &
  Pick<TProjectGroup, "group_title"> & {
    group_id: string | number | null;
    project_images: TProjectImage[];
  };

export type TProjectGroup = {
  group_id: string | number;
  group_title: string;
  created_at: string;
  updated_at: string;
  is_deleted: number;
};

export type TProjectImage = {
  image_id: string;
  project_id: string;
  image_name: string;
  image_url: string;
};

export type TNewProject = Pick<
  TProjectResponse,
  | "project_fullname"
  | "project_shortname"
  | "start_date"
  | "end_date"
  | "short_description"
  | "article_body"
  | "group_id"
  | "github_link"
  | "demo_link"
> & {
  project_thumbnail: FileList | null;
  project_images: FileList | null;
};

export type TUpdateProject = TNewProject;

export type TNewGroup = Pick<TProjectGroup, "group_title">;
