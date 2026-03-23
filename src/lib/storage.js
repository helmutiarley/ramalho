
import { supabase } from './supabase'

export const uploadProductImage = async (file) => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${fileName}`

    // Upload do arquivo
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    // Gerar URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath)

    if (!publicUrl) {
      throw new Error('Erro ao gerar URL da imagem')
    }

    return publicUrl
  } catch (error) {
    console.error('Error uploading product image:', error)
    throw new Error(error.message || 'Erro ao fazer upload da imagem')
  }
}

export const deleteProductImage = async (url) => {
  try {
    if (!url) return

    // Extrair o nome do arquivo da URL
    const fileName = url.split('/').pop()
    
    if (!fileName) {
      throw new Error('Nome do arquivo não encontrado')
    }

    const { error } = await supabase.storage
      .from('products')
      .remove([fileName])

    if (error) {
      console.error('Delete error:', error)
      throw error
    }
  } catch (error) {
    console.error('Error deleting product image:', error)
    throw new Error(error.message || 'Erro ao deletar imagem')
  }
}

export const uploadLogo = async (file) => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath)

    if (!publicUrl) throw new Error('Erro ao gerar URL da imagem')

    return publicUrl
  } catch (error) {
    console.error('Error uploading logo:', error)
    throw new Error(error.message || 'Erro ao fazer upload do logo')
  }
}

export const deleteLogo = async (url) => {
  try {
    if (!url) return

    const fileName = url.split('/').pop()
    
    if (!fileName) {
      throw new Error('Nome do arquivo não encontrado')
    }

    const { error } = await supabase.storage
      .from('logos')
      .remove([fileName])

    if (error) throw error
  } catch (error) {
    console.error('Error deleting logo:', error)
    throw new Error(error.message || 'Erro ao deletar logo')
  }
}
