import { useState } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />
      <main className="section-padding">
        <div className="container-main max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="caps-label text-muted-foreground mb-4">Get in touch</p>
            <h1 className="heading-l1 text-foreground mb-12">Contact Us</h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="caps-label text-foreground mb-2 block text-[10px]">Name</label>
                    <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full h-12 px-4 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors" style={{ borderRadius: 'var(--radius)' }} />
                  </div>
                  <div>
                    <label className="caps-label text-foreground mb-2 block text-[10px]">Email</label>
                    <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full h-12 px-4 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors" style={{ borderRadius: 'var(--radius)' }} />
                  </div>
                </div>
                <div>
                  <label className="caps-label text-foreground mb-2 block text-[10px]">Subject</label>
                  <input type="text" required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="w-full h-12 px-4 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors" style={{ borderRadius: 'var(--radius)' }} />
                </div>
                <div>
                  <label className="caps-label text-foreground mb-2 block text-[10px]">Message</label>
                  <textarea required rows={6} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors resize-none" style={{ borderRadius: 'var(--radius)' }} />
                </div>
                <button type="submit" className="btn-primary">Send message</button>
              </form>
            </div>

            <div className="md:col-span-2 space-y-8">
              {[
                { icon: Mail, title: 'Email', lines: ['hello@haven-home.com', 'We reply within 24 hours'] },
                { icon: MapPin, title: 'Studio', lines: ['123 Artisan Lane', 'Portland, OR 97201'] },
                { icon: Clock, title: 'Hours', lines: ['Mon – Fri: 9am – 6pm PST', 'Sat – Sun: Closed'] },
              ].map(info => (
                <div key={info.title} className="flex gap-4">
                  <div className="w-10 h-10 bg-secondary flex items-center justify-center flex-shrink-0" style={{ borderRadius: 'var(--radius)' }}>
                    <info.icon className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">{info.title}</p>
                    {info.lines.map(l => <p key={l} className="text-sm text-muted-foreground">{l}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
