
import { supabase } from './supabase'

export const getUserAddresses = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching addresses:', error)
    throw new Error('Erro ao carregar endereços')
  }
}

export const addAddress = async (addressData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    // Verifica se é o primeiro endereço (será o principal)
    const { data: existingAddresses } = await supabase
      .from('addresses')
      .select('id')
      .eq('user_id', user.id)

    const isDefault = existingAddresses?.length === 0

    const { data, error } = await supabase
      .from('addresses')
      .insert([{
        ...addressData,
        user_id: user.id,
        is_default: isDefault
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding address:', error)
    throw new Error('Erro ao adicionar endereço')
  }
}

export const updateAddress = async (addressId, addressData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('addresses')
      .update(addressData)
      .eq('id', addressId)
      .eq('user_id', user.id) // Garante que o endereço pertence ao usuário
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating address:', error)
    throw new Error('Erro ao atualizar endereço')
  }
}

export const deleteAddress = async (addressId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    // Verifica se o endereço é o principal
    const { data: address } = await supabase
      .from('addresses')
      .select('is_default')
      .eq('id', addressId)
      .single()

    if (address?.is_default) {
      throw new Error('Não é possível excluir o endereço principal')
    }

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', user.id) // Garante que o endereço pertence ao usuário

    if (error) throw error
  } catch (error) {
    console.error('Error deleting address:', error)
    throw new Error('Erro ao remover endereço')
  }
}

export const setDefaultAddress = async (addressId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    // Remove o status de principal do endereço atual
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
      .eq('is_default', true)

    // Define o novo endereço principal
    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .eq('user_id', user.id)

    if (error) throw error
  } catch (error) {
    console.error('Error setting default address:', error)
    throw new Error('Erro ao definir endereço principal')
  }
}
