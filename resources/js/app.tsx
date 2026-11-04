import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import type { ReactNode } from 'react';
import { CartProvider } from '@/contexts/CartContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob<{ default: ReactNode }>('./pages/**/*.tsx');
        const page = pages[`./pages/${name}.tsx`];
        if (!page) {
            throw new Error(`Inertia page not found: ./pages/${name}.tsx`);
        }
        return page();
    },

    progress: {
        color: 'oklch(var(--p))',
    },
	setup({ el, App, props }) {
		createRoot(el).render(
			<CartProvider>
				<App {...props} />
			</CartProvider>
  );
},
});
