
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { sendPasswordResetEmail } from "@/lib/auth/verification"
import { KeyRound } from "lucide-react"

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await sendPasswordResetEmail(email)
      setEmailSent(true)
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-background/50 p-6 rounded-3xl border backdrop-blur-xl"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4"
          >
            <KeyRound className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-semibold">Recuperar Senha</h2>
          <p className="text-muted-foreground mt-2">
            Digite seu email para receber um link de recuperação de senha
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-background/50 border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="Digite seu email"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6 rounded-2xl bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 transition-all duration-300"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Voltar para Login
            </Button>
          </form>
        ) : (
          <div className="space-y-6 text-center">
            <p className="text-muted-foreground">
              Um email foi enviado para <strong>{email}</strong> com instruções para redefinir sua senha.
            </p>
            <p className="text-sm text-muted-foreground">
              Não recebeu o email? Verifique sua pasta de spam ou tente novamente.
            </p>
            <Button
              onClick={() => setEmailSent(false)}
              variant="outline"
              className="w-full"
            >
              Tentar Novamente
            </Button>
          </div>
        )}
      </motion.div>
    </main>
  )
}
