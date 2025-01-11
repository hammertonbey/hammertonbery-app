import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent: string;
}

export function PrivacyPolicyModal({
  isOpen,
  onClose,
  initialContent,
}: PrivacyPolicyModalProps) {
  const policyContent = initialContent;

  const renderContent = () => {
    try {
      return (
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            p: (props) => <p className="mb-4" {...props} />,
            h1: (props) => (
              <h1 className="text-2xl font-bold mb-4" {...props} />
            ),
            h2: (props) => (
              <h2 className="text-xl font-semibold mb-3" {...props} />
            ),
            ul: (props) => <ul className="list-disc pl-5 mb-4" {...props} />,
            ol: (props) => <ol className="list-decimal pl-5 mb-4" {...props} />,
            li: (props) => <li className="mb-1" {...props} />,
            a: (props) => (
              <a className="text-blue-600 hover:underline" {...props} />
            ),
          }}
        >
          {policyContent}
        </ReactMarkdown>
      );
    } catch (renderError) {
      console.error("Error rendering markdown:", renderError);
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
          <DialogTitle className="text-2xl font-bold text-[#14213D]">
            Privacy Policy
          </DialogTitle>
          <DialogDescription>
            Please read our Privacy Policy carefully.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[60vh] border border-[#14213D] rounded p-4">
          {renderContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
