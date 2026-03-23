
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { MessageCircle, ShieldCheck, CreditCard, ArrowRight } from "lucide-react"

export function Calculator() {
  const [amount, setAmount] = useState("")
  const [installments, setInstallments] = useState([])
  const { toast } = useToast()

  const interestRates = {
    1: { rate: 3.63, total: 1.0363 },
    2: { rate: 5.55, total: 1.0555 },
    3: { rate: 6.38, total: 1.0638 },
    4: { rate: 7.22, total: 1.0722 },
    5: { rate: 8.05, total: 1.0805 },
    6: { rate: 8.90, total: 1.0890 },
    7: { rate: 9.73, total: 1.0973 },
    8: { rate: 10.60, total: 1.1060 },
    9: { rate: 11.46, total: 1.1146 },
    10: { rate: 12.31, total: 1.1231 },
    11: { rate: 13.19, total: 1.1319 },
    12: { rate: 14.05, total: 1.1405 },
    13: { rate: 18.47, total: 1.1847 },
    14: { rate: 19.40, total: 1.1940 },
    15: { rate: 20.35, total: 1.2035 },
    16: { rate: 21.29, total: 1.2129 },
    17: { rate: 22.23, total: 1.2223 },
    18: { rate: 23.20, total: 1.2320 }
  }

  const features = [
    {
      icon: ShieldCheck,
      title: "Produtos Originais",
      description: "Garantia de 1 ano em todos os produtos Apple"
    },
    {
      icon: CreditCard,
      title: "Pagamento Facilitado",
      description: "Parcele em até 18x nos cartões"
    }
  ]

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 10) {
      setAmount(value)
    }
  }

  const calculateInstallments = (value) => {
    if (!value || value <= 0) {
      return []
    }

    return Object.entries(interestRates).map(([installment, { rate, total }]) => {
      const numberOfInstallments = parseInt(installment)
      const totalAmount = value * total
      const installmentAmount = totalAmount / numberOfInstallments

      return {
        installment: numberOfInstallments,
        monthlyPayment: installmentAmount,
        totalAmount: totalAmount,
        interestRate: rate,
      }
    })
  }

  const handleCalculate = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Atenção",
        description: "Por favor, insira um valor válido.",
        variant: "destructive",
      })
      return
    }
    const results = calculateInstallments(parseFloat(amount) / 100)
    setInstallments(results)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleWhatsAppClick = () => {
    const message = "Olá! Gostaria de saber mais sobre os produtos Apple."
    const whatsappUrl = `https://wa.me/5585996135666?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pt-2 md:pt-4 pb-8 space-y-16">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.1)_100%)] dark:bg-[radial-gradient(40%_40%_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.1)_100%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.02]" />
        </div>

        {/* Content */}
        <div className="relative">
          <div className="text-center space-y-6 py-8 md:py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 max-w-3xl mx-auto px-4"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground backdrop-blur-sm">
                Especialista em Apple
              </div>
              <h1 className="hero-display text-5xl md:text-7xl lg:text-[5.5rem] bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/65">
                Seu próximo Apple
                <span className="block">está aqui.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                iPhone, MacBook, iPad e Apple Watch com atendimento direto e compra sem complicação.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                onClick={handleWhatsAppClick}
                className="h-12 px-8 text-base rounded-full bg-[#25D366] hover:bg-[#20BD5C] text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar no WhatsApp
              </Button>
              <Button
                onClick={() => window.location.href = '/catalogo'}
                variant="outline"
                className="h-12 px-8 text-base rounded-full group hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Ver Catálogo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="max-w-4xl mx-auto mt-10 w-full"
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-secondary via-secondary/80 to-background/95 shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_28%)]" />
                <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                <div className="relative p-6 md:p-8 text-left">
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-background/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground backdrop-blur-sm">
                        <CreditCard className="w-3.5 h-3.5 text-primary" />
                        Simulador
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-semibold text-center md:text-left">
                          Simule seu Parcelamento
                        </h2>
                        <p className="mt-2 text-sm md:text-base text-muted-foreground text-center md:text-left max-w-xl">
                          Digite o valor do produto e veja na hora as melhores opções para fechar sua compra.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-end">
                      <div className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-center">
                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Em até</div>
                        <div className="text-2xl font-bold text-primary leading-none mt-1">18x</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-background/60 p-4 md:p-5 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex-1 space-y-2 w-full">
                        <label className="block text-sm font-medium">
                          Valor do produto
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                            R$
                          </span>
                          <input
                            type="text"
                            value={amount ? (parseFloat(amount) / 100).toFixed(2) : ""}
                            onChange={handleAmountChange}
                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-background/80 border border-white/10 focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-base shadow-inner"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleCalculate}
                        className="w-full md:w-auto md:min-w-[220px] h-14 px-8 rounded-2xl bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 transition-all duration-300 calc-button text-base"
                        size="lg"
                      >
                        Calcular Parcelas
                      </Button>
                    </div>

                  </div>

                  {installments.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4 mt-6"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">
                          Resultado da simulação
                        </p>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Parcelas disponíveis
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {installments.map((item, index) => (
                          <motion.div
                            key={item.installment}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="rounded-[1.5rem] border border-white/10 bg-background/70 p-5 shadow-sm hover:bg-background/80 hover:-translate-y-1 transition-all"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-2xl font-bold">{item.installment}x</span>
                              <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-semibold">
                                cartão
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">Parcela de</div>
                              <div className="text-xl font-semibold">
                                {formatCurrency(item.monthlyPayment)}
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <div className="text-sm text-muted-foreground">Total</div>
                              <div className="text-lg font-semibold">
                                {formatCurrency(item.totalAmount)}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="ui-card-soft px-4 py-3 text-sm text-muted-foreground">
                        Os valores são exibidos para facilitar a comparação antes de falar com o atendimento.
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Featured Products Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mt-12"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src="/images/macbookpro1.png" 
                  alt="MacBook Pro" 
                  className="w-full aspect-[4/3] object-cover rounded-3xl"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <h3 className="text-lg font-semibold">MacBook</h3>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src="/images/ipadpro1.png" 
                  alt="iPad" 
                  className="w-full aspect-[4/3] object-cover rounded-3xl"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <h3 className="text-lg font-semibold">iPad</h3>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src="/images/applewatch1.png" 
                  alt="Apple Watch" 
                  className="w-full aspect-[4/3] object-cover rounded-3xl"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <h3 className="text-lg font-semibold">Apple Watch</h3>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src="/images/macmini1.png" 
                  alt="Mac Mini" 
                  className="w-full aspect-[4/3] object-cover rounded-3xl"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <h3 className="text-lg font-semibold">Mac Mini</h3>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto"
      >
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="ui-card flex flex-col items-center p-6 text-center"
          >
            <feature.icon className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </motion.div>
      
      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center space-y-6"
      >
        <h2 className="text-2xl md:text-3xl font-semibold">Pronto para Começar?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Entre em contato conosco agora mesmo e descubra as melhores ofertas para você.
        </p>
        <Button
          onClick={handleWhatsAppClick}
          className="px-8 py-6 rounded-2xl bg-[#25D366] hover:bg-[#20BD5C] text-white transition-all duration-300 calc-button"
          size="lg"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Falar no WhatsApp
        </Button>
      </motion.div>

      {/* Fixed WhatsApp Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={handleWhatsAppClick}
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5C] text-white shadow-lg calc-button"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  )
}
