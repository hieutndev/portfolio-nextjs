import { MDXRemote } from "next-mdx-remote/rsc";
import { TProject } from "@/types/project";

import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Container from "@/components/shared/container/container";
import { formatDate } from "@/utils/date";

interface ProjectBlogContentProps {
  project: TProject;
}

export default function ProjectBlogContent({
  project,
}: ProjectBlogContentProps) {
  // Use the article_body from the project data
  const mdxContent = project.article_body || "No content available.";

  return (
    <Container className="!p-4 " orientation="vertical" gapSize={8}>
      {/* <Container className={"prose h-max"}>
      </Container> */}
      <article className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-red-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
        <h2>Project Durations:</h2>
        {(project.start_date || project.end_date) && (
          <p>
            {project.start_date && <span>From <span className="font-bold text-primary">{formatDate(project.start_date, "onlyDate")}</span> </span>}
            {project.end_date && (
              <span>to <span className="font-bold text-primary">{formatDate(project.end_date, "onlyDate")}</span>.</span>
            )}
          </p>
        )}
        <MDXRemote
          source={mdxContent}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight],
            },
          }}
        />
      </article>
    </Container>
  );
}
