import { useEffect, useRef } from 'react';

declare const hljs: {
  highlightElement: (el: HTMLElement) => void;
};

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = 'typescript' }: CodeBlockProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current && typeof hljs !== 'undefined') {
      ref.current.removeAttribute('data-highlighted');
      ref.current.className = `language-${language}`;
      hljs.highlightElement(ref.current);
    }
  }, [code, language]);

  return (
    <pre style={{ margin: 0, borderRadius: '0.5rem', overflow: 'auto' }}>
      <code ref={ref} className={`language-${language}`}>
        {code}
      </code>
    </pre>
  );
}
