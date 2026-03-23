
import React from "react"
import { motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"

export function UserOrders() {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Nenhum pedido ainda</h3>
        <p className="text-muted-foreground">
          Seus pedidos aparecerão aqui quando você fizer uma compra
        </p>
      </motion.div>
    </div>
  )
}
