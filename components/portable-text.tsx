'use client'
nterface Block {
  _type: string
  style?: string
  children?: any[]
  markDefs?: any[]
  _key?: string
  marks?: string[]
  text?: string
  // Add other properties as needed
}

interface PortableTextProps {
  blocks: Block[]
}

export function PortableText({ blocks }: PortableTextProps) {
  if (!blocks) {
    return null
  }

  const renderBlock = (block: Block) => {
    switch (block._type) {
      case 'block':
        const style = block.style || 'normal'
        
        // Map block style to HTML element
        const Component = style === 'normal' ? 'p' : style

        return (
          <Component
            key={block._key}
            className={`mb-4 ${
              style === 'h1' ? 'text-2xl font-bold' :
              style === 'h2' ? 'text-xl font-bold' :
              style === 'h3' ? 'text-lg font-bold' :
              style === 'h4' ? 'text-base font-bold' :
              'text-base'
            }`}
          >
            {block.children?.map((child, i) => {
              const marks = child.marks || []
              let text = child.text

              // Apply marks (bold, italic, etc.)
              if (marks.includes('strong')) {
                text = <strong key={i}>{text}</strong>
              }
              if (marks.includes('em')) {
                text = <em key={i}>{text}</em>
              }
              if (marks.includes('underline')) {
                text = <u key={i}>{text}</u>
              }

              return text
            })}
          </Component>
        )
      // Add cases for other block types as needed
      default:
        return null
    }
  }

  return (
    <div className="prose dark:prose-invert max-w-none">
      {blocks.map((block) => renderBlock(block))}
    </div>
  )
}

