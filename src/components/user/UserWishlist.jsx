
import React from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

export function UserWishlist() {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Lista de desejos vazia</h3>
        <p className="text-muted-foreground">
          Adicione produtos à sua lista de desejos para acompanhar preços e disponibilidade
        </p>
      </motion.div>
    </div>
  )
}
