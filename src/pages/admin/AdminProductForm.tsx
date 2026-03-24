import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductStore, Product } from '@/stores/productStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { saveSiteDataToProjectFile, uploadImagesToPublic } from '@/lib/siteDataPersistence';
import { ArrowLeft, Plus, X, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { toast } from 'sonner';

type ProductOptionDraft = {
  name: string;
  values: string[];
  pendingValue: string;
};

const emptyProduct = {
  title: '',
  description: '',
  price: '',
  currencyCode: 'USD',
  images: [] as string[],
  options: [] as ProductOptionDraft[],
  variantPrices: {} as Record<string, string>,
  variantAvailability: {} as Record<string, boolean>,
};

const normalizeOptions = (options: ProductOptionDraft[]) =>
  options
    .map(option => ({
      name: option.name.trim(),
      values: option.values.map(value => value.trim()).filter(Boolean),
    }))
    .filter(option => option.name && option.values.length > 0);

const AdminProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const products = useProductStore(s => s.products);
  const addProduct = useProductStore(s => s.addProduct);
  const updateProduct = useProductStore(s => s.updateProduct);
  const exportSettings = useSettingsStore(s => s.exportData);
  const isEditing = id && id !== 'new';

  const [form, setForm] = useState(emptyProduct);
  const [showVariants, setShowVariants] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    const existing = products.find(p => p.id === id);
    if (!existing) return;

    const variantPrices: Record<string, string> = {};
    const variantAvailability: Record<string, boolean> = {};
    existing.variants.edges.forEach(({ node: variant }) => {
      variantPrices[variant.title] = variant.price.amount;
      variantAvailability[variant.title] = variant.availableForSale;
    });

    setForm({
      title: existing.title,
      description: existing.description,
      price: existing.priceRange.minVariantPrice.amount,
      currencyCode: existing.priceRange.minVariantPrice.currencyCode,
      images: existing.images.edges.map(edge => edge.node.url),
      options: existing.options
        .filter(option => !(option.name === 'Title' && option.values.length === 1 && option.values[0] === 'Default Title'))
        .map(option => ({
          name: option.name,
          values: option.values,
          pendingValue: '',
        })),
      variantPrices,
      variantAvailability,
    });

    if (existing.options.some(option => option.name !== 'Title')) {
      setShowVariants(true);
    }
  }, [id, isEditing, products]);

  const normalizedOptions = normalizeOptions(form.options);

  const variantCombos = (() => {
    if (normalizedOptions.length === 0) return [];

    const combos: Array<Array<{ name: string; value: string }>> = [];

    const combine = (index: number, current: Array<{ name: string; value: string }>) => {
      if (index === normalizedOptions.length) {
        combos.push([...current]);
        return;
      }

      for (const value of normalizedOptions[index].values) {
        current.push({ name: normalizedOptions[index].name, value });
        combine(index + 1, current);
        current.pop();
      }
    };

    combine(0, []);

    return combos.map(combo => ({
      title: combo.map(item => item.value).join(' / '),
      options: combo,
    }));
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.price) {
      toast.error('Title and price are required');
      return;
    }

    const imageEdges = form.images.map(url => ({ node: { url, altText: form.title.trim() } }));
    const options = normalizedOptions.length > 0
      ? normalizedOptions
      : [{ name: 'Title', values: ['Default Title'] }];

    const variants = variantCombos.length > 0
      ? variantCombos.map((combo, index) => ({
          id: `v-${Date.now()}-${index}`,
          title: combo.title,
          selectedOptions: combo.options,
          price: {
            amount: parseFloat(form.variantPrices[combo.title] || form.price).toFixed(2),
            currencyCode: form.currencyCode,
          },
          availableForSale: form.variantAvailability[combo.title] !== false,
        }))
      : [{
          id: `v-${Date.now()}`,
          title: 'Default Title',
          selectedOptions: [{ name: 'Title', value: 'Default Title' }],
          price: {
            amount: parseFloat(form.price).toFixed(2),
            currencyCode: form.currencyCode,
          },
          availableForSale: true,
        }];

    const minVariantAmount = variants.reduce((lowest, variant) => {
      const amount = parseFloat(variant.price.amount);
      return amount < lowest ? amount : lowest;
    }, Number.POSITIVE_INFINITY);

    const productData: Omit<Product, 'id' | 'handle'> = {
      title: form.title.trim(),
      description: form.description.trim(),
      priceRange: {
        minVariantPrice: {
          amount: minVariantAmount.toFixed(2),
          currencyCode: form.currencyCode,
        },
      },
      images: { edges: imageEdges },
      variants: { edges: variants.map(variant => ({ node: variant })) },
      options,
    };

    if (isEditing) {
      const updatedProduct: Product = {
        ...productData,
        id: id!,
        handle: products.find(p => p.id === id)?.handle || '',
      };
      updateProduct(id!, {
        ...updatedProduct,
      });
      try {
        await saveSiteDataToProjectFile({
          settings: JSON.parse(exportSettings()),
          products: useProductStore.getState().products,
        });
      } catch {
        toast.error('Updated in browser, but could not update src/data/site-data.json');
      }
      toast.success('Product updated');
    } else {
      addProduct(productData);
      try {
        await saveSiteDataToProjectFile({
          settings: JSON.parse(exportSettings()),
          products: useProductStore.getState().products,
        });
      } catch {
        toast.error('Created in browser, but could not update src/data/site-data.json');
      }
      toast.success('Product created');
    }

    navigate('/admin/products');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const uploadedImages = await uploadImagesToPublic(files);
      setForm(current => ({ ...current, images: [...current.images, ...uploadedImages.map(image => image.url)] }));
      toast.success(`${uploadedImages.length} image${uploadedImages.length > 1 ? 's' : ''} uploaded`);
    } catch {
      toast.error('Images could not be uploaded to public/uploads');
    } finally {
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setForm(current => ({ ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index) }));
  };

  const addOption = () => {
    setForm(current => ({
      ...current,
      options: [...current.options, { name: '', values: [], pendingValue: '' }],
    }));
    setShowVariants(true);
  };

  const updateOptionName = (index: number, name: string) => {
    setForm(current => ({
      ...current,
      options: current.options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, name } : option
      ),
    }));
  };

  const updatePendingValue = (index: number, pendingValue: string) => {
    setForm(current => ({
      ...current,
      options: current.options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, pendingValue } : option
      ),
    }));
  };

  const addOptionValue = (index: number) => {
    const option = form.options[index];
    const value = option.pendingValue.trim();
    if (!value) return;

    if (option.values.some(existing => existing.toLowerCase() === value.toLowerCase())) {
      toast.error('That value already exists for this option');
      return;
    }

    setForm(current => ({
      ...current,
      options: current.options.map((item, optionIndex) =>
        optionIndex === index
          ? { ...item, values: [...item.values, value], pendingValue: '' }
          : item
      ),
    }));
  };

  const handleOptionValueKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    addOptionValue(index);
  };

  const removeOptionValue = (optionIndex: number, valueIndex: number) => {
    setForm(current => ({
      ...current,
      options: current.options.map((option, index) =>
        index === optionIndex
          ? { ...option, values: option.values.filter((_, currentValueIndex) => currentValueIndex !== valueIndex) }
          : option
      ),
    }));
  };

  const removeOption = (index: number) => {
    setForm(current => ({
      ...current,
      options: current.options.filter((_, optionIndex) => optionIndex !== index),
    }));
  };

  const inputClass = 'w-full h-12 px-4 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors';

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to products
      </button>

      <h1 className="heading-l2 text-foreground mb-8">{isEditing ? 'Edit Product' : 'New Product'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="caps-label text-foreground mb-2 block text-[10px]">Title *</label>
          <input value={form.title} onChange={e => setForm(current => ({ ...current, title: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} required />
        </div>

        <div>
          <label className="caps-label text-foreground mb-2 block text-[10px]">Description</label>
          <textarea value={form.description} onChange={e => setForm(current => ({ ...current, description: e.target.value }))} rows={4} className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors resize-none" style={{ borderRadius: 'var(--radius)' }} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="caps-label text-foreground mb-2 block text-[10px]">Base Price *</label>
            <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(current => ({ ...current, price: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} required />
          </div>
          <div>
            <label className="caps-label text-foreground mb-2 block text-[10px]">Currency</label>
            <input value={form.currencyCode} onChange={e => setForm(current => ({ ...current, currencyCode: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="caps-label text-foreground text-[10px]">Images</label>
            <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" /> Pick images
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {form.images.length === 0 ? (
            <div className="border border-dashed border-border p-6 text-sm text-muted-foreground" style={{ borderRadius: 'var(--radius)' }}>
              No images selected yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {form.images.map((image, index) => (
                <div key={`${index}-${image.slice(0, 20)}`} className="relative border border-border overflow-hidden bg-card" style={{ borderRadius: 'var(--radius)' }}>
                  <img src={image} alt="" className="w-full aspect-square object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-2 bg-background/90 hover:bg-background transition-colors"
                    style={{ borderRadius: '999px' }}
                  >
                    <X className="w-4 h-4 text-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="caps-label text-foreground text-[10px]">Options And Values</label>
            <button type="button" onClick={addOption} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="w-3 h-3" /> Add option
            </button>
          </div>

          <div className="space-y-4">
            {form.options.map((option, optionIndex) => (
              <div key={optionIndex} className="border border-border p-4 space-y-4" style={{ borderRadius: 'var(--radius)' }}>
                <div className="flex gap-2 items-start">
                  <input
                    value={option.name}
                    onChange={e => updateOptionName(optionIndex, e.target.value)}
                    placeholder="Option name, e.g. Color or Size"
                    className={`${inputClass} flex-1`}
                    style={{ borderRadius: 'var(--radius)' }}
                  />
                  <button type="button" onClick={() => removeOption(optionIndex)} className="p-3 hover:bg-secondary transition-colors" style={{ borderRadius: 'var(--radius)' }}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    value={option.pendingValue}
                    onChange={e => updatePendingValue(optionIndex, e.target.value)}
                    onKeyDown={e => handleOptionValueKeyDown(e, optionIndex)}
                    placeholder={option.name ? `Add a ${option.name.toLowerCase()} value` : 'Add a value first'}
                    className={`${inputClass} flex-1`}
                    style={{ borderRadius: 'var(--radius)' }}
                  />
                  <button type="button" onClick={() => addOptionValue(optionIndex)} className="btn-secondary whitespace-nowrap">
                    Add value
                  </button>
                </div>

                {option.values.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value, valueIndex) => (
                      <span key={`${value}-${valueIndex}`} className="inline-flex items-center gap-2 px-3 py-2 bg-secondary text-sm text-foreground" style={{ borderRadius: '999px' }}>
                        {value}
                        <button type="button" onClick={() => removeOptionValue(optionIndex, valueIndex)}>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Add values for this option. Variants are generated from the values you add here.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {variantCombos.length > 0 && (
          <div className="border border-border" style={{ borderRadius: 'var(--radius)' }}>
            <button
              type="button"
              onClick={() => setShowVariants(!showVariants)}
              className="w-full flex items-center justify-between p-4 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
            >
              <span>Variants ({variantCombos.length})</span>
              {showVariants ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showVariants && (
              <div className="border-t border-border">
                <div className="grid grid-cols-[1fr_120px_80px] gap-3 px-4 py-2 bg-secondary/30">
                  <span className="text-[10px] caps-label text-muted-foreground">Variant</span>
                  <span className="text-[10px] caps-label text-muted-foreground">Price</span>
                  <span className="text-[10px] caps-label text-muted-foreground">Available</span>
                </div>

                {variantCombos.map(combo => (
                  <div key={combo.title} className="grid grid-cols-[1fr_120px_80px] gap-3 px-4 py-2 border-t border-border items-center">
                    <span className="text-sm text-foreground">{combo.title}</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.variantPrices[combo.title] || form.price}
                      onChange={e => setForm(current => ({
                        ...current,
                        variantPrices: { ...current.variantPrices, [combo.title]: e.target.value },
                      }))}
                      className="h-9 px-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors"
                      style={{ borderRadius: 'var(--radius)' }}
                    />
                    <label className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={form.variantAvailability[combo.title] !== false}
                        onChange={e => setForm(current => ({
                          ...current,
                          variantAvailability: { ...current.variantAvailability, [combo.title]: e.target.checked },
                        }))}
                        className="w-4 h-4 accent-foreground"
                      />
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn-primary">{isEditing ? 'Save changes' : 'Create product'}</button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
