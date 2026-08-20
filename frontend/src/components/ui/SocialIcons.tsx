// Lucide dropped brand/logo icons, so these two are small hand-drawn
// outline glyphs kept consistent with the lucide stroke style (24x24,
// strokeWidth 2) rather than pulling in a separate icon package.

export function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3v10.5a3.5 3.5 0 1 1-3-3.46" />
      <path d="M15 3c.5 2.5 2.2 4.2 4.5 4.5" />
    </svg>
  );
}
