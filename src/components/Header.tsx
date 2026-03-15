import { useState, useEffect } from 'react';
import { Search, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
import { useCartStore } from '@/stores/cartStore';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const totalItems = useCartStore(s => s.items.reduce((sum, i) => sum + i.quantity, 0));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop', href: '/collections' },
    { label: 'Collections', href: '/collections' },
    { label: 'About', href: '/' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 h-20 flex items-center transition-all duration-300 ${
          scrolled ? 'bg-background border-b border-border' : 'bg-background/80 backdrop-blur-sm'
        }`}
      >
        <div className="container-main w-full flex items-center justify-between">
          {/* Left: Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.href}
                className="caps-label text-foreground/70 hover:text-foreground transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Center: Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="font-serif text-2xl tracking-tight">Haven</h1>
          </Link>

          {/* Right: Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:opacity-70 transition-opacity duration-150"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link to="/" className="p-2 hover:opacity-70 transition-opacity duration-150 hidden md:block" aria-label="Account">
              <User className="w-5 h-5" />
            </Link>
            <CartDrawer />
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[116px] z-40 bg-background">
          <nav className="container-main py-8 flex flex-col gap-6">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-3xl text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;
