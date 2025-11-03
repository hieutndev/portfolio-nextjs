"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { addToast } from "@heroui/react";

import BlogFormMarkDownComponent from "@/components/pages/blogs/blog-form-markdown";
import ROUTE_PATH from "@/configs/route-path";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.blogId as string;

  useEffect(() => {
    // Validate blogId
    if (!blogId) {
      addToast({
        title: "Error",
        description: "Invalid blog ID",
        color: "danger",
      });
      router.push(ROUTE_PATH.ADMIN.BLOG.INDEX);

      return;
    }
  }, [router, blogId]);

  return (
        <BlogFormMarkDownComponent blogId={blogId} mode="edit" />
  );
}
