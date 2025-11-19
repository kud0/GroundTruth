'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectWalletButton } from './ConnectWalletButton';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { name: 'Platform', href: '#how-it-works' },
  { name: 'For Agencies', href: '#problem' },
  { name: 'Use Cases', href: '#use-cases' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Markets', href: '/markets' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isScrolled ? 0 : -100 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-3' : 'py-4'
        }`}
      >
        {/* Glassmorphism Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
              isScrolled
                ? 'bg-white/80 dark:bg-black/40 backdrop-blur-xl shadow-2xl shadow-purple-500/10'
                : 'bg-white/60 dark:bg-black/20 backdrop-blur-md'
            }`}
            style={{
              border: '1px solid rgba(168, 85, 247, 0.2)',
            }}
          >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-2xl opacity-50">
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 50%, rgba(168, 85, 247, 0.1) 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'gradient-shift 8s ease infinite',
                }}
              />
            </div>

            {/* Main Content */}
            <div className="relative px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    className="relative"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/80 transition-shadow">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                  </motion.div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                    GroundTruth
                  </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-1">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const isAnchor = link.href.startsWith('#');

                    const handleClick = (e: React.MouseEvent) => {
                      if (isAnchor) {
                        e.preventDefault();
                        const element = document.querySelector(link.href);
                        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    };

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={handleClick}
                        className="relative px-4 py-2 rounded-lg group"
                      >
                        <motion.span
                          className={`relative z-10 text-sm font-medium transition-colors ${
                            isActive
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                          }`}
                        >
                          {link.name}
                        </motion.span>

                        {/* Active Indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="navbar-indicator"
                            className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 rounded-lg"
                            style={{
                              border: '1px solid rgba(168, 85, 247, 0.3)',
                            }}
                            transition={{
                              type: 'spring',
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}

                        {/* Hover Effect */}
                        <motion.div
                          className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        />
                      </Link>
                    );
                  })}
                </div>

                {/* Right Side - Theme Toggle, Connect Wallet & Mobile Menu */}
                <div className="flex items-center space-x-4">
                  {/* Theme Toggle */}
                  <ThemeToggle />

                  {/* Desktop Wallet Button */}
                  <div className="hidden md:block">
                    <ConnectWalletButton />
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden relative w-10 h-10 rounded-lg bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
                    aria-label="Toggle menu"
                  >
                    <div className="w-5 h-4 flex flex-col justify-between">
                      <motion.span
                        animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                        className="w-full h-0.5 bg-gray-800 dark:bg-white rounded-full"
                      />
                      <motion.span
                        animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                        className="w-full h-0.5 bg-gray-800 dark:bg-white rounded-full"
                      />
                      <motion.span
                        animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                        className="w-full h-0.5 bg-gray-800 dark:bg-white rounded-full"
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-20 left-0 right-0 z-40 md:hidden px-4"
          >
            <div className="bg-white/95 dark:bg-black/95 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10">
              {/* Mobile Navigation Links */}
              <div className="p-4 space-y-2">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  const isAnchor = link.href.startsWith('#');

                  const handleClick = (e: React.MouseEvent) => {
                    if (isAnchor) {
                      e.preventDefault();
                      const element = document.querySelector(link.href);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setIsMobileMenuOpen(false);
                    }
                  };

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={handleClick}
                        className={`block px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 text-gray-900 dark:text-white border border-purple-500/30'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <span className="font-medium">{link.name}</span>
                        {isActive && (
                          <motion.div
                            layoutId="mobile-indicator"
                            className="h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mt-2 rounded-full"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile Wallet Button */}
              <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/50">
                <ConnectWalletButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Styles for Gradient Animation */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </>
  );
}
