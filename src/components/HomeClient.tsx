"use client";

import { ContactFormPopup } from "@/components/ContactFormPopup";
import { CookieConsent } from "@/components/CookieConsent";
import { PrivacyPolicyModal } from "@/components/PrivacyPolicyModal";
import { TermsOfServiceModal } from "@/components/TermsOfServiceModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import * as gtag from "@/lib/gtag";
import { smoothScroll } from "@/utils/smoothScroll";
import { Gem, Menu } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import HammertonLogo from "../../public/HammertonLogo.svg";

interface HomeClientProps {
  privacyPolicyContent: string;
}

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result?.toString() ?? "");
  reader.onerror = reject;
});

export function HomeClient({ privacyPolicyContent }: HomeClientProps) {
  const [jewelryType, setJewelryType] = useState("necklace");
  const [style, setStyle] = useState("modern");
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [designImageUrl, setDesignImageUrl] = useState<string | null>(null);
  const [promotionalText, setPromotionalText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDesignGenerated, setIsDesignGenerated] = useState(false);
  const [designSource, setDesignSource] = useState<
    "upload" | "generate" | null
  >(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const [imageFileType, setImageFileType] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  useEffect(() => {
    // Track page view
    gtag.pageview(window.location.pathname);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      setDesignImageUrl(URL.createObjectURL(file));
      setIsDesignGenerated(true);
      setDesignSource("upload");
      setPromotionalText("");
      setImageFileType(file.type);  
      setImageBase64(await toBase64(file));
      // Track upload event
      gtag.event({
        action: "upload_design",
        category: "Design",
        label: "User uploaded design",
        value: 1,
      });
    }
  };

  const handleSubmit = async (method: "upload" | "generate") => {
    if (method === "upload") {
      console.log("Uploading file:", file);
      setIsDesignGenerated(true);
      setDesignSource("upload");

      // Track upload submit event
      gtag.event({
        action: "submit_upload",
        category: "Design",
        label: "User submitted uploaded design",
        value: 1,
      });
    } else {
      console.log("Starting design generation process");
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/generate-design", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jewelryType, style, prompt }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to generate design");
        }

        const { designDescription, imageUrl, promotionalText } = data;

        console.log("Design description generated:", designDescription);
        console.log("Image generated:", imageUrl);
        console.log("Promotional text generated:", promotionalText);

        setDesignImageUrl(imageUrl);
        setPromotionalText(promotionalText);
        setIsDesignGenerated(true);
        setDesignSource("generate");
        console.log("Design generation process completed successfully");

        // Track successful generation event
        gtag.event({
          action: "generate_design",
          category: "Design",
          label: "AI generated design",
          value: 1,
        });
      } catch (error) {
        console.error("Error in handleSubmit:", error);
        if (error instanceof Error) {
          console.error("Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
          setError(`An error occurred: ${error.message}`);
        } else {
          console.error("Unknown error:", error);
          setError("An unexpected error occurred");
        }

        // Track error event
        gtag.event({
          action: "generate_design_error",
          category: "Error",
          label: "Error generating design",
          value: 1,
        });
      } finally {
        setIsLoading(false);
        console.log("Design generation process finished");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-serif">
      <header className="bg-[#F5F5F0] border-b border-[#14213D] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src={HammertonLogo}
              alt="Hammerton & Bey"
              width={240}
              height={53}
              className="h-14 w-auto"
            />
          </div>
          <nav className="hidden sm:block">
            <ul className="flex space-x-6 text-lg">
              <li>
                <a
                  href="#how-it-works"
                  className="text-[#14213D] hover:text-[#FCA311] transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-[#14213D] hover:text-[#FCA311] transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={smoothScroll}
                  className="text-[#14213D] hover:text-[#FCA311] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-0 sm:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <a
                  href="#how-it-works"
                  className="text-[#14213D] hover:text-[#FCA311] transition-colors block py-2 text-lg"
                >
                  How It Works
                </a>
                <a
                  href="#about"
                  className="text-[#14213D] hover:text-[#FCA311] transition-colors block py-2 text-lg"
                >
                  About
                </a>
                <a
                  href="#contact"
                  onClick={smoothScroll}
                  className="text-[#14213D] hover:text-[#FCA311] transition-colors block py-2 text-lg"
                >
                  Contact
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-16">
        <section className="flex flex-col items-center text-center mb-8 sm:mb-16">
          <p className="text-sm uppercase tracking-widest text-[#FCA311] mb-2">
            Bespoke Jewelry Since 1969
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#14213D] mb-4 leading-tight">
            Timeless Elegance, Crafted for You
          </h1>
          <p className="text-lg sm:text-xl text-[#14213D] mb-8 max-w-2xl leading-relaxed">
            From the heart of Istanbul&apos;s Grand Bazaar to your personal
            collection. Upload your vision or let our AI inspire you. Our master
            artisans will bring your dream to life.
          </p>
        </section>

        <section className="mb-8 sm:mb-16">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8 border border-[#14213D]">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#14213D] mb-6 text-center leading-tight">
              Design Your Masterpiece
            </h2>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Tabs defaultValue="generate" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="generate">Generate Design</TabsTrigger>
                    <TabsTrigger value="upload">Upload Design</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload">
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label
                          htmlFor="upload-jewelry-type"
                          className="text-[#14213D] block mb-2"
                        >
                          Jewelry Type
                        </Label>
                        <RadioGroup
                          id="upload-jewelry-type"
                          value={jewelryType}
                          onValueChange={setJewelryType}
                          className="flex flex-wrap gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="necklace"
                              id="upload-necklace"
                            />
                            <Label htmlFor="upload-necklace">Necklace</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ring" id="upload-ring" />
                            <Label htmlFor="upload-ring">Ring</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="earrings"
                              id="upload-earrings"
                            />
                            <Label htmlFor="upload-earrings">Earrings</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="bracelet"
                              id="upload-bracelet"
                            />
                            <Label htmlFor="upload-bracelet">Bracelet</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div>
                        <Label
                          htmlFor="file-upload"
                          className="text-[#14213D] block mb-2"
                        >
                          Upload Your Design
                        </Label>
                        <Input
                          id="file-upload"
                          type="file"
                          onChange={handleUpload}
                          accept="image/*"
                          className="border-[#14213D]"
                        />
                      </div>
                      <Button
                        onClick={() => handleSubmit("upload")}
                        className="bg-[#14213D] hover:bg-[#FCA311] text-white transition-colors w-full py-4 sm:py-6 text-lg"
                      >
                        Upload Your Design
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="generate">
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label
                          htmlFor="jewelry-type"
                          className="text-[#14213D] block mb-2"
                        >
                          Jewelry Type
                        </Label>
                        <RadioGroup
                          id="jewelry-type"
                          value={jewelryType}
                          onValueChange={setJewelryType}
                          className="flex flex-wrap gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="necklace" id="necklace" />
                            <Label htmlFor="necklace">Necklace</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ring" id="ring" />
                            <Label htmlFor="ring">Ring</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="earrings" id="earrings" />
                            <Label htmlFor="earrings">Earrings</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="bracelet" id="bracelet" />
                            <Label htmlFor="bracelet">Bracelet</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div>
                        <Label
                          htmlFor="style"
                          className="text-[#14213D] block mb-2"
                        >
                          Style
                        </Label>
                        <RadioGroup
                          id="style"
                          value={style}
                          onValueChange={setStyle}
                          className="flex flex-wrap gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="modern" id="modern" />
                            <Label htmlFor="modern">Modern</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="classic" id="classic" />
                            <Label htmlFor="classic">Classic</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="vintage" id="vintage" />
                            <Label htmlFor="vintage">Vintage</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div>
                        <Label
                          htmlFor="prompt"
                          className="text-[#14213D] block mb-2"
                        >
                          Design Inspiration
                        </Label>
                        <Textarea
                          id="prompt"
                          placeholder="Describe your ideal piece of jewelry..."
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="border-[#14213D] h-32"
                        />
                      </div>
                      <Button
                        onClick={() => handleSubmit("generate")}
                        className="bg-[#14213D] hover:bg-[#FCA311] text-white transition-colors w-full py-4 sm:py-6 text-lg"
                        disabled={isLoading}
                      >
                        {isLoading
                          ? "Generating..."
                          : "Generate Your Unique Design"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="flex flex-col items-center justify-center mt-8 md:mt-0">
                {designImageUrl ? (
                  <div>
                    <h3 className="text-xl font-bold text-[#14213D] mb-2">
                      {designSource === "upload"
                        ? "Your Design"
                        : "Your Generated Design"}
                    </h3>
                    <Image
                      src={designImageUrl}
                      alt={
                        designSource === "upload"
                          ? "Uploaded design"
                          : "Generated design"
                      }
                      width={300}
                      height={300}
                      className="rounded-lg border border-[#14213D] w-full max-w-[300px] h-auto"
                    />
                    {promotionalText && (
                      <p className="mt-4 text-[#14213D] text-sm italic">
                        {promotionalText}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-[#14213D] text-lg mb-4">
                      Your design will appear here
                    </p>
                    <div className="rounded-lg border border-[#14213D] w-full max-w-[300px] h-[300px] flex items-center justify-center bg-white">
                      <Gem className="w-24 h-24 text-[#FCA311]" />
                    </div>
                  </div>
                )}
                {isDesignGenerated && (
                  <>
                    <Button
                      onClick={() => setIsPopupOpen(true)}
                      className="bg-[#FCA311] hover:bg-[#14213D] text-white transition-colors w-full mt-4 py-4 sm:py-6 text-lg"
                    >
                      Submit Design for Quote
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mb-8 sm:mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#14213D] mb-8 leading-tight">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Design",
                description:
                  "Upload your inspiration or use our AI-powered design tool to create your perfect piece.",
              },
              {
                title: "Refine",
                description:
                  "Our master jewelers will review your design and provide expert recommendations.",
              },
              {
                title: "Create",
                description:
                  "Watch as your vision comes to life, crafted with unparalleled attention to detail.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 border border-[#14213D]"
              >
                <div className="text-3xl font-bold text-[#FCA311] mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-[#14213D] mb-2">
                  {step.title}
                </h3>
                <p className="text-[#14213D]">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="mb-8 sm:mb-16">
          <div className="bg-[#14213D] text-white rounded-lg p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center leading-tight">
              Our Heritage
            </h2>
            <p className="mb-6 text-center leading-relaxed">
              Hammerton & Bey proudly partners with Merim Pırlanta, a
              third-generation bespoke jewelry maker located in the historic
              Zincirli Han of Istanbul&apos;s Grand Bazaar. With roots
              stretching back over half a century, our craftsmen know every
              corner and stepping stone of this ancient marketplace.
            </p>
            <p className="mb-6 text-center leading-relaxed">
              Our seasoned artisans handle every aspect of the supply chain,
              from sourcing the finest materials to crafting exquisite pieces.
              Their deep knowledge and unparalleled skill ensure that each
              creation is a masterpiece of quality and beauty.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-[#14213D] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            
            <div>
            <Image
                src={HammertonLogo}
                alt="Hammerton & Bey"
                width={280}
                height={62}
                className="h-16 w-auto brightness-0 invert"
              />
              <p className="text-sm">Crafting timeless elegance since 1969</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-sm mb-2">Email: info@hammertonbey.com</p>
              <p className="text-sm mb-2">Phone: +1 331 296-3620</p>
              <p className="text-sm">
                Address: Acı çeşme Sokak, Zincirli han no:13, Grand Bazaar,
                Istanbul, Turkey
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#how-it-works"
                    className="text-sm hover:text-[#FCA311] transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-sm hover:text-[#FCA311] transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="text-sm hover:text-[#FCA311] transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsTermsModalOpen(true)}
                    className="text-sm hover:text-[#FCA311] transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-white hover:text-[#FCA311] transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-[#FCA311] transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-[#FCA311] transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-sm text-center">
            © 2023 Hammerton & Bey. All rights reserved.
          </div>
        </div>
      </footer>

      <ContactFormPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        imageUrl={designImageUrl ?? undefined}
        imageFileType={imageFileType ?? undefined}
        imageBase64={imageBase64 ?? undefined}
        jewelryType={jewelryType}
      />
      <TermsOfServiceModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        initialContent={privacyPolicyContent}
      />
      <CookieConsent />
    </div>
  );
}
