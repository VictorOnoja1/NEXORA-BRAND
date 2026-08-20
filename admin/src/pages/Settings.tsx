import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@shared/lib/config";
import { isSupabaseConfigured } from "@shared/lib/supabase";
import { isPaystackConfigured } from "@shared/lib/paystack";

function StatusRow({ label, configured, hint }: { label: string; configured: boolean; hint: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-plum-50 last:border-0">
      {configured ? (
        <CheckCircle2 size={17} className="text-plum shrink-0 mt-0.5" />
      ) : (
        <AlertTriangle size={17} className="text-champagne-dark shrink-0 mt-0.5" />
      )}
      <div>
        <p className="text-sm font-medium text-chocolate">
          {label} — {configured ? "Connected" : "Not connected"}
        </p>
        <p className="text-xs text-plum-400 font-sans mt-0.5">{hint}</p>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl md:text-3xl text-chocolate mb-1">Settings</h1>
      <p className="text-sm text-plum-400 mb-8 font-sans">Store configuration and backend connections.</p>

      <div className="border border-plum-100 rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-chocolate mb-3">Backend Status</h2>
        <StatusRow
          label="Supabase (database & auth)"
          configured={isSupabaseConfigured}
          hint="Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then run supabase/schema.sql. Until then the storefront runs on local demo data."
        />
        <StatusRow
          label="Paystack (payments)"
          configured={isPaystackConfigured}
          hint="Set VITE_PAYSTACK_PUBLIC_KEY to accept real payments at checkout. Orders are recorded as pending until this is connected."
        />
      </div>

      <div className="border border-plum-100 rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-chocolate mb-4">Store Details</h2>
        <dl className="flex flex-col gap-3 text-sm font-sans">
          <div className="flex justify-between"><dt className="text-plum-400">WhatsApp Number</dt><dd className="text-chocolate">{siteConfig.whatsappNumber}</dd></div>
          <div className="flex justify-between"><dt className="text-plum-400">Support Email</dt><dd className="text-chocolate">{siteConfig.supportEmail}</dd></div>
          <div className="flex justify-between"><dt className="text-plum-400">Flat Delivery Fee</dt><dd className="text-chocolate">₦{siteConfig.flatDeliveryFee.toLocaleString()}</dd></div>
          <div className="flex justify-between"><dt className="text-plum-400">Free Delivery Threshold</dt><dd className="text-chocolate">₦{siteConfig.freeDeliveryThreshold.toLocaleString()}</dd></div>
          <div className="flex justify-between"><dt className="text-plum-400">Announcement Bar</dt><dd className="text-chocolate text-right max-w-[60%]">{siteConfig.announcement}</dd></div>
        </dl>
        <p className="text-xs text-plum-400 font-sans mt-4">
          These values are currently set in <code className="bg-plum-50 px-1 py-0.5 rounded">src/lib/config.ts</code> and environment
          variables. Move them to a database-backed settings table so they're editable from here without a code deploy.
        </p>
      </div>
    </div>
  );
}
