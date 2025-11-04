import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import { TBlogResponse } from "@/types/blog";
import Container from "@/components/shared/container/container";

interface BlogContentProps {
    blog: TBlogResponse;
}

export default async function BlogContent({ blog }: BlogContentProps) {
    const mdxContent = blog.content || "No content available.";

    return (
        <Container className="!p-4" gapSize={8} orientation="vertical">
            <article className="mdx-display prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-red-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                <MDXRemote
                    options={{
                        mdxOptions: {
                            remarkPlugins: [remarkGfm],
                            rehypePlugins: [rehypeHighlight],
                        },
                    }}
                    source={mdxContent}
                />
            </article>
        </Container>
    );
}
