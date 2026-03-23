
import { supabase } from './supabase'

export const getSpecTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('spec_types')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching spec types:', error)
    return []
  }
}

export const addSpecType = async (name) => {
  try {
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    
    const { data, error } = await supabase
      .from('spec_types')
      .insert([{ name, slug }])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Este tipo de especificação já existe')
      }
      throw new Error('Erro ao adicionar tipo de especificação')
    }

    return data
  } catch (error) {
    throw error
  }
}

export const deleteSpecType = async (id) => {
  try {
    const { error } = await supabase
      .from('spec_types')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    throw new Error('Erro ao remover tipo de especificação')
  }
}
