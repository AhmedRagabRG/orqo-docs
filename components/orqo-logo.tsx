/**
 * The ORQO wordmark: teal on light backgrounds (orqo-logo.svg), white on
 * dark ones (orqo-logo-white.png), as in the app's sign-in screen.
 */
export function OrqoLogo({ className = 'h-6' }: { className?: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
      <img src="/brand/orqo-logo.svg" alt="ORQO" className={`${className} w-auto dark:hidden`} />
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
      <img src="/brand/orqo-logo-white.png" alt="ORQO" className={`${className} hidden w-auto dark:block`} />
    </>
  );
}
