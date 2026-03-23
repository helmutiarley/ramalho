
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { MessageCircle } from 'lucide-react'
import { getSettings, updateWhatsAppSettings } from "@/lib/settings"

export function WhatsAppSettings() {
  const [settings, setSettings] = useState({
    number: "",
    messageHero: ""
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await getSettings()
      if (data) {
        setSettings({
          number: data.whatsapp_number || "",
          messageHero: data.whatsapp_message_hero || "Olá! Gostaria de saber mais sobre os produtos Apple."
        })
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
      await updateWhatsAppSettings(settings)
      toast({
        title: "Sucesso",
        description: "Configurações do WhatsApp atualizadas",
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value
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
        <h2 className="text-lg font-semibold">Configurações do WhatsApp</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Número do WhatsApp
          </label>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                name="number"
                value={settings.number}
                onChange={handleChange}
                className="ui-input"
                placeholder="5585999999999"
                required
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Digite o número com código do país e DDD, sem espaços ou caracteres especiais. Exemplo: 5585999999999
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Mensagem da Página Inicial
          </label>
          <textarea
            name="messageHero"
            value={settings.messageHero}
            onChange={handleChange}
            className="ui-input"
            placeholder="Digite a mensagem que será enviada quando o cliente clicar no botão do WhatsApp na página inicial"
            rows={4}
            required
          />
          <p className="text-sm text-muted-foreground">
            Esta mensagem será enviada quando o cliente clicar no botão do WhatsApp na página inicial
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          {isSaving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </form>
    </div>
  )
}
