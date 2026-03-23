
import React, { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getSpecTypes, addSpecType, deleteSpecType } from "@/lib/specTypes"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function SpecTypesManager() {
  const [specTypes, setSpecTypes] = useState([])
  const [newSpecType, setNewSpecType] = useState("")
  const [typeToDelete, setTypeToDelete] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadSpecTypes()
  }, [])

  const loadSpecTypes = async () => {
    try {
      const data = await getSpecTypes()
      setSpecTypes(data)
    } catch (error) {
      console.error('Error loading spec types:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar tipos de especificações",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSpecType = async (e) => {
    e.preventDefault()
    if (!newSpecType.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome do tipo de especificação",
        variant: "destructive",
      })
      return
    }

    try {
      await addSpecType(newSpecType)
      await loadSpecTypes()
      setNewSpecType("")
      toast({
        title: "Sucesso! 🎉",
        description: "Tipo de especificação adicionado",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = (type) => {
    setTypeToDelete(type)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!typeToDelete) return

    try {
      await deleteSpecType(typeToDelete.id)
      await loadSpecTypes()
      toast({
        title: "Sucesso! 🗑️",
        description: "Tipo de especificação removido",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    }
    setShowDeleteDialog(false)
    setTypeToDelete(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddSpecType} className="flex gap-4">
        <input
          type="text"
          value={newSpecType}
          onChange={(e) => setNewSpecType(e.target.value)}
          placeholder="Novo tipo de especificação"
          className="ui-input flex-1 rounded-xl"
        />
        <Button 
          type="submit" 
          className="rounded-xl px-6 bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specTypes.map((type) => (
          <div
            key={type.id}
            className="ui-card-soft flex items-center justify-between rounded-xl p-4 hover:bg-background/60"
          >
            <span className="font-medium">{type.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteClick(type)}
              className="hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o tipo de especificação "{typeToDelete?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="rounded-xl bg-gradient-to-r from-destructive/90 to-destructive hover:from-destructive hover:to-destructive/90"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
