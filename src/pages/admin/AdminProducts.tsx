import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import { toast } from 'sonner';

const AdminProducts = () => {
  const products = useProductStore(s => s.products);
  const deleteProduct = useProductStore(s => s.deleteProduct);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteProduct(id);
      toast.success(`"${title}" deleted`);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="heading-l2 text-foreground">Products</h1>
        <Link to="/admin/products/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border" style={{ borderRadius: 'var(--radius)' }}>
          <p className="text-muted-foreground mb-2">No products yet</p>
          <Link to="/admin/products/new" className="text-sm text-link">Add your first product</Link>
        </div>
      ) : (
        <div className="border border-border overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Variants</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-muted overflow-hidden flex-shrink-0" style={{ borderRadius: 'var(--radius)' }}>
                        {product.images.edges[0]?.node && (
                          <img src={product.images.edges[0].node.url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="text-sm text-foreground font-medium">{product.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground price-display">
                    ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {product.variants.edges.length}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="p-2 hover:bg-secondary transition-colors"
                        style={{ borderRadius: 'var(--radius)' }}
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.title)}
                        className="p-2 hover:bg-destructive/10 transition-colors"
                        style={{ borderRadius: 'var(--radius)' }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
