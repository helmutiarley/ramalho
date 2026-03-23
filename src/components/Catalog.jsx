
import React, { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Laptop, Phone, Watch, Tablet, Monitor } from "lucide-react"
import { getProducts } from "@/lib/products"
import { getCategories } from "@/lib/categories"

export function Catalog() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState({})
  const [isMobile, setIsMobile] = useState(false)

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [checkMobile])

  const productsPerPage = isMobile ? 2 : 4

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
      
      const initialPages = categoriesData.reduce((acc, category) => {
        acc[category.id] = 1
        return acc
      }, {})
      setCurrentPage(initialPages)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(prev => {
      const newPages = {}
      Object.keys(prev).forEach(categoryId => {
        newPages[categoryId] = 1
      })
      return newPages
    })
  }, [isMobile])

  const groupedProducts = categories.map(category => ({
    ...category,
    products: products.filter(product => product.category_id === category.id)
  })).filter(category => category.products.length > 0)

  const handlePageChange = (categoryId, newPage) => {
    setCurrentPage(prev => ({
      ...prev,
      [categoryId]: newPage
    }))
  }

  const Pagination = ({ totalProducts, currentPage, categoryId }) => {
    const totalPages = Math.ceil(totalProducts / productsPerPage)
    
    if (totalPages <= 1) return null

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(categoryId, currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(categoryId, page)}
              className="w-8 h-8"
            >
              {page}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(categoryId, currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="main-title mb-8">Nossos Produtos</h1>
          <p className="text-muted-foreground text-lg">
            Nenhum produto disponível no momento.
          </p>
        </div>
      </div>
    )
  }

  const categoryIcons = {
    macbook: Laptop,
    iphone: Phone,
    watch: Watch,
    ipad: Tablet,
    mac: Monitor
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-background border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-background" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
        </div>
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Explore o Universo Apple
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Da criatividade à produtividade, encontre o dispositivo que combina com seu estilo
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {categories.map((category) => {
                const Icon = categoryIcons[category.slug] || Laptop
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="ui-card-soft flex items-center gap-2 px-6 py-3"
                  >
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="font-medium">{category.name}</span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50" />
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-16">
          {groupedProducts.map((category, index) => {
            const currentPageForCategory = currentPage[category.id] || 1
            const indexOfLastProduct = currentPageForCategory * productsPerPage
            const indexOfFirstProduct = indexOfLastProduct - productsPerPage
            const currentProducts = category.products.slice(indexOfFirstProduct, indexOfLastProduct)

            return (
              <motion.section
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              className="ui-card overflow-hidden"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  <Pagination
                    totalProducts={category.products.length}
                    currentPage={currentPageForCategory}
                    categoryId={category.id}
                  />
                </div>
              </motion.section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
