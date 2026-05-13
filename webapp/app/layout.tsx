import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = { title: "EMTD Hero Animation Studio" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-border bg-panel">
          <div className="mx-auto max-w-[1600px] px-6 py-3 flex items-center gap-6">
            <Link href="/" className="text-text font-semibold tracking-tight">
              EMTD <span className="text-accent">Hero Studio</span>
            </Link>
            <nav className="flex gap-4 text-sm text-muted">
              <Link href="/" className="hover:text-text">Heroes</Link>
              <Link href="/jobs" className="hover:text-text">Jobs</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-[1600px] px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
