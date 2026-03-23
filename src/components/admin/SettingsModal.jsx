
import React from "react"
import { motion } from "framer-motion"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InstagramSettings } from "@/components/admin/InstagramSettings"
import { LogoSettings } from "@/components/admin/LogoSettings"
import { SpecTypesManager } from "@/components/admin/SpecTypesManager"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function SettingsModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Configurações
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurações do Sistema</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8 py-4">
          {/* Seção: Logos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="ui-card-soft space-y-6 p-6"
          >
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="text-lg font-semibold">Identidade Visual</h2>
            </div>
            <LogoSettings />
          </motion.div>

          {/* Seção: Instagram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="ui-card-soft space-y-6 p-6"
          >
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="text-lg font-semibold">Redes Sociais</h2>
            </div>
            <InstagramSettings />
          </motion.div>

          {/* Seção: Especificações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="ui-card-soft space-y-6 p-6"
          >
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="text-lg font-semibold">Tipos de Especificações</h2>
            </div>
            <SpecTypesManager />
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
