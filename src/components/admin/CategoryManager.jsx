
import React, { useState, useEffect } from "react"
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getCategories, addCategory, deleteCategory, updateCategoryOrder } from "@/lib/categories"
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

export function CategoryManager({ onClose }) {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [newCategory, setNewCategory] = useState("")
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteError, setDeleteError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts()
      ])
      
      setCategories(categoriesData)
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

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome da categoria",
        variant: "destructive",
      })
      return
    }

    try {
      await addCategory(newCategory)
      await loadData()
      setNewCategory("")
      toast({
        title: "Sucesso! 🎉",
        description: "Categoria adicionada com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = (category) => {
    const productsInCategory = products.filter(product => product.category_id === category.id)
    
    if (productsInCategory.length > 0) {
      setDeleteError(`Não é possível excluir a categoria "${category.name}" pois existem ${productsInCategory.length} produto(s) vinculado(s) a ela.`)
    } else {
      setDeleteError("")
    }
    
    setCategoryToDelete(category)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteError && categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete.id)
        await loadData()
        toast({
          title: "Sucesso! 🗑️",
          description: "Categoria removida com sucesso",
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao remover categoria",
          variant: "destructive",
        })
      }
    }
    setShowDeleteDialog(false)
    setCategoryToDelete(null)
    setDeleteError("")
  }

  const moveCategory = async (index, direction) => {
    const newCategories = [...categories]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex < 0 || newIndex >= categories.length) return

    // Troca as posições
    [newCategories[index], newCategories[newIndex]] = [newCategories[newIndex], newCategories[index]]

    try {
      await updateCategoryOrder(newCategories)
      await loadData()
      toast({
        title: "Sucesso! 🎉",
        description: "Ordem das categorias atualizada",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleAddCategory} className="flex gap-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nova categoria"
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

      <div className="space-y-4">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="ui-card-soft flex items-center justify-between rounded-xl p-4 hover:bg-background/60"
          >
            <div className="flex items-center gap-4">
              <div>
                <span className="font-medium">{category.name}</span>
                <p className="text-sm text-muted-foreground">
                  {products.filter(p => p.category_id === category.id).length} produtos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveCategory(index, 'up')}
                disabled={index === 0}
                className="hover:bg-accent/5"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveCategory(index, 'down')}
                disabled={index === categories.length - 1}
                className="hover:bg-accent/5"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(category)}
                className="hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma categoria cadastrada
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteError ? "Não é possível excluir" : "Confirmar exclusão"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteError || `Tem certeza que deseja excluir a categoria "${categoryToDelete?.name}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            {!deleteError && (
              <AlertDialogAction 
                onClick={handleConfirmDelete}
                className="rounded-xl bg-gradient-to-r from-destructive/90 to-destructive hover:from-destructive hover:to-destructive/90"
              >
                Confirmar
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
