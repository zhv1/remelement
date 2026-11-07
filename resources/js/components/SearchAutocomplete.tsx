import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

type Suggestion = {
  id: number;
  name: string;
  price: number;
  url: string;
  image: string | null;
};

const MIN_CHARS = 2;
const DEBOUNCE_MS = 250;

export default function SearchAutocomplete({
  onNavigate,
  autoFocus = false,
}: {
  onNavigate?: () => void;
  autoFocus?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  // Закрытие по клику вне блока
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Дебаунс + отмена предыдущего запроса
  useEffect(() => {
    const q = query.trim();
    window.clearTimeout(debounceRef.current);

    if (q.length < MIN_CHARS) return;

    debounceRef.current = window.setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);

      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
          headers: { Accept: 'application/json' },
        });
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
        setOpen(true);
      } catch {
        // запрос отменён новым вводом — игнорируем
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(debounceRef.current);
  }, [query]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setOpen(false);
    onNavigate?.();
    router.get('/catalog', q ? { search: q } : {});
  };

  const goTo = (url: string) => {
    setOpen(false);
    onNavigate?.();
    router.visit(url);
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={submit} role="search">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            // Мгновенно прячем подсказки, когда запрос стал коротким
            if (v.trim().length < MIN_CHARS) {
              setSuggestions([]);
              setOpen(false);
              setLoading(false);
            }
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
          placeholder="Поиск: название, артикул, бренд…"
          aria-label="Поиск по каталогу"
          autoComplete="off"
          autoFocus={autoFocus}
          className="w-full rounded-lg bg-white text-gray-900 placeholder-gray-400 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          {suggestions.length > 0 ? (
            <>
              <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                {suggestions.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => goTo(s.url)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left transition-colors"
                    >
                      <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        {s.image ? (
                          <img src={s.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">🔧</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium line-clamp-1">{s.name}</div>
                        <div className="text-sm font-bold text-accent">
                          {s.price.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={submit}
                className="w-full px-4 py-2.5 text-sm font-semibold text-accent hover:bg-gray-50 text-center border-t border-gray-100 transition-colors"
              >
                Все результаты →
              </button>
            </>
          ) : (
            !loading && (
              <div className="px-4 py-3 text-sm text-gray-500">
                Ничего не найдено. Попробуйте изменить запрос.
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
