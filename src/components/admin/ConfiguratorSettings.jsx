
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Monitor } from 'lucide-react'
import { getCategories, updateCategoryConfiguratorStatus } from "@/lib/categories"

export function ConfiguratorSettings() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleCategory = async (categoryId, currentStatus) => {
    setIsSaving(true)
    try {
      await updateCategoryConfiguratorStatus(categoryId, !currentStatus)
      await loadCategories()
      toast({
        title: "Sucesso",
        description: "Configurações atualizadas",
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
        <h2 className="text-lg font-semibold">Configurações do Montador de PC</h2>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Selecione as categorias que estarão disponíveis no montador de computador
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="ui-card-soft flex items-center justify-between rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">{category.name}</span>
              </div>
              <Button
                variant={category.show_in_configurator ? "default" : "outline"}
                onClick={() => handleToggleCategory(category.id, category.show_in_configurator)}
                disabled={isSaving}
                className="min-w-[100px]"
              >
                {category.show_in_configurator ? "Ativo" : "Inativo"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
