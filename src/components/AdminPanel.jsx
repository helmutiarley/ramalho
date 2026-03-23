
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus, FolderPlus, Settings } from "lucide-react"
import { ProductTable } from "@/components/admin/ProductTable"
import { ProductForm } from "@/components/admin/ProductForm"
import { SettingsModal } from "@/components/admin/SettingsModal"
import { CategoryManager } from "@/components/admin/CategoryManager"
import { getProducts } from "@/lib/products"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AdminPanel() {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCategories, setShowCategories] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setIsEditing(true)
  }

  const handleCreate = () => {
    setSelectedProduct(null)
    setIsEditing(true)
  }

  const handleClose = () => {
    setIsEditing(false)
    setSelectedProduct(null)
    loadProducts()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-semibold">Painel Administrativo</h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {/* Configurações */}
          <SettingsModal />

          {/* Categorias */}
          <Dialog open={showCategories} onOpenChange={setShowCategories}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none items-center gap-2"
              >
                <FolderPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Categorias</span>
                <span className="sm:hidden">Gerenciar Categorias</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Gerenciar Categorias</DialogTitle>
              </DialogHeader>
              <CategoryManager onClose={() => {
                setShowCategories(false)
                loadProducts()
              }} />
            </DialogContent>
          </Dialog>

          {/* Novo/Editar Produto */}
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button
                onClick={handleCreate}
                className="flex-1 sm:flex-none items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Novo Produto</span>
                <span className="sm:hidden">Adicionar Produto</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedProduct ? "Editar Produto" : "Novo Produto"}
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                product={selectedProduct}
                onClose={handleClose}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Produtos</h2>
          <ProductTable 
            products={products} 
            onEdit={handleEdit}
            onDelete={loadProducts}
          />
        </div>
      </motion.div>

      {/* Modal de Edição */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={selectedProduct}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
