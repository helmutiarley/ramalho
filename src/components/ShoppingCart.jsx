
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart as ShoppingCart as CartIcon, Trash2, MessageCircle } from 'lucide-react'
import { getCart, removeFromCart, clearCart } from "@/lib/cart"
import { getSettings } from "@/lib/settings"

export function ShoppingCart() {
  const [cart, setCart] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadCart()
    loadSettings()
    window.addEventListener('openCart', () => setIsOpen(true))
    return () => window.removeEventListener('openCart', () => setIsOpen(true))
  }, [])

  useEffect(() => {
    loadCart()
  }, [isOpen])

  const loadSettings = async () => {
    try {
      const settings = await getSettings()
      if (settings?.whatsapp_number) {
        setWhatsappNumber(settings.whatsapp_number)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const loadCart = () => {
    const cartItems = getCart()
    setCart(cartItems)
  }

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId)
    loadCart()
    toast({
      title: "Item removido",
      description: "Item removido do carrinho com sucesso",
    })
  }

  const handleClearCart = () => {
    clearCart()
    loadCart()
    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos do carrinho",
    })
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getTotal = () => {
    return cart.reduce((total, item) => {
      const price = Number(item?.price?.base) || 0
      return total + price
    }, 0)
  }

  const handleWhatsAppClick = () => {
    if (!whatsappNumber) {
      toast({
        title: "Erro",
        description: "Número do WhatsApp não configurado",
        variant: "destructive",
      })
      return
    }

    const total = getTotal()
    const message = `Olá! Gostaria de finalizar a compra dos seguintes itens:\n\n${cart
      .map((item) => `- ${item.name}: ${formatCurrency(Number(item.price.base))}`)
      .join("\n")}\n\nTotal: ${formatCurrency(total)}`

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
        >
          <CartIcon className="h-5 w-5" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>Carrinho de Compras</SheetTitle>
        </SheetHeader>

        {/* Cart Items - Área com scroll */}
        <div className="flex-1 overflow-y-auto py-6">
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Seu carrinho está vazio
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="ui-card-soft flex items-start gap-4 p-4"
                >
                  {item.images?.main ? (
                    <img
                      src={item.images.main}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🖥️</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.description}
                    </p>
                    <p className="text-lg font-semibold mt-2">
                      {formatCurrency(Number(item.price.base))}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Actions - Fixo no final */}
        {cart.length > 0 && (
          <div className="border-t pt-6 space-y-4 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Total</span>
              <span className="text-2xl font-bold">
                {formatCurrency(getTotal())}
              </span>
            </div>

            <div className="grid gap-4">
              <Button
                className="w-full py-6 rounded-2xl bg-[#25D366] hover:bg-[#20BD5C] text-white transition-all duration-300"
                size="lg"
                onClick={handleWhatsAppClick}
                disabled={!whatsappNumber}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Finalizar no WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={handleClearCart}
              >
                Limpar Carrinho
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
