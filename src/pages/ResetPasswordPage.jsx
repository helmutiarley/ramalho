
import React, { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { resetPassword } from "@/lib/auth/verification"
import { Eye, EyeOff, KeyRound } from "lucide-react"

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const token = searchParams.get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await resetPassword(token, password)
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso!",
      })
      navigate('/login')
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

  if (!token) {
    return (
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Link Inválido</h2>
          <p className="text-muted-foreground mb-8">
            Este link de recuperação de senha é inválido ou expirou.
          </p>
          <Button onClick={() => navigate('/forgot-password')}>
            Solicitar Novo Link
          </Button>
        </div>
      </main>
    )
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
          <h2 className="text-2xl font-semibold">Nova Senha</h2>
          <p className="text-muted-foreground mt-2">
            Digite sua nova senha
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nova Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-background/50 border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="Digite sua nova senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirmar Nova Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-background/50 border focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="Confirme sua nova senha"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-6 rounded-2xl bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 transition-all duration-300"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Alterando..." : "Alterar Senha"}
          </Button>
        </form>
      </motion.div>
    </main>
  )
}
