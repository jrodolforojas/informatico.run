export function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
      <path fill="#4285F4" d="M45 24.5c0-1.6-.1-2.8-.4-4H24v7.3h12c-.2 1.9-1.5 4.8-4.3 6.7l-.04.3 6.2 4.8.4.04C42.3 41.9 45 33.9 45 24.5z" />
      <path fill="#34A853" d="M24 46c5.7 0 10.5-1.9 14-5.1l-6.7-5.2c-1.8 1.2-4.2 2.1-7.3 2.1-5.6 0-10.3-3.7-12-8.8l-.3.02-6.4 5-.1.3C8.6 41 15.7 46 24 46z" />
      <path fill="#FBBC05" d="M12 29c-.5-1.4-.7-2.9-.7-4.5s.3-3.1.7-4.5l-.01-.3-6.5-5-.2.1C3.9 17.7 3 20.7 3 24s.9 6.3 2.3 9.2L12 29z" />
      <path fill="#EA4335" d="M24 10.8c4 0 6.6 1.7 8.1 3.1l5.9-5.8C34.5 4.7 29.7 3 24 3 15.7 3 8.6 8 5.3 14.8l6.7 5.2c1.7-5.1 6.4-8.8 12-8.8z" />
    </svg>
  );
}

export function StravaMark({ size = 18, color = "#ffffff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className="shrink-0">
      <path d="M13.8 1L7 14.4h4L13.8 9l2.8 5.4h4L13.8 1z" />
      <path d="M16.6 14.4L14.9 18l-1.7-3.6H10.4L14.9 23l4.5-8.6h-2.8z" opacity="0.6" />
    </svg>
  );
}
