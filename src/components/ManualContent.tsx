import React from 'react';

interface ManualContentProps {
  content: string;
  className?: string;
}

export default function ManualContent({ content, className = '' }: ManualContentProps) {
  return (
    <div
      className={`manual-content prose prose-slate max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
      style={{
        '--tw-prose-body': '#374151',
        '--tw-prose-headings': '#111827',
        '--tw-prose-links': '#2563eb',
        '--tw-prose-bold': '#111827',
        '--tw-prose-counters': '#6b7280',
        '--tw-prose-bullets': '#6b7280',
        '--tw-prose-quotes': '#111827',
        '--tw-prose-code': '#111827',
        '--tw-prose-pre-code': '#e5e7eb',
        '--tw-prose-pre-bg': '#1f2937',
      } as React.CSSProperties}
    />
  );
}
