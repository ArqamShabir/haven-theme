import { Link } from 'react-router-dom';
import { useSettingsStore } from '@/stores/settingsStore';

const Footer = () => {
  const storeName = useSettingsStore(s => s.storeName);
  const footerTagline = useSettingsStore(s => s.footerTagline);
  const socialLinks = useSettingsStore(s => s.socialLinks);

  return (
    <footer className="border-t border-border">
      <div className="container-main section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="font-serif text-xl mb-4">{storeName}</h3>
            <p className="text-sm text-muted-foreground">{footerTagline}</p>
          </div>

          <div>
            <h4 className="caps-label text-foreground mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/collections" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/collections" className="text-sm text-muted-foreground hover:text-foreground transition-colors">New Arrivals</Link></li>
              <li><Link to="/collections" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="caps-label text-foreground mb-4">Information</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="caps-label text-foreground mb-4">Policies</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Refund Policy</Link></li>
              <li><Link to="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-6">
              {socialLinks.map((link) => (
                <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors caps-label">
                  {link.platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
