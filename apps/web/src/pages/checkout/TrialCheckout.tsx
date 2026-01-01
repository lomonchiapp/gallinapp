import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Logo } from '../../components/shared/Logo';
import { 
  CreditCard, 
  ShieldCheck, 
  Calendar, 
  Lock, 
  Info, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function TrialCheckout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartTrial = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-stripe-canvas py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-12">
          <Logo variant="line" height={40} />
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Plan Summary */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[2rem] border border-stripe-border shadow-premium"
            >
              <h2 className="text-xl font-bold text-brand-dark mb-6">Resumen de tu suscripción</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-stripe-text font-medium">Plan Pro (Anual)</span>
                  <span className="text-brand-dark font-black">$499.99/año</span>
                </div>
                <div className="flex justify-between items-center py-2 border-y border-stripe-border/50">
                  <span className="text-brand-primary font-bold">Prueba gratuita (15 días)</span>
                  <span className="text-green-500 font-bold">-$0.00</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-black text-brand-dark">Total hoy</span>
                  <span className="text-lg font-black text-brand-dark">$0.00</span>
                </div>
              </div>

              <div className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10 flex gap-3 mb-8">
                <Info className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-brand-primary/80 font-medium leading-relaxed">
                  No se te cobrará nada hoy. Tu prueba de 15 días termina el <span className="font-bold">{new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>. Puedes cancelar en cualquier momento.
                </p>
              </div>

              <ul className="space-y-3">
                {[
                  "Lotes ilimitados",
                  "IA Predictiva avanzada",
                  "Colaboradores ilimitados",
                  "Soporte prioritario"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-stripe-heading">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="flex items-center justify-center gap-6 opacity-40 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
            </div>
          </div>

          {/* Right Column: Checkout Form */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-stripe-border shadow-floating"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-dark">Detalles de pago</h3>
                  <p className="text-sm text-stripe-text font-medium">Información de tu tarjeta de crédito o débito.</p>
                </div>
              </div>

              <form onSubmit={handleStartTrial} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-dark uppercase tracking-wider ml-1">Número de tarjeta</label>
                  <div className="relative group">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stripe-muted group-focus-within:text-brand-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      required
                      className="w-full bg-stripe-canvas border border-stripe-border h-14 pl-12 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Lock className="w-4 h-4 text-stripe-muted" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-dark uppercase tracking-wider ml-1">Expiración</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stripe-muted group-focus-within:text-brand-primary transition-colors" />
                      <input
                        type="text"
                        placeholder="MM / YY"
                        required
                        className="w-full bg-stripe-canvas border border-stripe-border h-14 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-dark uppercase tracking-wider ml-1">CVC</label>
                    <div className="relative group">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stripe-muted group-focus-within:text-brand-primary transition-colors" />
                      <input
                        type="text"
                        placeholder="123"
                        required
                        maxLength={4}
                        className="w-full bg-stripe-canvas border border-stripe-border h-14 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white h-16 rounded-2xl text-lg font-black shadow-floating transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      "Procesando..."
                    ) : (
                      <>
                        Comenzar 15 días gratis
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 text-stripe-muted font-bold text-xs uppercase tracking-widest py-4">
                  <Lock className="w-3.5 h-3.5" />
                  Pago Seguro Encriptado (SSL)
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}






