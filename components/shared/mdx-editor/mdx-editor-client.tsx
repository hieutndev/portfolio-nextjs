"use client";

import type { MDXEditorMethods } from "@mdxeditor/editor";

import dynamic from "next/dynamic";
import { useRef, useCallback, memo, useEffect } from "react";

import InitMDXEditor from "./mdx-init-html";

const Editor = dynamic(() => import("@/components/shared/mdx-editor/mdx-editor-initialized"), {
  ssr: false,
  loading: () => <InitMDXEditor />
});

interface MDXEditorClientProps {
  initialMarkdown: string;
  onChange: (md: string) => void;
  onReady?: () => void;
  uploadImage?: (file: File) => Promise<string>;
  className?: string;
  placeholder?: string;
}

/**
 * Isolated MDXEditor client component that prevents re-renders from parent
 * This component is memoized and only re-renders when its props actually change
 */
function MDXEditorClientComponent({ 
  initialMarkdown, 
  onChange, 
  onReady, 
  uploadImage,
  className = "min-h-[400px] w-full",
  placeholder = "Write your content here using Markdown..."
}: MDXEditorClientProps) {
  const editorRef = useRef<MDXEditorMethods>(null);

  // Stable onChange handler - wrapped in useCallback to maintain reference
  const handleChange = useCallback((content: string, initialMarkdownNormalize: boolean) => {
    onChange(content);
  }, [onChange]);

  // Call onReady when component mounts
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <Editor
      className={className}
      editorRef={editorRef}
      imageUploadHandler={uploadImage}
      markdown={initialMarkdown}
      placeholder={placeholder}
      onChange={handleChange}
    />
  );
}

/**
 * Memoized version with custom comparison to prevent unnecessary re-renders
 * Only re-render if initialMarkdown actually changes (not just reference)
 */
export default memo(MDXEditorClientComponent, (prevProps, nextProps) => {
  // Only re-render if initialMarkdown content actually changed
  // Don't compare onChange/onReady/uploadImage as they should be stable via useCallback
  return prevProps.initialMarkdown === nextProps.initialMarkdown &&
         prevProps.className === nextProps.className &&
         prevProps.placeholder === nextProps.placeholder;
});

