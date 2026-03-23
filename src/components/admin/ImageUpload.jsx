
import React, { useState } from "react"
import { Upload, Trash2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { uploadProductImage, deleteProductImage } from "@/lib/storage"

export function ImageUpload({ value, onChange }) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamanho do arquivo (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro no upload",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive",
      })
      return
    }

    // Validar tipo do arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro no upload",
        description: "O arquivo deve ser uma imagem",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Se já existe uma imagem, deletar a antiga
      if (value) {
        try {
          await deleteProductImage(value)
        } catch (error) {
          console.error('Error deleting old image:', error)
        }
      }

      const publicUrl = await uploadProductImage(file)
      
      if (!publicUrl) {
        throw new Error('URL da imagem não foi gerada')
      }

      onChange(publicUrl)
      
      toast({
        title: "Sucesso! 🎉",
        description: "Imagem enviada com sucesso",
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar a imagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!value) return

    try {
      await deleteProductImage(value)
      onChange("")
      
      toast({
        title: "Sucesso! 🗑️",
        description: "Imagem removida com sucesso",
      })
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover a imagem. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <label className="relative flex items-center justify-center w-full h-24 border-2 border-dashed rounded-2xl hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Enviando...
                  </div>
                ) : (
                  "Clique para fazer upload"
                )}
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        </div>
        <div className="relative group">
          {value ? (
            <>
              <img
                src={value}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg"
              />
              <button
                onClick={handleRemove}
                className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
              >
                <Trash2 className="w-5 h-5 text-destructive" />
              </button>
            </>
          ) : (
            <div className="w-24 h-24 rounded-lg bg-muted/50 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
