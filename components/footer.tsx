import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] text-neutral-600 dark:text-neutral-400">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4 group hover:opacity-80 transition-opacity">
              {/* Light mode logo (hidden in dark mode) */}
              <Image 
                src="/assets/nav-logo-light.png" 
                alt="FundForge Logo" 
                width={160} 
                height={40} 
                className="h-6 md:h-8 w-auto object-contain dark:hidden drop-shadow-sm transition-all" 
              />
              {/* Dark mode logo (hidden in light mode) */}
              <Image 
                src="/assets/nav-logo-dark.png" 
                alt="FundForge Logo" 
                width={160} 
                height={40} 
                className="h-6 md:h-8 w-auto object-contain hidden dark:block transition-all" 
              />
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Empowering creators and backers to bring bold ideas to life. Dream big, fund bigger.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-emerald-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="hover:text-emerald-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-emerald-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="hover:text-emerald-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider text-sm">
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/explore" className="hover:text-emerald-500 transition-colors">All Campaigns</Link>
              </li>
              <li>
                <Link href="/categories/tech" className="hover:text-emerald-500 transition-colors">Technology</Link>
              </li>
              <li>
                <Link href="/categories/creative" className="hover:text-emerald-500 transition-colors">Creative</Link>
              </li>
              <li>
                <Link href="/categories/community" className="hover:text-emerald-500 transition-colors">Community</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider text-sm">
              Resources
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/help" className="hover:text-emerald-500 transition-colors">Help Center</Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-emerald-500 transition-colors">Creator Guidelines</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-emerald-500 transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-500 transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Start a Campaign */}
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider text-sm">
              Get Started
            </h3>
            <p className="text-sm mb-4">
              Have an idea you want to bring to the world? Start your campaign today.
            </p>
            <Link 
              href="/create" 
              className="inline-block px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
            >
              Start a Campaign
            </Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} FundForge Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-emerald-500 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-emerald-500 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
