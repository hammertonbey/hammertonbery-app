import { GoldKaratPicker } from "@/components/GoldKaratPicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useState } from "react";

interface ContactFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  imageFileType?: string;
  imageBase64?: string;
  jewelryType: string;
}

export function ContactFormPopup({
  isOpen,
  onClose,
  imageUrl,
  imageFileType,
  imageBase64,
  jewelryType,
}: ContactFormPopupProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [goldKarat, setGoldKarat] = useState("18K");
  const [size, setSize] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit-design", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phoneNumber,
          notes,
          goldKarat,
          jewelryType,
          size,
          imageUrl,
          imageFileType,
          imageBase64,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit design request");
      }

      toast({
        title: "Success",
        description: "Your design request has been submitted successfully!",
      });
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to submit design request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSizeSelector = () => {
    if (jewelryType === "ring" || jewelryType === "bracelet") {
      return (
        <div className="mb-4">
          <Label htmlFor="size" className="text-[#14213D]">
            {jewelryType === "ring" ? "Ring Size" : "Bracelet Size"}
          </Label>
          <Input
            id="size"
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder={
              jewelryType === "ring" ? "e.g., 7, 8.5" : 'e.g., 6.5", 7"'
            }
            className="border-[#14213D]"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#F5F5F0] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#14213D]">
            Request a Quote
          </DialogTitle>
          <DialogDescription>
            Fill out the form below to submit your design request.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-4 px-1">
            <div className="mb-6">
              <Label className="text-[#14213D] block mb-2">Your Design</Label>
              <div className="flex justify-center items-center bg-white p-2 rounded-lg border border-[#14213D] h-64">
                <Image
                  src={imageUrl ?? ""}
                  alt="Your design"
                  width={250}
                  height={250}
                  className="rounded-lg object-contain"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="name" className="text-[#14213D]">
                Contact Name
              </Label>
              <Input
                id="name"
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-[#14213D]"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-[#14213D]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#14213D]"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-[#14213D]">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="border-[#14213D]"
              />
            </div>
            <GoldKaratPicker value={goldKarat} onChange={setGoldKarat} />
            {renderSizeSelector()}
            <div>
              <Label htmlFor="notes" className="text-[#14213D]">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific requirements or questions?"
                className="border-[#14213D] h-32"
              />
            </div>
            <Button
              type="submit"
              className="bg-[#14213D] hover:bg-[#FCA311] text-white transition-colors w-full mb-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
