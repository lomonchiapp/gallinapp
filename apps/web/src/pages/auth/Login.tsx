import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { SocialAuth } from '../../components/auth/SocialAuth';
import { Button } from '../../components/ui/button';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError(
        err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
          ? 'Email o contraseña incorrectos.'
          : 'Ocurrió un error al iniciar sesión.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Bienvenido de nuevo" 
      subtitle="Ingresa tus credenciales para acceder a tu cuenta."
    >
      <SocialAuth />

      <form onSubmit={handleLogin} className="space-y-5">
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
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-bold text-brand-dark uppercase tracking-wider">Contraseña</label>
            <Link to="/auth/forgot-password" title="Recuperar contraseña" className="text-xs font-bold text-brand-primary hover:opacity-70 transition-opacity">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stripe-muted group-focus-within:text-brand-primary transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
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
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>

        <p className="text-center text-stripe-text font-medium mt-8">
          ¿No tienes una cuenta?{' '}
          <Link to="/auth/signup" className="text-brand-primary font-black hover:opacity-70 transition-opacity underline underline-offset-4">
            Regístrate ahora
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}





