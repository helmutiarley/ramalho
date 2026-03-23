
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { login } from "@/lib/auth/auth"
import { Eye, EyeOff, LogIn } from "lucide-react"

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData.email, formData.password)
      
      toast({
        title: "Sucesso",
        description: "Login realizado com sucesso!",
      })
      
      navigate("/account")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Email ou senha incorretos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ui-card w-full max-w-md space-y-8 p-6"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="ui-icon-card mx-auto mb-4 h-16 w-16"
        >
          <LogIn className="w-8 h-8 text-primary" />
        </motion.div>
        <h2 className="text-2xl font-semibold">Fazer Login</h2>
        <p className="text-muted-foreground mt-2">
          Entre com suas credenciais para acessar sua conta
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="ui-input"
            placeholder="Digite seu email"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Senha</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="ui-input"
              placeholder="Digite sua senha"
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
          <div className="flex justify-end">
            <a
              href="/forgot-password"
              className="text-sm text-primary hover:text-primary/90 transition-colors"
            >
              Esqueceu sua senha?
            </a>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-6 rounded-2xl bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 transition-all duration-300"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <a
            href="/register"
            className="text-primary hover:text-primary/90 transition-colors"
          >
            Criar conta
          </a>
        </p>
      </form>
    </motion.div>
  )
}
