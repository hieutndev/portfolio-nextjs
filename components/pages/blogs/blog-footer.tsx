"use client";

import { Chip } from "@heroui/react";

import { TBlogResponse } from "@/types/blog";
import Container from "@/components/shared/container/container";

interface BlogFooterProps {
    blog: TBlogResponse;
}

export default function BlogFooter({ blog }: BlogFooterProps) {
    const shareBlog = () => {
        if (navigator.share) {
            navigator.share({
                title: blog.title,
                text: blog.excerpt,
                url: window.location.href,
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert("Blog URL copied to clipboard!");
        }
    };

    return (
        <Container className="!p-4 mb-16 justify-between" gapSize={4} orientation="horizontal">
            {/* Categories and Tags Section */}
            <div className="flex md:flex-row flex-col gap-8">
                {/* Tags */}
                {blog.tags && blog.tags.length > 0 &&
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold">Tags</h3>
                        <div className="flex flex-wrap gap-1">
                            {blog.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                >
                                    #{tag}
                                </Chip>
                            ))}
                        </div>
                    </div>
                }
            </div>
        </Container>
    );
}
