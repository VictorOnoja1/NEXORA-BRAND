import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileNav } from "./MobileNav";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";
import { WhatsAppButton } from "./WhatsAppButton";
import { ToastContainer } from "../ui/ToastContainer";

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <MobileMenu />
      <SearchOverlay />
      <WhatsAppButton />
      <ToastContainer />
    </>
  );
}
