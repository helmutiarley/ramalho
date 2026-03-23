
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile } from "@/components/user/UserProfile"
import { UserAddresses } from "@/components/user/UserAddresses"
import { UserOrders } from "@/components/user/UserOrders"
import { UserWishlist } from "@/components/user/UserWishlist"
import { User, MapPin, ShoppingBag, Heart } from "lucide-react"
import { useSearchParams } from "react-router-dom"

export function AccountPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile')

  // Atualiza a tab ativa quando os parâmetros da URL mudam
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Atualiza a URL quando a tab muda
  const handleTabChange = (value) => {
    setActiveTab(value)
    setSearchParams({ tab: value })
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-semibold">Minha Conta</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações, endereços e pedidos
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="bg-background/50 backdrop-blur-xl border">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary/10">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="addresses" className="data-[state=active]:bg-primary/10">
              <MapPin className="w-4 h-4 mr-2" />
              Endereços
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary/10">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="data-[state=active]:bg-primary/10">
              <Heart className="w-4 h-4 mr-2" />
              Lista de Desejos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <UserProfile />
          </TabsContent>

          <TabsContent value="addresses" className="space-y-4">
            <UserAddresses />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <UserOrders />
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-4">
            <UserWishlist />
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  )
}
