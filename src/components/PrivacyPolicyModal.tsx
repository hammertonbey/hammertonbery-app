import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

const cleanMarkdownContent = (content: string): string => {
  // Remove CSS variables and other non-markdown content
  return content
    .replace(/\.dark\s*{[\s\S]*?}/g, '') // Remove dark mode CSS
    .replace(/--[\w-]+:\s*[^;]+;/g, '') // Remove CSS variables
    .replace(/-[\w-]+=/g, '') // Remove attributes like -5I5SRfcSpFqonQg...
    .replace(/<\/?[^>]+(>|$)/g, '') // Remove any HTML tags
    .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
    .trim();
}

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent: string;
}

export function PrivacyPolicyModal({ isOpen, onClose, initialContent }: PrivacyPolicyModalProps) {
  const [policyContent, setPolicyContent] = useState(initialContent)
  const [error, setError] = useState<string | null>(null)


  const renderContent = () => {
    if (error) {
      return <p className="text-red-500">{error}</p>;
    }

    try {
      return (
        <ReactMarkdown 
          rehypePlugins={[rehypeRaw]}
          components={{
            p: ({ node, ...props }) => <p className="mb-4" {...props} />,
            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mb-3" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4" {...props} />,
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />
          }}
        >
          {policyContent}
        </ReactMarkdown>
      );
    } catch (renderError) {
      console.error('Error rendering markdown:', renderError);
      return (
        <div className="whitespace-pre-wrap font-mono text-sm">
          {policyContent}
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-[#F5F5F0]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#14213D]">Privacy Policy</DialogTitle>
          <DialogDescription>
            Please read our Privacy Policy carefully.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[60vh] border border-[#14213D] rounded p-4">
          {renderContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

