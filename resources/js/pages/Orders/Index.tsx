import type { ReactNode } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

interface OrderItem {
    id: number;
    name: string;
    price: string;
    quantity: number;
    subtotal: string;
}

interface Order {
    id: number;
    number: string;
    status: string;
    total: string;
    delivery_type: 'pickup' | 'delivery';
    created_at: string;
    items: OrderItem[];
}

interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    new: { label: 'Новый', className: 'badge-info' },
    processing: { label: 'В обработке', className: 'badge-warning' },
    ready: { label: 'Готов к выдаче', className: 'badge-success' },
    completed: { label: 'Выполнен', className: 'badge-success' },
    cancelled: { label: 'Отменён', className: 'badge-error' },
};

function statusBadge(status: string) {
    const s = STATUS_LABELS[status] ?? { label: status, className: 'badge-ghost' };
    return <span className={`badge ${s.className}`}>{s.label}</span>;
}

function formatDate(value: string) {
    return new Date(value).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function OrdersIndex({ orders }: { orders: Paginated<Order> }) {
    return (
        <>
            <Head title="Мои заказы" />
            <div className="p-6 space-y-6 max-w-6xl mx-auto">
                <h1 className="text-2xl font-semibold">Мои заказы</h1>

                {orders.data.length === 0 ? (
                    <div className="card bg-base-100 shadow">
                        <div className="card-body items-center text-center text-base-content/60">
                            <p>У вас пока нет заказов.</p>
                            <Link href="/catalog" className="btn btn-primary btn-sm mt-2">
                                Перейти в каталог
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.data.map((order) => (
                            <div key={order.id} className="card bg-base-100 shadow">
                                <div className="card-body p-5">
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                                        <div>
                                            <span className="font-semibold">{order.number}</span>
                                            <span className="text-base-content/60 text-sm ml-3">
                                                {formatDate(order.created_at)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {statusBadge(order.status)}
                                            <span className="font-semibold">
                                                {Number(order.total).toLocaleString('ru-RU')} ₽
                                            </span>
                                        </div>
                                    </div>
                                    <ul className="mt-3 space-y-1 text-sm">
                                        {order.items.map((item) => (
                                            <li key={item.id} className="flex justify-between gap-4">
                                                <span>
                                                    {item.name}{' '}
                                                    <span className="text-base-content/50">× {item.quantity}</span>
                                                </span>
                                                <span>{Number(item.subtotal).toLocaleString('ru-RU')} ₽</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-3 text-sm text-base-content/60">
                                        {order.delivery_type === 'pickup' ? 'Самовывоз' : 'Доставка транспортной компанией'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {orders.links.length > 3 && (
                    <div className="join">
                        {orders.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                preserveScroll
                                className={`join-item btn btn-sm ${link.active ? 'btn-active' : ''} ${!link.url ? 'btn-disabled' : ''}`}
                            >
                                {link.label.replace(/&laquo;|&raquo;/g, (m) => (m === '&laquo;' ? '«' : '»'))}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

OrdersIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
