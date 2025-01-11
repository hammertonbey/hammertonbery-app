import React from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface GoldKaratPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function GoldKaratPicker({ value, onChange }: GoldKaratPickerProps) {
  return (
    <div>
      <Label htmlFor="gold-karat" className="text-[#14213D] block mb-2">Gold Karat</Label>
      <RadioGroup id="gold-karat" value={value} onValueChange={onChange} className="flex flex-wrap gap-4">
        {['10K', '14K', '18K', '22K', '24K'].map((karat) => (
          <div key={karat} className="flex items-center space-x-2">
            <RadioGroupItem value={karat} id={`karat-${karat}`} />
            <Label htmlFor={`karat-${karat}`}>{karat}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

