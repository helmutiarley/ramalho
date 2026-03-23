
import { supabase } from './supabase'

export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export const addCategory = async (name) => {
  try {
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    
    // Get max order
    const { data: maxOrderData } = await supabase
      .from('categories')
      .select('order')
      .order('order', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxOrderData?.order || 0) + 1
    
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, slug, order: nextOrder }])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Categoria já existe')
      }
      throw new Error('Erro ao adicionar categoria')
    }

    return data
  } catch (error) {
    throw error
  }
}

export const updateCategoryOrder = async (categories) => {
  try {
    const updates = categories.map((category, index) => ({
      id: category.id,
      order: index + 1 // Usando index + 1 para evitar ordem 0
    }))

    // Atualizar cada categoria individualmente para garantir a ordem
    for (const update of updates) {
      const { error } = await supabase
        .from('categories')
        .update({ order: update.order })
        .eq('id', update.id)

      if (error) throw error
    }

    return true
  } catch (error) {
    console.error('Error updating category order:', error)
    throw new Error('Erro ao atualizar ordem das categorias')
  }
}

export const deleteCategory = async (id) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Reordenar categorias restantes após deletar
    const { data: remainingCategories } = await supabase
      .from('categories')
      .select('*')
      .order('order', { ascending: true })

    if (remainingCategories) {
      await updateCategoryOrder(remainingCategories)
    }
  } catch (error) {
    throw new Error('Erro ao remover categoria')
  }
}

export const migrateCategories = async () => {
  const localCategories = JSON.parse(localStorage.getItem('categories') || '[]')
  
  for (const category of localCategories) {
    try {
      await addCategory(category.name)
    } catch (error) {
      console.error('Error migrating category:', error)
    }
  }

  localStorage.removeItem('categories')
}
