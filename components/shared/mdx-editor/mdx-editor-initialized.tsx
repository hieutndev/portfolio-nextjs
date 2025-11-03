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
import { useState, useEffect } from 'react'
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
  const [editorMarkdown, setEditorMarkdown] = useState(markdown)
  const [originalMarkdown, setOriginalMarkdown] = useState(markdown)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (markdown !== editorMarkdown) {
      const sanitized = sanitizeMarkdown(markdown)

      setEditorMarkdown(sanitized)
      // Set original markdown on initial load
      if (!isInitialized) {
        setOriginalMarkdown(sanitized)
        setIsInitialized(true)
      }
    }
  }, [markdown, isInitialized])

  const handleChange = (newContent: string) => {
    setEditorMarkdown(newContent)
    if (onChange) {
      // Call the parent onChange handler if provided
      (onChange as any)(newContent)
    }
  }

  const handleError = (error: any) => {
    console.error('MDX Editor Error:', error)
    // Try to recover by switching to source mode or providing a fallback
    if (error.message?.includes('code') || error.message?.includes('parsing')) {
      console.warn('Code block parsing error detected, attempting recovery...')
      // You could implement automatic recovery here
    }
  }

  return (
    <div className="mdxeditor">
      <MDXEditor
        plugins={[
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
        ]}
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
