
import React, { useState, useEffect } from "react"
import { Instagram } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"
import { getSettings } from "@/lib/settings"

export function Footer() {
  const { theme } = useTheme()
  const [instagramUsername, setInstagramUsername] = useState("ramalhostoreof")
  const [logos, setLogos] = useState({
    light: "https://storage.googleapis.com/hostinger-horizons-assets-prod/191d9fe7-4e97-4407-97ba-91113abbc963/7cd262480343c632df850d68746b348c.png",
    dark: "https://storage.googleapis.com/hostinger-horizons-assets-prod/191d9fe7-4e97-4407-97ba-91113abbc963/f79693977158bd8da64541625328ae22.png"
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const settings = await getSettings()
      if (settings) {
        setInstagramUsername(settings.instagram_username || "ramalhostoreof")
        setLogos({
          light: settings.logo_light || logos.light,
          dark: settings.logo_dark || logos.dark
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6 mt-12">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* <div className="flex items-center">
            <img 
              src={theme === "dark" ? logos.dark : logos.light}
              alt="Logo" 
              style={{ height: "48px", width: "auto" }}
            />
          </div> */}
          <a
            href={`https://www.instagram.com/${instagramUsername}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Instagram className="h-5 w-5" />
            <span>@{instagramUsername}</span>
          </a>
          <p className="text-sm text-muted-foreground text-center">
            Sua loja especializada em produtos Apple
          </p>
        </div>
      </div>
    </footer>
  )
}
