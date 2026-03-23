
import React from "react"
import { motion } from "framer-motion"
import { ListTree } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoryManager } from "@/components/admin/CategoryManager"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CategoryModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <ListTree className="w-4 h-4" />
          Gerenciar Categorias
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Categorias</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CategoryManager />
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
