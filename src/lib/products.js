
import { supabase } from './supabase'

export const getProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .order('name')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export const addProduct = async (product) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        description: product.description,
        custom_description: product.custom_description,
        category_id: product.category_id,
        specs: product.specs || {},
        price: {
          base: product.price.base,
          installments: product.price.installments
        },
        images: product.images,
        quantity: product.quantity || 0,
        is_new: product.is_new
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding product:', error)
    throw new Error('Erro ao adicionar produto')
  }
}

export const updateProduct = async (id, product) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        custom_description: product.custom_description,
        category_id: product.category_id,
        specs: product.specs || {},
        price: {
          base: product.price.base,
          installments: product.price.installments
        },
        images: product.images,
        quantity: product.quantity || 0,
        is_new: product.is_new
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating product:', error)
    throw new Error('Erro ao atualizar produto')
  }
}

export const deleteProduct = async (id) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting product:', error)
    throw new Error('Erro ao remover produto')
  }
}
