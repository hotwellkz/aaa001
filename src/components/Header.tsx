import { Brain, Coins, Menu, X } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AuthModal from './auth/AuthModal';
import { useNavigate, Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const loadTokens = useAuthStore((state) => state.loadTokens);
  const resetProgress = useAuthStore((state) => state.resetProgress);
  const loadProgress = useAuthStore((state) => state.loadProgress);
  const tokens = useAuthStore((state) => state.tokens);
  const setUser = useAuthStore((state) => state.setUser);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    setIsScrolled(scrollPosition > 20);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        loadTokens();
        loadProgress();
      }
    });
    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setUser, handleScroll]);

  const handleAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      resetProgress();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-sm shadow-lg py-2' 
        : 'bg-gradient-to-r from-slate-900 to-slate-800 py-4'
    }`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-400 transition-transform hover:scale-110" aria-hidden="true" />
              <span className="text-white font-bold text-xl tracking-tight">PyAI Teacher</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/curriculum" className="text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium hover:scale-105">
              Программа курса
            </Link>
            {user ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1.5 rounded-full">
                  <Coins className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-100 text-sm font-medium">{tokens}</span>
                </div>
                <span className="text-gray-300 text-sm">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium hover:scale-105"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleAuth('login')}
                  className="text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium hover:scale-105"
                >
                  Войти
                </button>
                <button
                  onClick={() => handleAuth('register')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium hover:scale-105 hover:shadow-lg"
                >
                  Регистрация
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden fixed inset-x-0 top-[calc(100%+1px)] bg-slate-900/95 backdrop-blur-sm transition-all duration-300 ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-6">
            <div className="space-y-4">
              <Link 
                to="/curriculum"
                className="text-gray-300 hover:text-white transition-all duration-200 block text-lg font-medium px-4 py-2 hover:bg-white/5 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Программа курса
              </Link>
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1.5 rounded-full">
                      <Coins className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-100 text-sm font-medium">{tokens}</span>
                    </div>
                  </div>
                  <div className="text-gray-300 px-4 py-2 text-sm">{user.email}</div>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-300 hover:text-white transition-colors duration-200 px-4 py-2"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAuth('login')}
                    className="text-gray-300 hover:text-white transition-colors duration-200 px-4 py-2 text-sm font-medium"
                  >
                    Войти
                  </button>
                  <button
                    onClick={() => handleAuth('register')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200 text-sm font-medium mx-4 hover:shadow-lg"
                  >
                    Регистрация
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
      />
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium hover:scale-105"
    >
      {children}
    </a>
  );
}

function MobileNavLink({ 
  href, 
  children,
  onClick
}: { 
  href: string; 
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      className="text-gray-300 hover:text-white transition-all duration-200 block text-lg font-medium px-4 py-2 hover:bg-white/5 rounded-lg"
      onClick={onClick}
    >
      {children}
    </a>
  );
}