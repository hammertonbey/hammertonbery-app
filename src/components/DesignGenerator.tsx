import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export function DesignGenerator() {
  const [jewelryType, setJewelryType] = useState("necklace")
  const [style, setStyle] = useState("modern")
  const [prompt, setPrompt] = useState("")

  const handleGenerate = () => {
    // Here you would integrate with your AI design generation service
    console.log("Generating design with:", { jewelryType, style, prompt })
    // For now, we'll just close the dialog
    // In a real implementation, you'd show the generated design
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#8b6b61] hover:bg-[#5d4037] text-[#f8f5f0] transition-colors">Generate Design</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#f8f5f0]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#2c3e50]">Generate Your Design</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="jewelry-type" className="text-[#5d4037]">Jewelry Type</Label>
            <RadioGroup id="jewelry-type" value={jewelryType} onValueChange={setJewelryType} className="flex space-x-4">
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
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="style" className="text-[#5d4037]">Style</Label>
            <RadioGroup id="style" value={style} onValueChange={setStyle} className="flex space-x-4">
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
          <div className="grid gap-2">
            <Label htmlFor="prompt" className="text-[#5d4037]">Design Prompt</Label>
            <Textarea 
              id="prompt" 
              placeholder="Describe your ideal piece of jewelry..." 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="border-[#d4c8b8] text-[#2c3e50]"
            />
          </div>
        </div>
        <Button onClick={handleGenerate} className="bg-[#8b6b61] hover:bg-[#5d4037] text-[#f8f5f0] transition-colors w-full">
          Generate Design
        </Button>
      </DialogContent>
    </Dialog>
  )
}

