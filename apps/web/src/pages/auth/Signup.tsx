import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { SocialAuth } from '../../components/auth/SocialAuth';
import { Button } from '../../components/ui/button';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      
      // After signup, redirect to trial checkout
      navigate('/checkout/trial');
    } catch (err: any) {
      setError(
        err.code === 'auth/email-already-in-use'
          ? 'Este email ya está en uso.'
          : err.code === 'auth/weak-password'
          ? 'La contraseña debe tener al menos 6 caracteres.'
          : 'Ocurrió un error al crear tu cuenta.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Crea tu cuenta" 
      subtitle="Comienza hoy tu prueba gratuita de 15 días."
    >
      <SocialAuth />

      <form onSubmit={handleSignup} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-dark uppercase tracking-wider ml-1">Nombre Completo</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stripe-muted group-focus-within:text-brand-primary transition-colors" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              required
              className="w-full bg-white border border-stripe-border h-14 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-dark uppercase tracking-wider ml-1">Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stripe-muted group-focus-within:text-brand-primary transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full bg-white border border-stripe-border h-14 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-dark uppercase tracking-wider ml-1">Contraseña</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stripe-muted group-focus-within:text-brand-primary transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              className="w-full bg-white border border-stripe-border h-14 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white h-14 rounded-xl text-lg font-bold shadow-premium transition-all active:scale-[0.98]"
        >
          {loading ? "Creando cuenta..." : "Comenzar Prueba Gratis"}
        </Button>

        <p className="text-xs text-stripe-text text-center mt-6 leading-relaxed">
          Al registrarte, aceptas nuestros{' '}
          <Link to="/legal/terms" className="underline font-bold text-brand-dark">Términos de Servicio</Link> y{' '}
          <Link to="/legal/privacy" className="underline font-bold text-brand-dark">Política de Privacidad</Link>.
        </p>

        <p className="text-center text-stripe-text font-medium mt-8 pt-4 border-t border-stripe-border/50">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/auth/login" className="text-brand-primary font-black hover:opacity-70 transition-opacity underline underline-offset-4">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}










