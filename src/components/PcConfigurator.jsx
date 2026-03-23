
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getCategories } from "@/lib/categories"
import { getProducts } from "@/lib/products"
import { addToCart } from "@/lib/cart"
import { ChevronRight, ChevronLeft, ShoppingCart, Check, AlertCircle } from 'lucide-react'
import { ProductInstallments } from "@/components/ProductInstallments"

export function PcConfigurator() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleSelectProduct = (categoryId, product) => {
    setSelectedProducts(prev => ({
      ...prev,
      [categoryId]: product
    }))
  }

  const getTotalPrice = () => {
    return Object.values(selectedProducts).reduce((total, product) => {
      // Converte explicitamente para número e verifica se é válido
      const price = Number(product?.price?.base) || 0
      return total + price
    }, 0)
  }

  const getMissingCategories = () => {
    return categories.filter(category => !selectedProducts[category.id])
  }

  const handleAddToCart = () => {
    const missing = getMissingCategories()
    
    if (missing.length > 0) {
      toast({
        title: "Seleção Incompleta",
        description: `Faltam componentes: ${missing.map(c => c.name).join(", ")}`,
        variant: "destructive",
      })
      return
    }

    setIsAddingToCart(true)
    try {
      const items = Object.values(selectedProducts)
      addToCart(items)
      
      toast({
        title: "Sucesso",
        description: "Produtos adicionados ao carrinho",
      })
      
      // Limpa a seleção
      setSelectedProducts({})
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar ao carrinho",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const missingCategories = getMissingCategories()
  const isComplete = missingCategories.length === 0
  const totalPrice = getTotalPrice()

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="main-title mb-8">Monte Seu Computador</h1>
        <p className="text-muted-foreground/80 max-w-2xl mx-auto text-lg md:text-xl font-light tracking-wide">
          Selecione os componentes ideais para montar o computador dos seus sonhos
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Progresso da Montagem</h2>
          <p className="text-sm text-muted-foreground">
            {Object.keys(selectedProducts).length} de {categories.length} itens selecionados
          </p>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ 
              width: `${(Object.keys(selectedProducts).length / categories.length) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Configurator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Categories and Products */}
        <div className="lg:col-span-8 space-y-8">
          {categories.map((category, index) => {
            const categoryProducts = products.filter(p => p.category_id === category.id)
            const selectedProduct = selectedProducts[category.id]

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="ui-card overflow-hidden"
              >
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    {category.name}
                    {selectedProduct && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </h2>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryProducts.map((product) => (
                      <div
                        key={product.id}
                        className={`relative group rounded-2xl border p-4 cursor-pointer transition-all ${
                          selectedProduct?.id === product.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => handleSelectProduct(category.id, product)}
                      >
                        <div className="flex items-start gap-4">
                          {product.images?.main ? (
                            <img
                              src={product.images.main}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                              <span className="text-2xl">🖥️</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{product.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {product.description}
                            </p>
                            <p className="text-lg font-semibold">
                              {formatCurrency(product.price.base)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="ui-card p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Resumo da Configuração</h2>
              
              <div className="space-y-4 mb-6">
                {Object.entries(selectedProducts).map(([categoryId, product]) => {
                  const category = categories.find(c => c.id === categoryId)
                  return (
                    <div key={categoryId} className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground">{category?.name}</p>
                        <p className="font-medium">{product.name}</p>
                      </div>
                      <p className="font-semibold">{formatCurrency(product.price.base)}</p>
                    </div>
                  )
                })}

                {missingCategories.length > 0 && (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <div className="flex items-center gap-2 text-destructive mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <p className="font-medium">Itens Faltantes</p>
                    </div>
                    <ul className="text-sm space-y-1 text-destructive">
                      {missingCategories.map(category => (
                        <li key={category.id}>• {category.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalPrice)}</p>
                </div>
              </div>

              <Button
                className="w-full py-6 rounded-2xl bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 transition-all duration-300"
                size="lg"
                disabled={!isComplete || isAddingToCart}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isAddingToCart ? "Adicionando..." : "Adicionar ao Carrinho"}
              </Button>
            </motion.div>

            {/* Installments */}
            {totalPrice > 0 && (
              <ProductInstallments price={totalPrice} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
