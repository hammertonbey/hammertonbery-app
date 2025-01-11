import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from 'react-markdown'

interface TermsOfServiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsOfServiceModal({ isOpen, onClose }: TermsOfServiceModalProps) {
  const [termsContent, setTermsContent] = useState('')

  useEffect(() => {
    fetch('/terms-of-use.md')
      .then(response => response.text())
      .then(text => setTermsContent(text))
      .catch(error => console.error('Error loading Terms of Service:', error))
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-[#F5F5F0]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#14213D]">Terms of Service</DialogTitle>
          <DialogDescription>
            Please read our Terms of Service carefully.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[60vh] border border-[#14213D] rounded p-4">
          <ReactMarkdown className="prose prose-sm max-w-none">
            {termsContent}
          </ReactMarkdown>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

