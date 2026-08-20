import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import { whatsappLink } from "../../lib/config";

export function WhatsAppButton() {
  const { pathname } = useLocation();
  // Product detail pages add a sticky "Add to Cart / Buy Now" bar above
  // the mobile bottom nav (see ProductDetail.tsx) — lift the button
  // further on mobile there so it doesn't sit on top of that bar.
  const hasStickyProductBar = pathname.startsWith("/product/");

  return (
    <a
      href={whatsappLink("Hi NEXORA, I have a question about a product.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with NEXORA on WhatsApp"
      className={clsx(
        "fixed right-4 md:right-6 z-30 rounded-full bg-[#25D366] shadow-elevated flex items-center justify-center hover:scale-105 transition-transform",
        hasStickyProductBar ? "bottom-40" : "bottom-24",
        "md:bottom-6"
      )}
      style={{ width: 52, height: 52 }}
    >
      <MessageCircle size={24} className="text-white" fill="white" />
    </a>
  );
}
