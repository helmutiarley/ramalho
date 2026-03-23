
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getSettings, updateSettings } from "@/lib/settings"
import { Instagram } from "lucide-react"

export function SettingsManager() {
  const [settings, setSettings] = useState({ instagram_profile: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await getSettings()
      setSettings(data)
    } catch (error) {
      console.error('Error loading settings:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateSettings(settings)
      toast({
        title: "Sucesso",
        description: "Configurações atualizadas com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar configurações",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    // Remove @ se o usuário digitar
    const cleanValue = value.startsWith('@') ? value.substring(1) : value
    setSettings(prev => ({
      ...prev,
      [name]: cleanValue
    }))
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
        <h2 className="text-lg font-semibold">Configurações</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Perfil do Instagram</label>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                @
              </span>
              <input
                type="text"
                name="instagram_profile"
                value={settings.instagram_profile}
                onChange={handleChange}
                className="ui-input pl-8 pr-4"
                placeholder="seu.perfil"
              />
            </div>
            <Button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Digite seu nome de usuário do Instagram sem o @
          </p>
        </div>
      </form>
    </div>
  )
}
