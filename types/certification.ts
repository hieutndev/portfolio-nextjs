export type TCertification = {
  id: string;
  title: string;
  issued_by: string;
  issued_date: string;
  img_name: string;
  created_at: string;
  updated_at: string;
  is_deleted: number;
  image_url: string;
};

export type TNewCertification = Pick<TCertification, "title" | "issued_by" | "issued_date"> & {
  cert_image: FileList | null;
};

export type TUpdateCertification = TNewCertification & {
  image_url: string;
};
