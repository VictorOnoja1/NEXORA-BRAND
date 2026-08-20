import { siteConfig } from "../../lib/config";

export function AnnouncementBar() {
  return (
    <div className="bg-chocolate text-ivory text-center text-[11px] md:text-xs tracking-wide py-2 px-4 font-sans">
      {siteConfig.announcement}
    </div>
  );
}
