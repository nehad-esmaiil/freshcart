import Link from 'next/link';

export default function AccountHeader() {
  return (
    <div className="bg-linear-to-br from-[#16a34a] via-[#22c55e] to-[#4ade80] font-medium text-white [font-family:var(--font-exo)]">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-white/70">
          <Link href="/" className="transition-colors duration-200 hover:text-white">Home</Link>
          <span className="text-white/40">/</span>
          <span className="font-medium text-white">My Account</span>
        </nav>
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 backdrop-blur-sm">
            <svg aria-hidden="true" viewBox="0 0 448 512" fill="currentColor" className="h-[1em] w-[0.875em] text-3xl">
              <path d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Account</h1>
            <p className="mt-1 text-white/80">Manage your addresses and account settings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
