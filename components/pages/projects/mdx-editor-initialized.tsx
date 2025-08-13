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

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
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
            imageUploadHandler: async () => {
              // Return a placeholder for now - you can implement actual image upload later
              return Promise.resolve('/api/placeholder-image.jpg')
            }
          }),

          // Table functionality
          tablePlugin(),

          // Code block functionality
          codeBlockPlugin({ defaultCodeBlockLanguage: 'javascript' }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: 'JavaScript',
              css: 'CSS',
              txt: 'Plain Text',
              tsx: 'TypeScript JSX',
              ts: 'TypeScript',
              html: 'HTML',
              json: 'JSON',
              python: 'Python',
              bash: 'Bash',
              sql: 'SQL',
              markdown: 'Markdown',
              yaml: 'YAML'
            }
          }),

          // Source mode toggle
          diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' }),

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
        contentEditableClassName="prose max-w-none mdxeditor-content"
        className="mdxeditor-rich-text-editor"
      />
    </div>
  )
}
