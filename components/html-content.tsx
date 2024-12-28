interface HTMLContentProps {
    content: string;
  }
  
  export function HTMLContent({ content }: HTMLContentProps) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  
  