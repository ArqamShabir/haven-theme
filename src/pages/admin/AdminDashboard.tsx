import { Link } from 'react-router-dom';
import { Package, Settings, ExternalLink } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';

const AdminDashboard = () => {
  const productCount = useProductStore(s => s.products.length);

  return (
    <div className="max-w-4xl">
      <h1 className="heading-l2 text-foreground mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 border border-border bg-card" style={{ borderRadius: 'var(--radius)' }}>
          <Package className="w-5 h-5 text-muted-foreground mb-3" />
          <p className="text-3xl font-medium text-foreground">{productCount}</p>
          <p className="text-sm text-muted-foreground mt-1">Products</p>
        </div>
      </div>

      <h2 className="text-sm font-medium text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Add Product', href: '/admin/products/new', icon: Package },
          { label: 'Site Settings', href: '/admin/settings', icon: Settings },
          { label: 'View Site', href: '/', icon: ExternalLink },
        ].map(action => (
          <Link
            key={action.href}
            to={action.href}
            className="flex items-center gap-3 p-4 border border-border hover:bg-secondary/50 transition-colors"
            style={{ borderRadius: 'var(--radius)' }}
          >
            <action.icon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
