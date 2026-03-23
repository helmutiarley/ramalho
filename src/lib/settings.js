
import { supabase } from './supabase'

export const getSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}

export const updateInstagramUsername = async (username) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .update({ instagram_username: username })
      .not('id', 'is', null)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating instagram username:', error)
    throw new Error('Erro ao atualizar usuário do Instagram')
  }
}

export const updateLogos = async (logoLight, logoDark) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .update({
        logo_light: logoLight,
        logo_dark: logoDark
      })
      .not('id', 'is', null)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating logos:', error)
    throw new Error('Erro ao atualizar logos')
  }
}
