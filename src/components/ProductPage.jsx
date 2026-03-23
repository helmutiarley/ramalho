
import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageCircle, ImageIcon, ArrowLeft, ClipboardX, Package, Sparkles, AlertCircle } from "lucide-react"
import { getProductById } from "@/lib/products"
import { getSpecTypes } from "@/lib/specTypes"
import { ProductInstallments } from "@/components/ProductInstallments"

export function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [specTypes, setSpecTypes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      const [productData, specTypesData] = await Promise.all([
        getProductById(id),
        getSpecTypes()
      ])
      setProduct(productData)
      setSpecTypes(specTypesData)
    } catch (error) {
      console.error('Error loading data:', error)
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

  const handleWhatsAppClick = () => {
    const message = `Olá! Gostaria de saber mais sobre o produto: ${product.name}`
    const whatsappUrl = `https://wa.me/5585996135666?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
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

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4">
          <ClipboardX className="w-16 h-16 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-semibold">Produto não encontrado</h1>
          <p className="text-muted-foreground">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={() => navigate('/catalogo')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao catálogo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        onClick={() => navigate('/catalogo')} 
        variant="ghost"
        className="mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar ao catálogo
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna da Imagem */}
        <div className="space-y-4">
          {product.images?.main ? (
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={product.images.main}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-3xl"
            />
          ) : (
            <div className="w-full aspect-square rounded-3xl bg-muted/50 flex items-center justify-center">
              <ImageIcon className="w-24 h-24 text-muted-foreground/40" />
            </div>
          )}
        </div>

        {/* Coluna das Informações */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-semibold">{product.name}</h1>
              <div className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                product.is_new 
                  ? "bg-green-500/10 text-green-500"
                  : "bg-amber-500/10 text-amber-500"
              }`}>
                {product.is_new ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Novo</span>
                  </>
                ) : (
                  <span>Semi-novo</span>
                )}
              </div>
            </div>
            <p className="text-lg text-muted-foreground">{product.description}</p>
          </div>

          {/* Especificações */}
          {specTypes.length > 0 && Object.keys(product.specs || {}).length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Especificações</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specTypes.map((type) => {
                  const value = product.specs?.[type.slug]
                  if (!value) return null

                  return (
                    <div
                      key={type.id}
                      className="ui-card-soft p-4"
                    >
                      <p className="text-sm text-muted-foreground">{type.name}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Descrição Detalhada */}
          {product.custom_description && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Descrição Detalhada</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {product.custom_description}
              </p>
            </div>
          )}

          {/* Preço e Ações */}
          <div className="space-y-6">
            {/* Preço e Disponibilidade */}
            <div className="ui-card p-6 space-y-6">
              {product.quantity > 0 ? (
                <>
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {product.quantity} unidades disponíveis
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-4xl font-semibold">
                      {formatCurrency(product.price.base)}
                    </p>
                  </div>

                  <Button
                    onClick={handleWhatsAppClick}
                    className="w-full py-6 rounded-2xl bg-[#25D366] hover:bg-[#20BD5C] text-white transition-all duration-300 calc-button"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Falar no WhatsApp
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">Produto Indisponível</p>
                    <p className="text-sm text-muted-foreground">
                      Este produto está temporariamente fora de estoque
                    </p>
                  </div>
                  <Button
                    onClick={handleWhatsAppClick}
                    variant="outline"
                    className="mt-4"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Consultar disponibilidade
                  </Button>
                </div>
              )}
            </div>

            {/* Parcelamento - só exibe se produto estiver disponível */}
            {product.quantity > 0 && (
              <ProductInstallments price={product.price.base} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
