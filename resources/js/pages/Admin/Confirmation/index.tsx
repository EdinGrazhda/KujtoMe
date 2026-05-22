import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertTriangle,
    Bell,
    CheckCircle2,
    ClipboardCheck,
    Plus,
    XCircle,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { CrudFilters, EmptyState, PageHeader, StatCard } from '@/components/crud';
import { ConfirmationCard, type ConfirmationRecord } from '@/components/ConfirmationCard';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Confirmations' },
];

export default function ConfirmationIndex() {
    const [confirmations, setConfirmations] = useState<ConfirmationRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        axios
            .get<ConfirmationRecord[]>('/api/confirmations')
            .then((r) => setConfirmations(r.data))
            .finally(() => setLoading(false));
    }, []);

    const filtered = confirmations.filter((c) => {
        const matchSearch = `${c.child?.name} ${c.child?.surname} ${c.vaccine?.name} ${c.parent?.name}`
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchStatus = statusFilter === '' || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const counts = {
        total: confirmations.length,
        missed: confirmations.filter((c) => c.status === 'missed').length,
        delayed: confirmations.filter((c) => c.status === 'delayed').length,
        upcoming: confirmations.filter((c) => c.status === 'upcoming').length,
        taken: confirmations.filter((c) => c.status === 'taken').length,
    };

    const handleStatusChange = (id: number, newStatus: ConfirmationRecord['status']) => {
        setConfirmations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
        );
    };

    const handleDelete = (id: number) => {
        axios
            .delete(`/api/confirmations/${id}`)
            .then(() => setConfirmations((prev) => prev.filter((c) => c.id !== id)));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Confirmations — No Child Missed" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Confirmations"
                    description="Track and manage all vaccination confirmations."
                    breadcrumb={breadcrumbs}
                    icon={ClipboardCheck}
                    actionLabel="Add Confirmation"
                    actionHref="/admin/confirmations/create"
                />

                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <StatCard title="Total" value={loading ? '—' : counts.total} description="All records" icon={ClipboardCheck} />
                    <StatCard title="Missed" value={loading ? '—' : counts.missed} description="Urgent" icon={XCircle} />
                    <StatCard title="Delayed" value={loading ? '—' : counts.delayed} description="Follow up" icon={AlertTriangle} />
                    <StatCard title="Upcoming" value={loading ? '—' : counts.upcoming} description="Scheduled" icon={Bell} />
                    <StatCard title="Taken" value={loading ? '—' : counts.taken} description="Completed" icon={CheckCircle2} />
                </div>

                {/* Filters + add button */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <CrudFilters
                        search={search}
                        onSearchChange={setSearch}
                        searchPlaceholder="Search by child, vaccine or parent..."
                        showStatusFilter
                        statusValue={statusFilter}
                        onStatusChange={setStatusFilter}
                        statusPlaceholder="All statuses"
                        statusOptions={[
                            { label: 'Pending', value: 'pending' },
                            { label: 'Upcoming', value: 'upcoming' },
                            { label: 'Delayed', value: 'delayed' },
                            { label: 'Missed', value: 'missed' },
                            { label: 'Taken', value: 'taken' },
                        ]}
                        total={confirmations.length}
                        filtered={filtered.length}
                    />
                    <Link
                        href="/admin/confirmations/create"
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Confirmation
                    </Link>
                </div>

                {/* Card list */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-20 animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800"
                            />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={ClipboardCheck}
                        title="No confirmations found"
                        description={
                            search || statusFilter
                                ? 'Try adjusting your filters.'
                                : 'Add the first confirmation to get started.'
                        }
                        actionLabel="Add Confirmation"
                        actionHref="/admin/confirmations/create"
                    />
                ) : (
                    <div className="space-y-3">
                        {filtered.map((conf) => (
                            <ConfirmationCard
                                key={conf.id}
                                confirmation={conf}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
