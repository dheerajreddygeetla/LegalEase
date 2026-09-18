import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Background3D from '../common/Background3D';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-transparent">
      {/* Immersive 3D perspective background */}
      <Background3D />

      <Header />
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
