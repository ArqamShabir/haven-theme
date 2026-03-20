import { useState } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import { toast } from 'sonner';

const AdminSettings = () => {
  const settings = useSettingsStore();
  const [form, setForm] = useState({
    storeName: settings.storeName,
    announcementText: settings.announcementText,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    studioAddress: settings.studioAddress,
    adminPassword: settings.adminPassword,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    settings.updateSettings(form);
    toast.success('Settings saved');
  };

  const inputClass = "w-full h-12 px-4 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors";

  return (
    <div className="max-w-2xl">
      <h1 className="heading-l2 text-foreground mb-8">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="caps-label text-foreground mb-2 block text-[10px]">Store Name</label>
          <input value={form.storeName} onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
        </div>

        <div>
          <label className="caps-label text-foreground mb-2 block text-[10px]">Announcement Bar Text</label>
          <input value={form.announcementText} onChange={e => setForm(f => ({ ...f, announcementText: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
        </div>

        <div>
          <label className="caps-label text-foreground mb-2 block text-[10px]">Contact Email</label>
          <input type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
        </div>

        <div>
          <label className="caps-label text-foreground mb-2 block text-[10px]">Phone</label>
          <input value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
        </div>

        <div>
          <label className="caps-label text-foreground mb-2 block text-[10px]">Studio Address</label>
          <input value={form.studioAddress} onChange={e => setForm(f => ({ ...f, studioAddress: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
        </div>

        <div className="pt-4 border-t border-border">
          <label className="caps-label text-foreground mb-2 block text-[10px]">Admin Password</label>
          <input value={form.adminPassword} onChange={e => setForm(f => ({ ...f, adminPassword: e.target.value }))} className={inputClass} style={{ borderRadius: 'var(--radius)' }} />
          <p className="text-xs text-muted-foreground mt-1">Used to access this admin panel</p>
        </div>

        <button type="submit" className="btn-primary">Save settings</button>
      </form>
    </div>
  );
};

export default AdminSettings;
