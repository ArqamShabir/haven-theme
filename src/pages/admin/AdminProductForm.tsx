import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductStore, Product } from '@/stores/productStore';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const emptyProduct = {
  title: '',
  description: '',
  price: '',
  currencyCode: 'USD',
  imageUrls: [''],
  options: [] as Array<{ name: string; values: string[] }>,
};

const AdminProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const products = useProductStore(s => s.products);
  const addProduct = useProductStore(s => s.addProduct);
  const updateProduct = useProductStore(s => s.updateProduct);
  const isEditing = id && id !== 'new';

  const [form, setForm] = useState(emptyProduct);

  useEffect(() => {
    if (isEditing) {
      const existing = products.find(p => p.id === id);
      if (existing) {
        setForm({
          title: existing.title,
          description: existing.description,
          price: existing.priceRange.minVariantPrice.amount,
          currencyCode: existing.priceRange.minVariantPrice.currencyCode,
          imageUrls: existing.images.edges.map(e => e.node.url).concat(['']),
          options: existing.options.filter(o => !(o.name === 'Title' && o.values.length === 1 && o.values[0] === 'Default Title')),
        });
      }
    }
  }, [id, isEditing, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price) {
      toast.error('Title and price are required');
      return;
    }

    const imageEdges = form.imageUrls
      .filter(u => u.trim())
      .map(url => ({ node: { url, altText: form.title } }));

    const options = form.options.length > 0
      ? form.options.filter(o => o.name.trim() && o.values.length > 0)
      : [{ name: 'Title', values: ['Default Title'] }];

    // Generate variants from options
    const generateVariants = (opts: typeof options): Array<{ id: string; title: string; selectedOptions: Array<{ name: string; value: string }> }> => {
      if (opts.length === 0 || (opts.length === 1 && opts[0].name === 'Title')) {
        return [{ id: `v-${Date.now()}`, title: 'Default Title', selectedOptions: [{ name: 'Title', value: 'Default Title' }] }];
      }
      const combinations: Array<Array<{ name: string; value: string }>> = [];
      const combine = (index: number, current: Array<{ name: string; value: string }>) => {
        if (index === opts.length) { combinations.push([...current]); return; }
        for (const value of opts[index].values) {
          current.push({ name: opts[index].name, value });
          combine(index + 1, current);
          current.pop();
        }
      };
      combine(0, []);
      return combinations.map((combo, i) => ({
        id: `v-${Date.now()}-${i}`,
        title: combo.map(c => c.value).join(' / '),
        selectedOptions: combo,
      }));
    };

    const variants = generateVariants(options);

    const productData: Omit<Product, 'id' | 'handle'> = {
      title: form.title.trim(),
      description: form.description.trim(),
      priceRange: { minVariantPrice: { amount: parseFloat(form.price).toFixed(2), currencyCode: form.currencyCode } },
      images: { edges: imageEdges.length > 0 ? imageEdges : [] },
      variants: {
        edges: variants.map(v => ({
          node: {
            ...v,
            price: { amount: parseFloat(form.price).toFixed(2), currencyCode: form.currencyCode },
            availableForSale: true,
          },
        })),
      },
      options,
    };

    if (isEditing) {
      updateProduct(id!, { ...productData, id: id!, handle: products.find(p => p.id === id)?.handle || '' });
      toast.success('Product updated');
    } else {
      addProduct(productData);
      toast.success('Product created');
    }
    navigate('/admin/products');
  };

  const updateImageUrl = (index: number, value: string) => {
    const urls = [...form.imageUrls];
    urls[index] = value;
    // Auto-add new empty slot
    if (index === urls.length - 1 && value.trim()) urls.push('');
    setForm(f => ({ ...f, imageUrls: urls }));
  };

  const removeImage = (index: number) => {
    setForm(f => ({ ...f, imageUrls: f.imageUrls.filter((_, i) => i !== index) }));
  };

  const addOption = () => {
    setForm(f => ({ ...f, options: [...f.options, { name: '', values: [] }] }));
  };

  const updateOptionName = (index: number, name: string) => {
    const opts = [...form.options];
    opts[index] = { ...opts[index], name };
    setForm(f => ({ ...f, options: opts }));
  };

  const updateOptionValues = (index: number, valuesStr: string) => {
    const opts = [...form.options];
    opts[index] = { ...opts[index], values: valuesStr.split(',').map(v => v.trim()).filter(Boolean) };
    setForm(f => ({ ...f, options: opts }));
  };

  const removeOption = (index: number) => {
    setForm(f => ({ ...f, options: f.options.filter((_, i) => i !== index) }));
  };

  const inputClass = "w-full h-12 px-4 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors";

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to products
      </button>

      <h1 className="heading-l2 text-foreground mb-8">{isEditing ? 'Edit Product' : 'New Product'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="caps-label text-foreground mb-2 block text-[10px]">Title *</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} required />
        </div>

        <div>
          <label className="caps-label text-foreground mb-2 block text-[10px]">Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors resize-none" style={{ borderRadius: 'var(--radius)' }} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="caps-label text-foreground mb-2 block text-[10px]">Price *</label>
            <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} required />
          </div>
          <div>
            <label className="caps-label text-foreground mb-2 block text-[10px]">Currency</label>
            <input value={form.currencyCode} onChange={e => setForm(f => ({ ...f, currencyCode: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="caps-label text-foreground mb-2 block text-[10px]">Image URLs</label>
          <div className="space-y-2">
            {form.imageUrls.map((url, i) => (
              <div key={i} className="flex gap-2">
                <input value={url} onChange={e => updateImageUrl(i, e.target.value)} placeholder="https://..." className={`${inputClass} flex-1`} style={{ borderRadius: 'var(--radius)' }} />
                {form.imageUrls.length > 1 && url.trim() && (
                  <button type="button" onClick={() => removeImage(i)} className="p-3 hover:bg-secondary transition-colors" style={{ borderRadius: 'var(--radius)' }}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Options */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="caps-label text-foreground text-[10px]">Options (e.g. Color, Size)</label>
            <button type="button" onClick={addOption} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="w-3 h-3" /> Add option
            </button>
          </div>
          {form.options.map((opt, i) => (
            <div key={i} className="flex gap-2 mb-3">
              <input value={opt.name} onChange={e => updateOptionName(i, e.target.value)} placeholder="Option name" className={`${inputClass} w-1/3`} style={{ borderRadius: 'var(--radius)' }} />
              <input value={opt.values.join(', ')} onChange={e => updateOptionValues(i, e.target.value)} placeholder="Values (comma separated)" className={`${inputClass} flex-1`} style={{ borderRadius: 'var(--radius)' }} />
              <button type="button" onClick={() => removeOption(i)} className="p-3 hover:bg-secondary transition-colors" style={{ borderRadius: 'var(--radius)' }}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn-primary">{isEditing ? 'Save changes' : 'Create product'}</button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
