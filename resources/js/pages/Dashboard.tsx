import type { ReactNode } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

interface AuthUser {
    name: string;
    email: string;
}

interface SharedProps {
    auth: { user: AuthUser | null };
    [key: string]: unknown;
}

export default function Dashboard() {
    const { auth } = usePage<SharedProps>().props;

    return (
        <>
            <Head title="Dashboard" />
            <div className="p-6 space-y-6 max-w-6xl mx-auto">
                <div>
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <p className="text-base-content/70 text-sm">
                        Welcome back{auth.user ? `, ${auth.user.name}` : ''}.
                    </p>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Link href="/my-orders" className="card bg-base-100 shadow hover:shadow-md transition-shadow">
                        <div className="card-body">
                            <h2 className="card-title text-lg">Мои заказы</h2>
                            <p className="text-base-content/60 text-sm">История и статусы ваших заказов</p>
                        </div>
                    </Link>
                    <Link href="/catalog" className="card bg-base-100 shadow hover:shadow-md transition-shadow">
                        <div className="card-body">
                            <h2 className="card-title text-lg">Каталог</h2>
                            <p className="text-base-content/60 text-sm">Запчасти, шины и диски в наличии</p>
                        </div>
                    </Link>
                    <Link href="/settings/profile" className="card bg-base-100 shadow hover:shadow-md transition-shadow">
                        <div className="card-body">
                            <h2 className="card-title text-lg">Профиль</h2>
                            <p className="text-base-content/60 text-sm">Контактные данные и настройки</p>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
