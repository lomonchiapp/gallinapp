import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/landing/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import TrialCheckout from './pages/checkout/TrialCheckout';
import MiGranja from './pages/mi-granja/MiGranja';
import Gastos from './pages/gastos/Gastos';
import Ventas from './pages/ventas/Ventas';
import Facturacion from './pages/facturacion/Facturacion';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/auth/login" />;
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen w-full selection:bg-brand-primary/20 selection:text-brand-primary">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/mi-granja" element={<MiGranja />} />
            <Route path="/gastos" element={<Gastos />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/facturacion" element={<Facturacion />} />
            
            {/* Protected Routes */}
            <Route 
              path="/checkout/trial" 
              element={
                <ProtectedRoute>
                  <TrialCheckout />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
