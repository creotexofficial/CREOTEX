import React, { Suspense, lazy } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/layout/Header';
import { MegaNav } from './components/layout/MegaNav';
import { NeuralBackground } from './components/layout/NeuralBackground';
import { HeroSlider } from './components/home/HeroSlider';
import { FlashDeals } from './components/home/FlashDeals';
import { CatalogSection } from './components/home/CatalogSection';
import { RobotBuilder } from './components/home/RobotBuilder';
import { DatasheetsHub } from './components/home/DatasheetsHub';
import { ValueStrip } from './components/home/ValueStrip';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/modals/ToastContainer';

// Code-Splitting Lazy Components for Maximum Lighthouse Performance & Instant FCP
const CartDrawer = lazy(() => import('./components/modals/CartDrawer').then(m => ({ default: m.CartDrawer })));
const QuickViewModal = lazy(() => import('./components/modals/QuickViewModal').then(m => ({ default: m.QuickViewModal })));
const CompareModal = lazy(() => import('./components/modals/CompareModal').then(m => ({ default: m.CompareModal })));
const CheckoutModal = lazy(() => import('./components/modals/CheckoutModal').then(m => ({ default: m.CheckoutModal })));
const AuthModal = lazy(() => import('./components/modals/AuthModal').then(m => ({ default: m.AuthModal })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));

const AppContent = () => {
  const { currentView, currentUser } = useCart();

  if (currentView === 'admin') {
    return (
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#09090B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316' }}>Loading Creotex Suite...</div>}>
        {currentUser?.role === 'super_admin' ? (
          <AdminLayout />
        ) : (
          <AdminLogin />
        )}
        <ToastContainer />
      </Suspense>
    );
  }

  return (
    <>
      {/* Optimized Canvas Particle Background */}
      <NeuralBackground />

      <div className="creotex-app-root" style={{ position: 'relative', zIndex: 1 }}>
        {/* Layout Header */}
        <Header />
        <MegaNav />

        {/* Main Content Sections */}
        <main id="main-content">
          <HeroSlider />
          <FlashDeals />
          <CatalogSection />
          <RobotBuilder />
          <DatasheetsHub />
          <ValueStrip />
        </main>

        {/* Footer */}
        <Footer />

        {/* Interactive Drawers & Modals (Lazy Loaded on Demand) */}
        <Suspense fallback={null}>
          <CartDrawer />
          <QuickViewModal />
          <CompareModal />
          <CheckoutModal />
          <AuthModal />
        </Suspense>
      </div>

      <ToastContainer />
    </>
  );
};

export const App = () => {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
};

export default App;
