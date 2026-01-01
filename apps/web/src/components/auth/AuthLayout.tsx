import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../shared/Logo';
import { CheckCircle2 } from 'lucide-react';
import logoWhite from "@gallinapp/assets/logo-white.png";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const benefits = [
  "Gestión de lotes profesional",
  "Control financiero detallado",
  "Analítica avanzada con IA",
  "Multi-granja y colaboradores"
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left Side: Brand & Benefits (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-brand-dark p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-secondary rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10">
          <img src={logoWhite} alt="Gallinapp" className="h-10 w-auto mb-16" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              Lleva tu producción avícola al <span className="text-brand-primary">siguiente nivel.</span>
            </h1>
            <p className="text-xl text-white/70 mb-12 max-w-lg">
              Únete a miles de productores que ya están optimizando sus granjas con Gallinapp.
            </p>

            <ul className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4 text-white font-medium text-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                  </div>
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="relative z-10 text-white/40 text-sm font-medium">
          © {new Date().getFullYear()} Gallinapp Inc. Todos los derechos reservados.
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-stripe-canvas">
        <div className="w-full max-w-md">
          <div className="md:hidden flex justify-center mb-8">
            <Logo variant="line" height={40} />
          </div>

          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-brand-dark mb-2">{title}</h2>
            <p className="text-stripe-text font-medium">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};





