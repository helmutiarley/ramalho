
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Pencil, Trash2, FileImage as ImageIcon, Package } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { deleteProduct } from "@/lib/products"
import { getCategories } from "@/lib/categories"
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

export function ProductTable({ products = [], onEdit, onDelete }) {
  const { toast } = useToast()
  const [productToDelete, setProductToDelete] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Agrupa produtos por categoria mantendo a ordem das categorias
  const groupedProducts = categories.reduce((acc, category) => {
    const categoryProducts = products.filter(product => product.category_id === category.id)
    if (categoryProducts.length > 0) {
      acc[category.id] = {
        name: category.name,
        products: categoryProducts
      }
    }
    return acc
  }, {})

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleDeleteClick = (product) => {
    setProductToDelete(product)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id)
        toast({
          title: "Sucesso",
          description: "Produto removido com sucesso",
        })
        if (onDelete) {
          onDelete()
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao remover produto",
          variant: "destructive",
        })
      }
    }
    setShowDeleteDialog(false)
    setProductToDelete(null)
  }

  const handleEditClick = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    if (onEdit) {
      onEdit(product)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Nenhum produto cadastrado
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryProducts = groupedProducts[category.id]?.products || []
          if (categoryProducts.length === 0) return null

          return (
            <div key={category.id} className="ui-card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">{category.name}</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left px-6 py-4 font-medium w-[50%]">Produto</th>
                      <th className="text-left px-6 py-4 font-medium w-[20%]">Preço</th>
                      <th className="text-left px-6 py-4 font-medium w-[20%]">Estoque</th>
                      <th className="text-right px-6 py-4 font-medium w-[10%]">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryProducts.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b last:border-0 hover:bg-muted/5 transition-colors"
                      >
                        <td className="px-6 py-4 w-[50%]">
                          <div className="flex items-center gap-4">
                            {product.images?.main && product.images.main.trim() !== "" ? (
                              <img
                                src={product.images.main}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover bg-background"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium w-[20%]">{formatCurrency(product.price.base)}</td>
                        <td className="px-6 py-4 w-[20%]">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span className={product.quantity > 0 ? "text-green-500" : "text-red-500"}>
                              {product.quantity} unidades
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 w-[10%]">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => handleEditClick(e, product)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleDeleteClick(product)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmar exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{productToDelete?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
