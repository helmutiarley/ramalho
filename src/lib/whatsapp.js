
import { getSettings } from './settings'

let cachedWhatsAppNumber = null

export const getWhatsAppNumber = async () => {
  try {
    if (cachedWhatsAppNumber) return cachedWhatsAppNumber

    const settings = await getSettings()
    cachedWhatsAppNumber = settings?.whatsapp_number || "5585996135666" // número padrão como fallback
    return cachedWhatsAppNumber
  } catch (error) {
    console.error('Error getting WhatsApp number:', error)
    return "5585996135666" // número padrão como fallback
  }
}

export const createWhatsAppLink = async (message) => {
  const number = await getWhatsAppNumber()
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
