
import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ImageIcon, Package, Sparkles, AlertCircle } from "lucide-react"

export function ProductCard({ product }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const hasValidImage = product.images?.main && product.images.main.trim() !== ""

  return (
    <Link to={`/produto/${product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="ui-card group relative h-full overflow-hidden p-6 hover:bg-background/60"
      >
        <div className="flex flex-col h-full">
          {/* Imagem */}
          <div className="aspect-square mb-4 overflow-hidden rounded-2xl bg-muted/50">
            {hasValidImage ? (
              <img 
                src={product.images.main} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col flex-1">
            {/* Título e Badge */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <div className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                product.is_new 
                  ? "bg-green-500/10 text-green-500"
                  : "bg-amber-500/10 text-amber-500"
              }`}>
                {product.is_new ? (
                  <>
                    <Sparkles className="w-3 h-3" />
                    <span>Novo</span>
                  </>
                ) : (
                  <span>Semi-novo</span>
                )}
              </div>
            </div>

            {/* Descrição */}
            <p className="text-muted-foreground mb-4 line-clamp-2 flex-1">{product.description}</p>

            {/* Preço e Disponibilidade */}
            <div className="mt-auto">
              {product.quantity > 0 ? (
                <>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold">{formatCurrency(product.price.base)}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Package className="w-4 h-4" />
                    <span>{product.quantity} unidades</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-sm text-amber-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>Indisponível</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
