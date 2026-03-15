import { useState } from 'react';
import { toast } from 'sonner';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing');
      setEmail('');
    }
  };

  return (
    <section className="section-padding border-t border-border">
      <div className="container-main max-w-xl text-center mx-auto">
        <h2 className="heading-l2 text-foreground mb-4">Stay in the know</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Receive updates on new arrivals, curated collections, and exclusive offers.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 h-12 px-4 bg-transparent border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
            style={{ borderRadius: 'var(--radius)' }}
            required
          />
          <button type="submit" className="btn-primary">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
