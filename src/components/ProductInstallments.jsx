
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

export function ProductInstallments({ price }) {
  const [showAll, setShowAll] = useState(false)
  const mainInstallments = [1, 6, 12]

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

  const calculateInstallments = () => {
    return Object.entries(interestRates).map(([installment, { rate, total }]) => {
      const numberOfInstallments = parseInt(installment)
      const totalAmount = price * total
      const installmentAmount = totalAmount / numberOfInstallments

      return {
        installment: numberOfInstallments,
        monthlyPayment: installmentAmount,
        totalAmount: totalAmount,
        interestRate: rate,
      }
    })
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const InstallmentCard = ({ option }) => (
    <div className="ui-card-soft p-4 hover:bg-background/60">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-bold">{option.installment}x</span>
      </div>
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">Parcela de</div>
        <div className="text-lg font-semibold">
          {formatCurrency(option.monthlyPayment)}
        </div>
      </div>
      <div className="mt-2 pt-2 border-t">
        <div className="text-sm text-muted-foreground">Total</div>
        <div className="text-lg font-semibold">
          {formatCurrency(option.totalAmount)}
        </div>
      </div>
    </div>
  )

  const installments = calculateInstallments()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="ui-card p-6 md:p-8"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Opções de Parcelamento</h2>
          <p className="text-muted-foreground">
            Escolha a melhor forma de pagamento para você
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {showAll ? (
            installments.map((option) => (
              <InstallmentCard 
                key={option.installment} 
                option={option}
              />
            ))
          ) : (
            installments
              .filter(i => mainInstallments.includes(i.installment))
              .map((option) => (
                <InstallmentCard 
                  key={option.installment} 
                  option={option}
                />
              ))
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            size="lg"
            className="text-sm font-medium h-9 px-4"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Mostrar menos
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Ver mais opções
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            * Valores sujeitos a alteração conforme a política de parcelamento vigente
          </div>
        </div>
      </div>
    </motion.div>
  )
}
