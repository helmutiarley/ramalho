
import React, { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { verifyEmail } from "@/lib/auth/verification"
import { CheckCircle, XCircle } from "lucide-react"

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const navigate = useNavigate()
  const { toast } = useToast()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    verifyToken()
  }, [token])

  const verifyToken = async () => {
    try {
      await verifyEmail(token)
      setStatus('success')
      toast({
        title: "Email verificado",
        description: "Sua conta foi verificada com sucesso!",
      })
    } catch (error) {
      setStatus('error')
      toast({
        title: "Erro na verificação",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-background/50 p-6 rounded-3xl border backdrop-blur-xl text-center"
      >
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h2 className="text-2xl font-semibold">Verificando seu email</h2>
            <p className="text-muted-foreground">
              Por favor, aguarde enquanto verificamos seu email...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="mx-auto w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-500" />
            </motion.div>
            <h2 className="text-2xl font-semibold">Email Verificado!</h2>
            <p className="text-muted-foreground mb-8">
              Seu email foi verificado com sucesso. Agora você pode acessar sua conta.
            </p>
            <Button
              onClick={() => navigate('/login')}
              className="w-full py-6"
              size="lg"
            >
              Fazer Login
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="mx-auto w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4"
            >
              <XCircle className="w-8 h-8 text-red-500" />
            </motion.div>
            <h2 className="text-2xl font-semibold">Erro na Verificação</h2>
            <p className="text-muted-foreground mb-8">
              O link de verificação é inválido ou expirou. Por favor, solicite um novo link.
            </p>
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="w-full"
            >
              Voltar para Login
            </Button>
          </>
        )}
      </motion.div>
    </main>
  )
}
