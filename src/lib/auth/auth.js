
import { supabase } from '@/lib/supabase'

export const register = async (email, password, fullName) => {
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      throw new Error('Este email já está em uso')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })

    if (error) throw error

    // Criar registro na tabela users
    const { error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email,
          full_name: fullName,
          password_hash: 'managed_by_supabase',
          user_level: 'user' // Nível padrão para novos usuários
        }
      ])

    if (userError) throw userError

    return data
  } catch (error) {
    console.error('Error in register:', error)
    throw error
  }
}

export const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error in login:', error)
    throw error
  }
}

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Error in logout:', error)
    throw error
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error

    return userData
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export const isAuthenticated = async () => {
  const user = await getCurrentUser()
  return !!user
}

export const isAdmin = async () => {
  const user = await getCurrentUser()
  return user?.user_level === 'admin'
}

export const updateUserProfile = async ({ fullName, currentPassword, newPassword }) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    // Se uma nova senha foi fornecida, atualiza a senha
    if (newPassword) {
      if (!currentPassword) {
        throw new Error('Senha atual é necessária para alterar a senha')
      }

      // Verifica a senha atual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      })

      if (signInError) {
        throw new Error('Senha atual incorreta')
      }

      // Atualiza a senha
      const { error: updatePasswordError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updatePasswordError) throw updatePasswordError
    }

    // Atualiza o nome do usuário
    if (fullName) {
      const { error: updateUserError } = await supabase
        .from('users')
        .update({ full_name: fullName })
        .eq('id', user.id)

      if (updateUserError) throw updateUserError

      // Atualiza os dados do usuário no Auth
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      })

      if (updateAuthError) throw updateAuthError
    }

    return true
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}
