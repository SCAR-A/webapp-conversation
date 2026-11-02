'use client'
import type { Components } from 'react-markdown'
import { Streamdown } from 'streamdown'
import 'katex/dist/katex.min.css'

interface StreamdownMarkdownProps {
  content: string
  className?: string
}

// 避免 markdown 把图片包进 <p>，再在图片外层包 <div> 导致 hydration 报错：
// <div> cannot be a descendant of <p>
const components: Components = {
  p: ({ children }) => <div className="mb-2 last:mb-0 leading-[1.6]">{children}</div>,
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ''}
      className="my-2 max-w-full h-auto rounded-lg inline-block align-middle"
      loading="lazy"
    />
  ),
}

export function StreamdownMarkdown({ content, className = '' }: StreamdownMarkdownProps) {
  return (
    <div className={`streamdown-markdown ${className}`}>
      <Streamdown components={components}>{content}</Streamdown>
    </div>
  )
}

export default StreamdownMarkdown
