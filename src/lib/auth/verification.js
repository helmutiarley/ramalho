
import { supabase } from '@/lib/supabase'

// Gera um token único
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

// Envia email de verificação
export const sendVerificationEmail = async (userId, email) => {
  try {
    const token = generateToken()
    const expires = new Date()
    expires.setHours(expires.getHours() + 24) // Token válido por 24h

    // Salva o token no banco
    const { error } = await supabase
      .from('tokens')
      .insert([{
        user_id: userId,
        token,
        type: 'email-verification',
        expires_at: expires.toISOString()
      }])

    if (error) throw error

    // Envia o email usando Supabase
    const { error: emailError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/verify-email?token=${token}`
    })

    if (emailError) throw emailError

    return true
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw new Error('Erro ao enviar email de verificação')
  }
}

// Verifica o token de email
export const verifyEmail = async (token) => {
  try {
    // Busca o token válido
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .select('*')
      .eq('token', token)
      .eq('type', 'email-verification')
      .gt('expires_at', new Date().toISOString())
      .single()

    if (tokenError || !tokenData) {
      throw new Error('Token inválido ou expirado')
    }

    // Marca o usuário como verificado
    const { error: updateError } = await supabase
      .from('users')
      .update({ is_verified: true })
      .eq('id', tokenData.user_id)

    if (updateError) throw updateError

    // Remove o token usado
    await supabase
      .from('tokens')
      .delete()
      .eq('id', tokenData.id)

    return true
  } catch (error) {
    console.error('Error verifying email:', error)
    throw error
  }
}

// Envia email de recuperação de senha
export const sendPasswordResetEmail = async (email) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (userError) throw new Error('Email não encontrado')

    const token = generateToken()
    const expires = new Date()
    expires.setHours(expires.getHours() + 1) // Token válido por 1h

    // Salva o token no banco
    const { error } = await supabase
      .from('tokens')
      .insert([{
        user_id: userData.id,
        token,
        type: 'password-reset',
        expires_at: expires.toISOString()
      }])

    if (error) throw error

    // Envia o email usando Supabase
    const { error: emailError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password?token=${token}`
    })

    if (emailError) throw emailError

    return true
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw error
  }
}

// Reseta a senha
export const resetPassword = async (token, newPassword) => {
  try {
    // Busca o token válido
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .select('*')
      .eq('token', token)
      .eq('type', 'password-reset')
      .gt('expires_at', new Date().toISOString())
      .single()

    if (tokenError || !tokenData) {
      throw new Error('Token inválido ou expirado')
    }

    // Atualiza a senha
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) throw updateError

    // Remove o token usado
    await supabase
      .from('tokens')
      .delete()
      .eq('id', tokenData.id)

    return true
  } catch (error) {
    console.error('Error resetting password:', error)
    throw error
  }
}
