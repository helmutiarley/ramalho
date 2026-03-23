
import { supabase } from './supabase'

export const getSpecificationTypes = async () => {
  const { data, error } = await supabase
    .from('specification_types')
    .select('*')
    .order('display_order', { ascending: true })
    .order('name')

  if (error) {
    console.error('Error fetching specification types:', error)
    return []
  }

  return data
}

export const addSpecificationType = async (name) => {
  // Get max display_order
  const { data: maxOrderData } = await supabase
    .from('specification_types')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)

  const nextOrder = (maxOrderData?.[0]?.display_order || 0) + 1

  const { data, error } = await supabase
    .from('specification_types')
    .insert([{ 
      name,
      display_order: nextOrder
    }])
    .select()
    .single()

  if (error) {
    if (error.code === '23505') { // Unique violation
      throw new Error('Especificação já existe')
    }
    throw new Error('Erro ao adicionar especificação')
  }

  return data
}

export const deleteSpecificationType = async (id) => {
  const { error } = await supabase
    .from('specification_types')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error('Erro ao remover especificação')
  }
}

export const updateSpecificationOrder = async (specifications) => {
  for (let i = 0; i < specifications.length; i++) {
    const { error } = await supabase
      .from('specification_types')
      .update({ display_order: i })
      .eq('id', specifications[i].id)

    if (error) {
      console.error('Error updating specification order:', error)
      throw new Error('Erro ao atualizar ordem das especificações')
    }
  }
}
