
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function PriceCalculator({ defaultValue = 0 }) {
  const [amount, setAmount] = useState(defaultValue.toString())
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="ui-card p-6 md:p-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Simule seu Parcelamento</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-medium">
              Valor do produto
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <input
                type="text"
                value={amount ? (parseFloat(amount) / 100).toFixed(2) : ""}
                onChange={handleAmountChange}
                className="ui-input pl-10 pr-4"
                placeholder="0,00"
              />
            </div>
          </div>
          <Button
            onClick={handleCalculate}
            className="w-full md:w-auto px-8 py-6 rounded-2xl bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 transition-all duration-300 calc-button"
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
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {installments.map((item, index) => (
              <motion.div
                key={item.installment}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="ui-card-soft p-4 hover:bg-background/60"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{item.installment}x</span>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Parcela de</div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(item.monthlyPayment)}
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(item.totalAmount)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
