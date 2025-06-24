export type TApp = {
  app_id: string | number;
  app_name: string;
  app_link: string;
  app_icon: string;
  app_icon_name: string;
  created_at: string;
  updated_at: string;
  is_hide: number;
};

export type TNewApp = Pick<TApp, "app_name" | "app_link"> & {
  app_icon: FileList | null;
};

export type TUpdateApp = TNewApp;
