import { useState } from 'react';
import { useSettingsStore, HeroSlide, SocialLink, Testimonial } from '@/stores/settingsStore';
import { Plus, X, Download, Upload, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useProductStore } from '@/stores/productStore';

const AdminSettings = () => {
  const settings = useSettingsStore();
  const productStore = useProductStore();
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'social' | 'testimonials' | 'data'>('general');

  const [form, setForm] = useState({
    storeName: settings.storeName,
    storeTagline: settings.storeTagline,
    announcementText: settings.announcementText,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    studioAddress: settings.studioAddress,
    whatsappNumber: settings.whatsappNumber,
    footerTagline: settings.footerTagline,
    adminPassword: settings.adminPassword,
  });

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(settings.heroSlides);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(settings.socialLinks);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(settings.testimonials);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    settings.updateSettings(form);
    toast.success('General settings saved');
  };

  const handleSaveHero = () => {
    settings.updateSettings({ heroSlides: heroSlides.filter(s => s.title.trim()) });
    toast.success('Hero slides saved');
  };

  const handleSaveSocial = () => {
    settings.updateSettings({ socialLinks: socialLinks.filter(l => l.platform.trim()) });
    toast.success('Social links saved');
  };

  const handleSaveTestimonials = () => {
    settings.updateSettings({ testimonials: testimonials.filter(t => t.name.trim()) });
    toast.success('Testimonials saved');
  };

  const handleExport = () => {
    const data = {
      settings: JSON.parse(settings.exportData()),
      products: productStore.products,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-data.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported — place this in public/site-data.json for static builds');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.settings) settings.updateSettings(data.settings);
        if (data.products) {
          // Clear and re-add all products
          data.products.forEach((p: any) => {
            productStore.updateProduct(p.id, p);
          });
        }
        toast.success('Data imported successfully');
      } catch {
        toast.error('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const inputClass = "w-full h-12 px-4 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors";
  const tabClass = (tab: string) =>
    `px-4 py-2 text-sm transition-colors ${activeTab === tab ? 'text-foreground border-b-2 border-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`;

  return (
    <div className="max-w-3xl">
      <h1 className="heading-l2 text-foreground mb-6">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-8">
        {(['general', 'hero', 'social', 'testimonials', 'data'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={tabClass(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="space-y-6">
          <div>
            <label className="caps-label text-foreground mb-2 block text-[10px]">Store Name</label>
            <input value={form.storeName} onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
          </div>
          <div>
            <label className="caps-label text-foreground mb-2 block text-[10px]">Store Tagline</label>
            <input value={form.storeTagline} onChange={e => setForm(f => ({ ...f, storeTagline: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
          </div>
          <div>
            <label className="caps-label text-foreground mb-2 block text-[10px]">Announcement Bar Text</label>
            <input value={form.announcementText} onChange={e => setForm(f => ({ ...f, announcementText: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
          </div>
          <div>
            <label className="caps-label text-foreground mb-2 block text-[10px]">Contact Email</label>
            <input type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="caps-label text-foreground mb-2 block text-[10px]">Phone</label>
              <input value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
            </div>
            <div>
              <label className="caps-label text-foreground mb-2 block text-[10px]">WhatsApp Number</label>
              <input value={form.whatsappNumber} onChange={e => setForm(f => ({ ...f, whatsappNumber: e.target.value }))} placeholder="+1234567890" className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
            </div>
          </div>
          <div>
            <label className="caps-label text-foreground mb-2 block text-[10px]">Studio Address</label>
            <input value={form.studioAddress} onChange={e => setForm(f => ({ ...f, studioAddress: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
          </div>
          <div>
            <label className="caps-label text-foreground mb-2 block text-[10px]">Footer Tagline</label>
            <input value={form.footerTagline} onChange={e => setForm(f => ({ ...f, footerTagline: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
          </div>
          <div className="pt-4 border-t border-border">
            <label className="caps-label text-foreground mb-2 block text-[10px]">Admin Password</label>
            <input value={form.adminPassword} onChange={e => setForm(f => ({ ...f, adminPassword: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
            <p className="text-xs text-muted-foreground mt-1">Used to access this admin panel</p>
          </div>
          <button type="submit" className="btn-primary">Save settings</button>
        </form>
      )}

      {/* Hero Slides Tab */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          {heroSlides.map((slide, i) => (
            <div key={i} className="p-4 border border-border space-y-3" style={{ borderRadius: 'var(--radius)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">Slide {i + 1}</span>
                {heroSlides.length > 1 && (
                  <button onClick={() => setHeroSlides(s => s.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                )}
              </div>
              <input value={slide.image} onChange={e => { const s = [...heroSlides]; s[i] = { ...s[i], image: e.target.value }; setHeroSlides(s); }} placeholder="Image URL" className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
              <div className="grid grid-cols-2 gap-3">
                <input value={slide.subtitle} onChange={e => { const s = [...heroSlides]; s[i] = { ...s[i], subtitle: e.target.value }; setHeroSlides(s); }} placeholder="Subtitle" className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
                <input value={slide.link} onChange={e => { const s = [...heroSlides]; s[i] = { ...s[i], link: e.target.value }; setHeroSlides(s); }} placeholder="Link (e.g. /collections)" className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
              </div>
              <input value={slide.title} onChange={e => { const s = [...heroSlides]; s[i] = { ...s[i], title: e.target.value }; setHeroSlides(s); }} placeholder="Title" className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
              <input value={slide.description} onChange={e => { const s = [...heroSlides]; s[i] = { ...s[i], description: e.target.value }; setHeroSlides(s); }} placeholder="Description" className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
              <input value={slide.cta} onChange={e => { const s = [...heroSlides]; s[i] = { ...s[i], cta: e.target.value }; setHeroSlides(s); }} placeholder="Button text" className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
            </div>
          ))}
          <button onClick={() => setHeroSlides(s => [...s, { image: '', subtitle: '', title: '', description: '', cta: '', link: '' }])} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <Plus className="w-4 h-4" /> Add slide
          </button>
          <button onClick={handleSaveHero} className="btn-primary">Save hero slides</button>
        </div>
      )}

      {/* Social Links Tab */}
      {activeTab === 'social' && (
        <div className="space-y-4">
          {socialLinks.map((link, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input value={link.platform} onChange={e => { const s = [...socialLinks]; s[i] = { ...s[i], platform: e.target.value }; setSocialLinks(s); }} placeholder="Platform" className={`${inputClass} w-1/3`} style={{ borderRadius: 'var(--radius)' }} />
              <input value={link.url} onChange={e => { const s = [...socialLinks]; s[i] = { ...s[i], url: e.target.value }; setSocialLinks(s); }} placeholder="URL" className={`${inputClass} flex-1`} style={{ borderRadius: 'var(--radius)' }} />
              <button onClick={() => setSocialLinks(s => s.filter((_, j) => j !== i))} className="p-3 text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
            </div>
          ))}
          <button onClick={() => setSocialLinks(s => [...s, { platform: '', url: '' }])} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <Plus className="w-4 h-4" /> Add link
          </button>
          <button onClick={handleSaveSocial} className="btn-primary">Save social links</button>
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          {testimonials.map((t, i) => (
            <div key={i} className="p-4 border border-border space-y-3" style={{ borderRadius: 'var(--radius)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">Review {i + 1}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} onClick={() => { const ts = [...testimonials]; ts[i] = { ...ts[i], rating: s }; setTestimonials(ts); }}>
                        <Star className={`w-3.5 h-3.5 ${s <= t.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setTestimonials(ts => ts.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={t.name} onChange={e => { const ts = [...testimonials]; ts[i] = { ...ts[i], name: e.target.value }; setTestimonials(ts); }} placeholder="Name" className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
                <input value={t.date} onChange={e => { const ts = [...testimonials]; ts[i] = { ...ts[i], date: e.target.value }; setTestimonials(ts); }} placeholder="Date (e.g. 2 weeks ago)" className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
              </div>
              <textarea value={t.text} onChange={e => { const ts = [...testimonials]; ts[i] = { ...ts[i], text: e.target.value }; setTestimonials(ts); }} placeholder="Review text" rows={2} className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors resize-none" style={{ borderRadius: 'var(--radius)' }} />
            </div>
          ))}
          <button onClick={() => setTestimonials(ts => [...ts, { name: '', rating: 5, text: '', date: '' }])} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <Plus className="w-4 h-4" /> Add testimonial
          </button>
          <button onClick={handleSaveTestimonials} className="btn-primary">Save testimonials</button>
        </div>
      )}

      {/* Data Export/Import Tab */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="p-6 border border-border bg-card" style={{ borderRadius: 'var(--radius)' }}>
            <h3 className="text-sm font-medium text-foreground mb-2">Export Site Data</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Download all products and settings as JSON. After editing locally, run <code className="bg-secondary px-1 py-0.5">npm run build</code> and deploy the <code className="bg-secondary px-1 py-0.5">dist/</code> folder as a static site.
            </p>
            <button onClick={handleExport} className="btn-primary flex items-center gap-2">
              <Download className="w-4 h-4" /> Export data
            </button>
          </div>

          <div className="p-6 border border-border bg-card" style={{ borderRadius: 'var(--radius)' }}>
            <h3 className="text-sm font-medium text-foreground mb-2">Import Site Data</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Import a previously exported JSON file to restore products and settings.
            </p>
            <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" /> Import data
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          <div className="p-6 border border-dashed border-border bg-secondary/30" style={{ borderRadius: 'var(--radius)' }}>
            <h3 className="text-sm font-medium text-foreground mb-2">Static Build Workflow</h3>
            <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Run the site locally with <code className="bg-secondary px-1 py-0.5">npm run dev</code></li>
              <li>Go to <code className="bg-secondary px-1 py-0.5">/admin</code> and edit products, settings, hero, testimonials</li>
              <li>Click <strong>Export data</strong> above to download your changes</li>
              <li>Run <code className="bg-secondary px-1 py-0.5">npm run build</code> — the build uses your localStorage data as defaults</li>
              <li>Upload the <code className="bg-secondary px-1 py-0.5">dist/</code> folder to any static host (Netlify, Vercel, etc.)</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
