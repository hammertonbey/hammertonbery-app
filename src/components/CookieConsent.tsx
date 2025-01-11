'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (consent === null) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true')
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#14213D] p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <p className="text-[#F5F5F0] text-sm mb-4 sm:mb-0 max-w-[600px]">
          We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
        </p>
        <div className="flex space-x-4">
          <Button 
            onClick={handleAccept} 
            className="bg-[#FCA311] hover:bg-[#E5A82E] text-[#14213D] font-semibold transition-colors min-w-[100px]"
          >
            Accept
          </Button>
          <Button 
            onClick={handleDecline} 
            variant="outline" 
            className="bg-transparent border-2 border-[#F5F5F0] text-[#F5F5F0] hover:bg-[#F5F5F0] hover:text-[#14213D] transition-colors min-w-[100px]"
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  )
}

