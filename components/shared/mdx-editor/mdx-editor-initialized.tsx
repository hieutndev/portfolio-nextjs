'use client'

import type { ForwardedRef } from 'react'

import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  frontmatterPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  BlockTypeSelect,
  Separator,
  DiffSourceToggleWrapper,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'

import { sanitizeMarkdown } from '@/utils/mdx'

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  markdown = '',
  onChange,
  imageUploadHandler,
  ...props
}: {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  imageUploadHandler?: (file: File) => Promise<string>;
} & MDXEditorProps) {
  const [editorMarkdown, setEditorMarkdown] = useState(() => sanitizeMarkdown(markdown))
  const [originalMarkdown, setOriginalMarkdown] = useState(() => sanitizeMarkdown(markdown))
  const isInitializedRef = useRef(false)
  const onChangeRef = useRef(onChange)

  // Keep onChange ref up to date without triggering re-renders
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Only update editor markdown when markdown prop changes AND it's different from current state
  useEffect(() => {
    if (markdown && markdown !== editorMarkdown) {
      const sanitized = sanitizeMarkdown(markdown)

      setEditorMarkdown(sanitized)
      // Set original markdown on initial load only
      if (!isInitializedRef.current) {
        setOriginalMarkdown(sanitized)
        isInitializedRef.current = true
      }
    }
  }, [markdown, editorMarkdown])

  // Memoize the change handler with stable reference
  const handleChange = useCallback((newContent: string, initialMarkdownNormalize: boolean) => {
    setEditorMarkdown(newContent)
    onChangeRef.current?.(newContent, initialMarkdownNormalize)
  }, [])

  // Memoize the error handler
  const handleError = useCallback((error: any) => {
    console.error('MDX Editor Error:', error)
    // Try to recover by switching to source mode or providing a fallback
    if (error.message?.includes('code') || error.message?.includes('parsing')) {
      console.warn('Code block parsing error detected, attempting recovery...')
    }
  }, [])

  // Memoize plugins configuration to prevent recreation on every render
  const plugins = useMemo(() => [
    // Core plugins for basic markdown functionality
    headingsPlugin(),
    listsPlugin(),
    quotePlugin(),
    thematicBreakPlugin(),
    markdownShortcutPlugin(),

    // Link functionality
    linkPlugin(),
    linkDialogPlugin(),

    // Image functionality
    imagePlugin({
      imageUploadHandler: imageUploadHandler || (async () => {
        // Return a placeholder if no upload handler provided
        return Promise.resolve('/api/placeholder-image.jpg')
      })
    }),

    // Table functionality
    tablePlugin(),

    // Code block functionality
    codeBlockPlugin({
      defaultCodeBlockLanguage: 'txt',
      codeBlockEditorDescriptors: [
        {
          match: () => true,
          priority: 0,
          Editor: () => null
        }
      ]
    }),
    codeMirrorPlugin({
      codeBlockLanguages: {
        '': 'Plain Text',
        'txt': 'Plain Text',
        'text': 'Plain Text',
        'js': 'JavaScript',
        'javascript': 'JavaScript',
        'css': 'CSS',
        'tsx': 'TypeScript JSX',
        'ts': 'TypeScript',
        'typescript': 'TypeScript',
        'html': 'HTML',
        'json': 'JSON',
        'python': 'Python',
        'py': 'Python',
        'bash': 'Bash',
        'shell': 'Shell',
        'sh': 'Shell',
        'sql': 'SQL',
        'markdown': 'Markdown',
        'md': 'Markdown',
        'yaml': 'YAML',
        'yml': 'YAML',
        'xml': 'XML',
        'php': 'PHP',
        'java': 'Java',
        'c': 'C',
        'cpp': 'C++',
        'csharp': 'C#',
        'go': 'Go',
        'rust': 'Rust',
        'swift': 'Swift',
        'kotlin': 'Kotlin',
        'dart': 'Dart'
      }
    }),

    // Source mode toggle
    diffSourcePlugin({ viewMode: 'source', diffMarkdown: originalMarkdown, readOnlyDiff: true }),

    // Front matter support
    frontmatterPlugin(),

    // Toolbar with comprehensive options
    toolbarPlugin({
      toolbarContents: () => (
        <>
          <UndoRedo />
          <Separator />
          <BoldItalicUnderlineToggles />
          <CodeToggle />
          <Separator />
          <BlockTypeSelect />
          <Separator />
          <ListsToggle />
          <Separator />
          <CreateLink />
          <InsertImage />
          <Separator />
          <InsertTable />
          <InsertThematicBreak />
          <Separator />
          <DiffSourceToggleWrapper>
            <div style={{ padding: '8px', fontSize: '14px' }}>Source</div>
          </DiffSourceToggleWrapper>
        </>
      )
    })
  ], [imageUploadHandler, originalMarkdown])

  return (
    <div className="mdxeditor">
      <MDXEditor
        plugins={plugins}
        {...props}
        ref={editorRef}
        className="mdxeditor-rich-text-editor"
        contentEditableClassName="prose max-w-none mdxeditor-content"
        markdown={editorMarkdown}
        onChange={handleChange}
        onError={handleError}
      />
    </div>
  )
}
