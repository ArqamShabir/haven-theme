import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, LogOut, Lock } from 'lucide-react';
import { useSettingsStore } from '@/stores/settingsStore';

const AdminLayout = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const checkPassword = useSettingsStore(s => s.checkPassword);
  const storeName = useSettingsStore(s => s.storeName);
  const location = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkPassword(password)) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 p-8">
          <div className="text-center mb-8">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <h1 className="font-serif text-2xl text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter password to continue</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-12 px-4 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors"
            style={{ borderRadius: 'var(--radius)' }}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" className="btn-primary w-full">Sign in</button>
          <p className="text-xs text-muted-foreground text-center mt-4">Default: admin123</p>
        </form>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border bg-card flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-border">
          <Link to="/" className="font-serif text-xl text-foreground">{storeName}</Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-secondary text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
                style={{ borderRadius: 'var(--radius)' }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Back to site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
