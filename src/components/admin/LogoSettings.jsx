
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ImageIcon, Upload, Trash2 } from "lucide-react"
import { getSettings, updateLogos } from "@/lib/settings"
import { uploadLogo, deleteLogo } from "@/lib/storage"

export function LogoSettings() {
  const [logos, setLogos] = useState({
    light: "",
    dark: ""
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState({
    light: false,
    dark: false
  })
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const settings = await getSettings()
      if (settings) {
        setLogos({
          light: settings.logo_light || "",
          dark: settings.logo_dark || ""
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (e, theme) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(prev => ({ ...prev, [theme]: true }))

    try {
      // Se já existe uma logo, deletar a antiga
      if (logos[theme]) {
        await deleteLogo(logos[theme])
      }

      const publicUrl = await uploadLogo(file)
      
      setLogos(prev => ({ ...prev, [theme]: publicUrl }))
      
      await updateLogos(
        theme === 'light' ? publicUrl : logos.light,
        theme === 'dark' ? publicUrl : logos.dark
      )

      toast({
        title: "Sucesso",
        description: "Logo atualizada com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsUploading(prev => ({ ...prev, [theme]: false }))
    }
  }

  const handleRemove = async (theme) => {
    if (!logos[theme]) return

    try {
      await deleteLogo(logos[theme])
      
      setLogos(prev => ({ ...prev, [theme]: "" }))
      
      await updateLogos(
        theme === 'light' ? "" : logos.light,
        theme === 'dark' ? "" : logos.dark
      )

      toast({
        title: "Sucesso",
        description: "Logo removida com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const LogoPreview = ({ url, alt, theme }) => {
    if (!url) {
      return (
        <div className="w-32 h-16 rounded-lg bg-muted/50 flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
        </div>
      )
    }

    return (
      <div className="relative group">
        <img
          src={url}
          alt={alt}
          className="w-32 h-16 object-contain rounded-lg bg-muted/50"
        />
        <button
          onClick={() => handleRemove(theme)}
          className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
        >
          <Trash2 className="w-5 h-5 text-destructive" />
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Configurações de Logo</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Logo (Tema Claro)
            </label>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <label className="relative flex items-center justify-center w-full h-24 border-2 border-dashed rounded-2xl hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {isUploading.light ? "Enviando..." : "Clique para fazer upload"}
                    </span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleUpload(e, 'light')}
                    disabled={isUploading.light}
                  />
                </label>
              </div>
              <LogoPreview url={logos.light} alt="Logo tema claro" theme="light" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Logo (Tema Escuro)
            </label>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <label className="relative flex items-center justify-center w-full h-24 border-2 border-dashed rounded-2xl hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {isUploading.dark ? "Enviando..." : "Clique para fazer upload"}
                    </span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleUpload(e, 'dark')}
                    disabled={isUploading.dark}
                  />
                </label>
              </div>
              <LogoPreview url={logos.dark} alt="Logo tema escuro" theme="dark" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
