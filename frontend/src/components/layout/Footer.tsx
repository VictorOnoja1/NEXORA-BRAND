import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Mail } from "lucide-react";
import { InstagramIcon, TikTokIcon } from "../ui/SocialIcons";
import { siteConfig, whatsappLink } from "../../lib/config";
import logo from "../../assets/nexora-logo.png";
import { useSubscriberStore } from "../../store/subscriberStore";
import { useUIStore } from "../../store/uiStore";

export function Footer() {
  const [email, setEmail] = useState("");
  const subscribe = useSubscriberStore((s) => s.subscribe);
  const showToast = useUIStore((s) => s.showToast);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = subscribe(email);
    showToast(res.message, res.success ? "success" : "error");
    if (res.success) {
      setEmail("");
    }
  };

  return (
    <footer className="bg-chocolate text-ivory mt-auto">
      <div className="max-w-8xl mx-auto px-6 md:px-10 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-10">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-3">
              <img src={logo} alt="NEXORA" className="h-12 w-12 rounded-full object-contain" />
              <span className="font-serif text-2xl">NEXORA</span>
            </Link>
            <p className="font-display italic text-champagne text-lg mb-4">{siteConfig.tagline}</p>
            <p className="text-ivory/60 text-sm max-w-xs font-sans">
              Modern beauty, fashion and everyday essentials — discover, shop and feel confident in one convenient place.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href={siteConfig.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-ivory/10 transition-colors">
                <InstagramIcon size={16} />
              </a>
              <a href={siteConfig.socials.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-ivory/10 transition-colors">
                <TikTokIcon size={16} />
              </a>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-ivory/10 transition-colors">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          <div className="min-w-0">
            <h4 className="text-xs font-semibold tracking-widest2 uppercase text-champagne mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm text-ivory/70 font-sans">
              <li><Link to="/shop" className="hover:text-ivory">All Products</Link></li>
              <li><Link to="/shop?filter=new" className="hover:text-ivory">New Arrivals</Link></li>
              <li><Link to="/shop?filter=bestsellers" className="hover:text-ivory">Best Sellers</Link></li>
              <li><Link to="/shop?filter=sale" className="hover:text-ivory">Discounted</Link></li>
            </ul>
          </div>

          <div className="min-w-0">
            <h4 className="text-xs font-semibold tracking-widest2 uppercase text-champagne mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm text-ivory/70 font-sans">
              <li><Link to="/shop?category=wigs-hair" className="hover:text-ivory">Wigs &amp; Hair</Link></li>
              <li><Link to="/shop?category=skincare-cosmetics" className="hover:text-ivory">Skincare &amp; Cosmetics</Link></li>
              <li><Link to="/shop?category=fashion" className="hover:text-ivory">Fashion</Link></li>
              <li><Link to="/categories" className="hover:text-ivory">View All</Link></li>
            </ul>
          </div>

          <div className="min-w-0">
            <h4 className="text-xs font-semibold tracking-widest2 uppercase text-champagne mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-sm text-ivory/70 font-sans">
              <li><Link to="/about" className="hover:text-ivory">About NEXORA</Link></li>
              <li><Link to="/contact" className="hover:text-ivory">Contact Us</Link></li>
              <li><a href={whatsappLink()} target="_blank" rel="noreferrer" className="hover:text-ivory">WhatsApp Support</a></li>
              <li><a href={`mailto:${siteConfig.supportEmail}`} className="hover:text-ivory break-all">{siteConfig.supportEmail}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ivory/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <form
            onSubmit={handleSubmit}
            className="flex w-full md:w-auto max-w-sm items-center gap-2"
            aria-label="Newsletter signup"
          >
            <div className="relative flex-1">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email for updates"
                className="w-full bg-ivory/5 border border-ivory/15 rounded pl-9 pr-3 py-2.5 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-champagne"
              />
            </div>
            <button type="submit" className="bg-champagne text-chocolate text-xs font-semibold px-4 py-2.5 rounded hover:bg-champagne-dark transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-ivory/40 font-sans">
            © {new Date().getFullYear()} NEXORA Beauty &amp; Essentials. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

