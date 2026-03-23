
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getCategories } from "@/lib/categories"
import { getSpecTypes } from "@/lib/specTypes"
import { addProduct, updateProduct } from "@/lib/products"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ProductForm({ product, onClose }) {
  const [formData, setFormData] = useState(product || {
    name: "",
    category_id: "",
    description: "",
    custom_description: "",
    specs: {},
    price: {
      base: "",
      installments: 18,
    },
    images: {
      main: "",
      gallery: []
    },
    quantity: 0,
    is_new: true
  })

  const [categories, setCategories] = useState([])
  const [specTypes, setSpecTypes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [categoriesData, specTypesData] = await Promise.all([
        getCategories(),
        getSpecTypes()
      ])
      setCategories(categoriesData)
      setSpecTypes(specTypesData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (product) {
        await updateProduct(product.id, formData)
        toast({
          title: "Produto atualizado! 🎉",
          description: `${formData.name} foi atualizado com sucesso.`,
          variant: "default",
        })
      } else {
        await addProduct(formData)
        toast({
          title: "Produto adicionado! 🎉",
          description: `${formData.name} foi adicionado com sucesso.`,
          variant: "default",
        })
      }
      onClose()
    } catch (error) {
      toast({
        title: "Erro ao salvar produto",
        description: error.message || "Ocorreu um erro ao tentar salvar o produto.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else if (name.startsWith("spec_")) {
      const specSlug = name.replace("spec_", "")
      setFormData(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specSlug]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === "quantity" ? parseInt(value) || 0 : value
      }))
    }
  }

  const handleImageChange = (url) => {
    setFormData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        main: url
      }
    }))
  }

  const handleToggleChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      is_new: checked
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Seção: Informações Básicas */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 mb-4 border-b">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h2 className="text-lg font-semibold">Informações Básicas</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Produto</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="ui-input rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="ui-input rounded-xl"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição Curta</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="ui-input rounded-xl"
            rows={2}
            placeholder="Uma breve descrição do produto"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição Detalhada</label>
          <textarea
            name="custom_description"
            value={formData.custom_description}
            onChange={handleChange}
            className="ui-input rounded-xl"
            rows={4}
            placeholder="Descreva detalhadamente o produto, suas características e diferenciais"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Switch
            id="product-condition"
            checked={formData.is_new}
            onCheckedChange={handleToggleChange}
          />
          <Label htmlFor="product-condition">
            {formData.is_new ? "Produto Novo" : "Produto Semi-novo"}
          </Label>
        </div>
      </div>

      {/* Seção: Preço e Estoque */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 mb-4 border-b">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h2 className="text-lg font-semibold">Preço e Estoque</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Preço Base</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <input
                type="number"
                name="price.base"
                value={formData.price.base}
                onChange={handleChange}
                className="ui-input rounded-xl pl-10 pr-4"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Parcelas Máximas</label>
            <input
              type="number"
              name="price.installments"
              value={formData.price.installments}
              onChange={handleChange}
              className="ui-input rounded-xl"
              min="1"
              max="18"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quantidade em Estoque</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="ui-input rounded-xl"
              min="0"
              required
            />
          </div>
        </div>
      </div>

      {/* Seção: Imagem */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 mb-4 border-b">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h2 className="text-lg font-semibold">Imagem do Produto</h2>
        </div>

        <ImageUpload
          value={formData.images.main}
          onChange={handleImageChange}
        />
      </div>

      {/* Seção: Especificações */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 mb-4 border-b">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h2 className="text-lg font-semibold">Especificações</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specTypes.map((type) => (
            <div key={type.id} className="space-y-2">
              <label className="text-sm font-medium">{type.name}</label>
              <input
                type="text"
                name={`spec_${type.slug}`}
                value={formData.specs[type.slug] || ""}
                onChange={handleChange}
                className="ui-input rounded-xl"
                placeholder={`Digite ${type.name.toLowerCase()}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="rounded-xl px-8"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="rounded-xl px-8 bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Salvando...</span>
            </div>
          ) : (
            <span>Salvar</span>
          )}
        </Button>
      </div>
    </form>
  )
}
