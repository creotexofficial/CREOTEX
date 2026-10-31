import React, { Suspense, lazy } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/layout/Header';
import { MegaNav } from './components/layout/MegaNav';
import { NeuralBackground } from './components/layout/NeuralBackground';
import { HeroSlider } from './components/home/HeroSlider';
import { FilamentSection } from './components/home/FilamentSection';
import { FilamentHubPage } from './components/home/FilamentHubPage';
import { Custom3DPrintPage } from './components/home/Custom3DPrintPage';
import { CatalogSection } from './components/home/CatalogSection';
import { Custom3DPrintSection } from './components/home/Custom3DPrintSection';
import { ValueStrip } from './components/home/ValueStrip';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/modals/ToastContainer';

// Code-Splitting Lazy Components for Maximum Lighthouse Performance & Instant FCP
const CartDrawer = lazy(() => import('./components/modals/CartDrawer').then(m => ({ default: m.CartDrawer })));
const QuickViewModal = lazy(() => import('./components/modals/QuickViewModal').then(m => ({ default: m.QuickViewModal })));
const CheckoutModal = lazy(() => import('./components/modals/CheckoutModal').then(m => ({ default: m.CheckoutModal })));
const AuthModal = lazy(() => import('./components/modals/AuthModal').then(m => ({ default: m.AuthModal })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));

const AppContent = () => {
  const { currentView, currentUser } = useCart();
  const hasAdminToken = Boolean(localStorage.getItem('creotex_auth_token'));

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

  // Dedicated 3D Printer Filament & Materials Hub View
  if (currentView === 'filaments') {
    return (
      <>
        <FilamentHubPage />
        <Suspense fallback={null}>
          <CartDrawer />
          <QuickViewModal />
          <CheckoutModal />
          <AuthModal />
        </Suspense>
      </>
    );
  }

  // Dedicated Custom 3D Printing Service Page View (Not on home page)
  if (currentView === 'custom-3d-print') {
    return (
      <>
        <Custom3DPrintPage />
        <Suspense fallback={null}>
          <CartDrawer />
          <QuickViewModal />
          <CheckoutModal />
          <AuthModal />
        </Suspense>
      </>
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

        {/* Main Content Sections: Strictly 3 Core Sections */}
        <main id="main-content">
          <HeroSlider />

          {/* Section 1: 3D Filament Spool */}
          <FilamentSection />

          {/* Section 2: 3D Print Product */}
          <CatalogSection />

          {/* Section 3: Custom 3D Print Service */}
          <Custom3DPrintSection />

          {/* 3D Print Quality & Trust Guarantee Strip */}
          <ValueStrip />
        </main>


        {/* Footer */}
        <Footer />

        {/* Interactive Drawers & Modals (Lazy Loaded on Demand) */}
        <Suspense fallback={null}>
          <CartDrawer />
          <QuickViewModal />
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
