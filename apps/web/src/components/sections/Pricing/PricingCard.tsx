import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles } from "lucide-react"
import type { Plan } from "@/types/pricing"

interface PricingCardProps {
  plan: Plan
}

export function PricingCard({ plan }: PricingCardProps) {
  const Icon = plan.icon
  const isPopular = plan.popular

  return (
    <Card
      className={`group relative transition-all duration-500 bg-white border-2 ${
        isPopular
          ? "border-primary-500 shadow-colored-lg scale-105 hover:scale-110"
          : "border-neutral-200 hover:border-primary-300 hover:shadow-xl hover:-translate-y-2"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg px-4 py-1">
            <Sparkles className="h-3 w-3 mr-1" />
            Más Popular
          </Badge>
        </div>
      )}

      {/* Header with gradient */}
      <CardHeader
        className={`relative overflow-hidden rounded-t-lg p-6 ${
          isPopular
            ? "bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700"
            : "bg-gradient-to-br from-neutral-50 to-white"
        }`}
      >
        {isPopular && <div className="absolute inset-0 bg-white/10"></div>}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div
            className={`h-12 w-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}
          >
            <Icon className={`h-6 w-6 ${isPopular ? "text-white" : "text-white"}`} />
          </div>
          {isPopular && (
            <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-yellow-300" />
            </div>
          )}
        </div>
        <CardTitle
          className={`text-2xl font-bold mb-2 ${
            isPopular ? "text-white" : "text-secondary-500"
          }`}
        >
          {plan.name}
        </CardTitle>
        <CardDescription
          className={`text-sm mb-4 ${isPopular ? "text-white/90" : "text-neutral-600"}`}
        >
          {plan.description}
        </CardDescription>
        <div className="flex items-baseline gap-1">
          <span
            className={`text-4xl font-bold ${
              isPopular ? "text-white" : "text-secondary-500"
            }`}
          >
            {plan.price}
          </span>
          <span className={isPopular ? "text-white/80" : "text-neutral-600"}>
            /{plan.period}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <ul className="space-y-3">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isPopular ? "bg-primary-100" : "bg-success-100"
                }`}
              >
                <Check
                  className={`h-3.5 w-3.5 ${
                    isPopular ? "text-primary-600" : "text-success-600"
                  }`}
                />
              </div>
              <span className="text-sm text-neutral-700 leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          className={`w-full h-12 font-semibold transition-all ${
            isPopular
              ? "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl"
              : "bg-white border-2 border-neutral-300 hover:border-primary-500 hover:bg-primary-50 text-secondary-600"
          }`}
        >
          {plan.cta}
        </Button>
      </CardFooter>
    </Card>
  )
}









