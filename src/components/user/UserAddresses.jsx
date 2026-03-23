
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Plus, MapPin, Pencil, Trash2, Star, StarOff } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getUserAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from "@/lib/addresses"

export function UserAddresses() {
  const [addresses, setAddresses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [formData, setFormData] = useState({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    postal_code: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    try {
      const data = await getUserAddresses()
      setAddresses(data)
    } catch (error) {
      console.error('Error loading addresses:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar endereços",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (selectedAddress) {
        await updateAddress(selectedAddress.id, formData)
        toast({
          title: "Sucesso",
          description: "Endereço atualizado com sucesso",
        })
      } else {
        await addAddress(formData)
        toast({
          title: "Sucesso",
          description: "Endereço adicionado com sucesso",
        })
      }
      
      await loadAddresses()
      handleCloseDialog()
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (address) => {
    setSelectedAddress(address)
    setFormData({
      street: address.street,
      number: address.number,
      complement: address.complement || "",
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code
    })
    setShowAddDialog(true)
  }

  const handleDelete = (address) => {
    setSelectedAddress(address)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteAddress(selectedAddress.id)
      toast({
        title: "Sucesso",
        description: "Endereço removido com sucesso",
      })
      await loadAddresses()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover endereço",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
      setSelectedAddress(null)
    }
  }

  const handleSetDefault = async (address) => {
    try {
      await setDefaultAddress(address.id)
      toast({
        title: "Sucesso",
        description: "Endereço principal definido com sucesso",
      })
      await loadAddresses()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao definir endereço principal",
        variant: "destructive",
      })
    }
  }

  const handleCloseDialog = () => {
    setShowAddDialog(false)
    setSelectedAddress(null)
    setFormData({
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      postal_code: ""
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Meus Endereços</h2>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Endereço
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="ui-card relative overflow-hidden p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">
                      {address.street}, {address.number}
                      {address.complement && ` - ${address.complement}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.neighborhood}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.city} - {address.state}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      CEP: {address.postal_code}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSetDefault(address)}
                    disabled={address.is_default}
                    title={address.is_default ? "Endereço principal" : "Definir como principal"}
                  >
                    {address.is_default ? (
                      <Star className="w-4 h-4 text-primary" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(address)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(address)}
                    disabled={address.is_default}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dialog para adicionar/editar endereço */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAddress ? "Editar Endereço" : "Novo Endereço"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rua</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="ui-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Número</label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className="ui-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Complemento</label>
                <input
                  type="text"
                  name="complement"
                  value={formData.complement}
                  onChange={handleChange}
                  className="ui-input"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bairro</label>
                <input
                  type="text"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  className="ui-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cidade</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="ui-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="ui-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">CEP</label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="ui-input"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : (selectedAddress ? "Salvar" : "Adicionar")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este endereço?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
