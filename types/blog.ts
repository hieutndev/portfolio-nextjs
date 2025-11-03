export type TBlog = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown content
  featured_image: string;
  published_date: string;
  reading_time: number; // in minutes
  views: number;
  created_at: string;
  updated_at: string;
  is_deleted: number;
  published_status: 'draft' | 'published' | 'archived';
  category_id: number;
  tags: string[];
};

export type TBlogResponse = TBlog & TBlogCategory &{
  tags: string[];
  author?: {
    id: number;
    name: string;
    avatar?: string;
  };
};

export type TBlogCategory = {
  category_id: number;
  category_title: string;
  category_slug: string;
  created_at: string;
  updated_at: string;
  is_deleted: number;
};

export type TBlogImage = {
  image_id: number;
  blog_id: TBlog['id'];
  image_name: string;
  image_url: string;
};

export type TNewBlog = Pick<
  TBlogResponse,
  | "title"
  | "slug"
  | "excerpt"
  | "content"
  | "published_date"
  | "published_status"
> & {
  featured_image: FileList | null | undefined;
  category_id: number; // single category ID
  tags: string[];
};

export type TUpdateBlog = TNewBlog;

export type TNewCategory = Pick<TBlogCategory, "category_title" | "category_slug">;
