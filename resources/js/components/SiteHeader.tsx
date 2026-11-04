import { Link } from '@inertiajs/react';
import { useState } from 'react';
import CartDrawer from './CartDrawer';
import SearchAutocomplete from './SearchAutocomplete';

const navLinks = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/about', label: 'О компании' },
  { href: '/delivery', label: 'Доставка' },
  { href: '/contacts', label: 'Контакты' },
];

export default function SiteHeader({ withSearch = true }: { withSearch?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-brand-dark text-white sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-display text-xl sm:text-2xl font-bold tracking-wider">
            РЕМЭЛЕМЕНТ
          </Link>

          <nav className="hidden md:flex space-x-8 text-sm font-medium uppercase tracking-wide">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-accent transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <a href="tel:+79513860392" className="hidden md:block text-accent font-semibold hover:text-white transition-colors">
              +7 951 386-03-92
            </a>
            <CartDrawer />

            {/* Бургер на мобильных */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 -mr-2 text-white hover:text-accent transition-colors"
              aria-label="Меню"
              aria-expanded={menuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Живой поиск — вторая строка шапки; на главной скрыт (есть в hero) */}
        {withSearch && (
          <div className="pb-3">
            <SearchAutocomplete />
          </div>
        )}
      </div>

      {/* Мобильное меню */}
      {menuOpen && (
        <nav className="md:hidden border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-3 rounded-lg font-medium uppercase tracking-wide text-sm hover:bg-white/10 hover:text-accent transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="tel:+79513860392"
              className="block px-3 py-3 rounded-lg font-semibold text-accent"
            >
              📞 +7 951 386-03-92
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
