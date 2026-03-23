
import React, { useState, useEffect } from "react"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getSpecificationTypes, addSpecificationType, deleteSpecificationType, updateSpecificationTypeOrder } from "@/lib/specifications"
import { getProducts } from "@/lib/products"
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
import { motion, AnimatePresence, Reorder } from "framer-motion"

export function SpecificationTypesManager() {
  const [types, setTypes] = useState([])
  const [products, setProducts] = useState([])
  const [newType, setNewType] = useState("")
  const [typeToDelete, setTypeToDelete] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteError, setDeleteError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [typesData, productsData] = await Promise.all([
        getSpecificationTypes(),
        getProducts()
      ])
      
      setTypes(typesData)
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddType = async (e) => {
    e.preventDefault()
    if (!newType.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome da especificação",
        variant: "destructive",
      })
      return
    }

    try {
      await addSpecificationType(newType)
      await loadData()
      setNewType("")
      toast({
        title: "Sucesso",
        description: "Especificação adicionada com sucesso",
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
    // Verifica se algum produto usa esta especificação
    const productsUsingSpec = products.filter(product => 
      product.specifications && product.specifications[type.name]
    )
    
    if (productsUsingSpec.length > 0) {
      setDeleteError(`Não é possível excluir a especificação "${type.name}" pois existem ${productsUsingSpec.length} produto(s) utilizando-a.`)
    } else {
      setDeleteError("")
    }
    
    setTypeToDelete(type)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteError && typeToDelete) {
      try {
        await deleteSpecificationType(typeToDelete.id)
        await loadData()
        toast({
          title: "Sucesso",
          description: "Especificação removida com sucesso",
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao remover especificação",
          variant: "destructive",
        })
      }
    }
    setShowDeleteDialog(false)
    setTypeToDelete(null)
    setDeleteError("")
  }

  const handleReorderStart = () => {
    setIsDragging(true)
  }

  const handleReorder = async (newOrder) => {
    setTypes(newOrder)
  }

  const handleReorderEnd = async () => {
    setIsDragging(false)
    try {
      await updateSpecificationTypeOrder(types)
      toast({
        title: "Sucesso",
        description: "Ordem das especificações atualizada",
      })
      await loadData()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar ordem das especificações",
        variant: "destructive",
      })
      await loadData()
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
      <form onSubmit={handleAddType} className="flex gap-4">
        <input
          type="text"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          placeholder="Nova especificação (ex: Cor, Tamanho, Material)"
          className="ui-input flex-1"
        />
        <Button type="submit" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Adicionar
        </Button>
      </form>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            Arraste para reordenar as especificações
          </h3>
        </div>
        <Reorder.Group
          axis="y"
          values={types}
          onReorder={handleReorder}
          className="space-y-2"
        >
          <AnimatePresence>
            {types.map((type) => (
              <Reorder.Item
                key={type.id}
                value={type}
                className="cursor-move touch-none"
                onDragStart={handleReorderStart}
                onDragEnd={handleReorderEnd}
              >
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`ui-card-soft flex items-center justify-between p-4 group transition-colors ${
                    isDragging ? "border-primary/50 bg-accent/5" : "hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors" />
                    <span className="font-medium">{type.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(type)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteError ? "Não é possível excluir" : "Confirmar exclusão"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteError || `Tem certeza que deseja excluir a especificação "${typeToDelete?.name}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            {!deleteError && (
              <AlertDialogAction onClick={handleConfirmDelete}>
                Confirmar
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
