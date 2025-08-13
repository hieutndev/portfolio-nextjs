"use client"

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";
import { TProject } from "@/types/project";

import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface ProjectBlogContentProps {
  project: TProject;
}

export default function ProjectBlogContent({ project }: ProjectBlogContentProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);

  useEffect(() => {
    const serializeMdx = async () => {
      // Use the article_body from the project data
      const mdxContent = project.article_body || "No content available.";

      const serialized = await serialize(mdxContent, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeHighlight],
        },
      });

      setMdxSource(serialized);
    };

    serializeMdx();
  }, [project.article_body]);

  if (!mdxSource) {
    return <div>Loading content...</div>;
  }

  return (
    <article className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-red-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
      <MDXRemote {...mdxSource} />
    </article>
  );
}
