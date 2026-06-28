'use client';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// Dynamically import MDEditor to disable SSR errors
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

export default function RichTextEditor({ value, onChange, placeholder }) {
  return (
    <div style={{ minHeight: '350px' }} data-color-mode="light">
      <MDEditor
        value={value}
        onChange={onChange}
        height={350}
        preview="live"
        textareaProps={{
          placeholder: placeholder || 'Write blog post content here...'
        }}
      />
    </div>
  );
}
