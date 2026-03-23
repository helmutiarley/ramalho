
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Type } from 'lucide-react'
import { getSettings, updatePageTitle } from "@/lib/settings"

export function PageTitleSettings() {
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const settings = await getSettings()
      if (settings?.page_title) {
        setTitle(settings.page_title)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updatePageTitle(title)
      document.title = title // Atualiza o título imediatamente
      toast({
        title: "Sucesso",
        description: "Título da página atualizado",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
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
        <h2 className="text-lg font-semibold">Título da Página</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Título exibido na aba do navegador
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="ui-input"
            placeholder="Digite o título da página"
            required
          />
          <p className="text-sm text-muted-foreground">
            Este título será exibido na aba do navegador e nos resultados de busca
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Type className="w-4 h-4" />
          {isSaving ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </div>
  )
}
