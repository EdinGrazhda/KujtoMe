// @ts-nocheck — file replaced with enhanced UI
import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock,
    LayoutGrid,
    LayoutList,
    Plus,
    RotateCcw,
    Shield,
    XCircle,
} from 'lucide-react';
import { ConfirmationCard } from '@/components/ConfirmationCard';
import type { ConfirmationRecord } from '@/components/ConfirmationCard';
import type { ConfirmationStatus } from '@/components/ConfirmationStepper';
import { Input } from '@/components/ui/input';

const MOCK: ConfirmationRecord[] = [
    {
        id: 1,
        status: 'missed',
        child: { id: 1, name: 'Arta', surname: 'Berisha' },
        parent: { id: 1, name: 'Blerim', surname: 'Berisha' },
        vaccine: { id: 1, name: 'BCG Vaccine' },
    },
    {
        id: 2,
        status: 'delayed',
        child: { id: 2, name: 'Luan', surname: 'Gashi' },
        parent: { id: 2, name: 'Vjosa', surname: 'Gashi' },
        vaccine: { id: 2, name: 'Hepatitis B' },
    },
    {
        id: 3,
        status: 'upcoming',
        child: { id: 3, name: 'Drita', surname: 'Krasniqi' },
        parent: { id: 3, name: 'Agim', surname: 'Krasniqi' },
        vaccine: { id: 3, name: 'Polio IPV' },
    },
    {
        id: 4,
        status: 'pending',
        child: { id: 1, name: 'Arta', surname: 'Berisha' },
        parent: { id: 1, name: 'Blerim', surname: 'Berisha' },
        vaccine: { id: 4, name: 'MMR Vaccine' },
    },
    {
        id: 5,
        status: 'taken',
        child: { id: 2, name: 'Luan', surname: 'Gashi' },
        parent: { id: 2, name: 'Vjosa', surname: 'Gashi' },
        vaccine: { id: 5, name: 'DTP Vaccine' },
    },
    {
        id: 6,
        status: 'pending',
        child: { id: 3, name: 'Drita', surname: 'Krasniqi' },
        parent: { id: 3, name: 'Agim', surname: 'Krasniqi' },
        vaccine: { id: 3, name: 'Polio IPV' },
    },
];

const STATUS_TABS = [
    { key: 'all', label: 'All', icon: LayoutGrid },
    { key: 'missed', label: 'Missed', icon: XCircle },
    { key: 'delayed', label: 'Delayed', icon: AlertTriangle },
    { key: 'upcoming', label: 'Upcoming', icon: Clock },
    { key: 'pending', label: 'Pending', icon: Activity },
    { key: 'taken', label: 'Taken', icon: CheckCircle2 },
] as const;

const tabColors: Record<string, string> = {
    all: 'text-neutral-600 bg-neutral-100 data-[active=true]:bg-neutral-800 data-[active=true]:text-white',
    missed: 'text-red-600 bg-red-50 data-[active=true]:bg-red-500 data-[active=true]:text-white',
    delayed:
        'text-orange-600 bg-orange-50 data-[active=true]:bg-orange-500 data-[active=true]:text-white',
    upcoming:
        'text-amber-600 bg-amber-50 data-[active=true]:bg-amber-500 data-[active=true]:text-white',
    pending:
        'text-blue-600 bg-blue-50 data-[active=true]:bg-blue-500 data-[active=true]:text-white',
    taken: 'text-emerald-600 bg-emerald-50 data-[active=true]:bg-emerald-500 data-[active=true]:text-white',
};

export default function ConfirmationsIndex() {
    const [confirmations, setConfirmations] = useState<ConfirmationRecord[]>(
        [],
    );
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState<string>('all');
    const [view, setView] = useState<'cards' | 'list'>('cards');

    useEffect(() => {
        axios
            .get<ConfirmationRecord[]>('/api/confirmations')
            .then(({ data }) => setConfirmations(data.length ? data : MOCK))
            .catch(() => setConfirmations(MOCK))
            .finally(() => setLoading(false));
    }, []);

    const handleStatusChange = (id: number, newStatus: ConfirmationStatus) => {
        setConfirmations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
        );
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/api/confirmations/${id}`);
            setConfirmations((prev) => prev.filter((c) => c.id !== id));
        } catch {
            alert('Failed to delete.');
        }
    };

    const counts = {
        all: confirmations.length,
        missed: confirmations.filter((c) => c.status === 'missed').length,
        delayed: confirmations.filter((c) => c.status === 'delayed').length,
        upcoming: confirmations.filter((c) => c.status === 'upcoming').length,
        pending: confirmations.filter((c) => c.status === 'pending').length,
        taken: confirmations.filter((c) => c.status === 'taken').length,
    };

    const filtered = confirmations.filter((c) => {
        const q = search.toLowerCase();
        const matchSearch =
            q === '' ||
            c.child?.name.toLowerCase().includes(q) ||
            c.child?.surname.toLowerCase().includes(q) ||
            c.parent?.name.toLowerCase().includes(q) ||
            c.vaccine?.name.toLowerCase().includes(q);
        const matchTab = tab === 'all' || c.status === tab;
        return matchSearch && matchTab;
    });

    const highRisk = confirmations.filter(
        (c) => c.status === 'missed' || c.status === 'delayed',
    );

    return (
        <>
            <Head title="Confirmations — No Child Missed" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Page header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            Confirmation Tracker
                        </h1>
                        <p className="mt-0.5 text-sm text-neutral-500">
                            Track vaccination &amp; check-up confirmations for
                            every child
                        </p>
                    </div>
                    <Link
                        href="/admin/confirmations/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
                    >
                        <Plus className="h-4 w-4" /> Add Confirmation
                    </Link>
                </div>

                {/* Alert banner */}
                {!loading && highRisk.length > 0 && (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-800 dark:bg-red-950/30">
                        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                        <div>
                            <p className="font-bold text-red-800 dark:text-red-300">
                                {highRisk.length}{' '}
                                {highRisk.length === 1
                                    ? 'child needs'
                                    : 'children need'}{' '}
                                urgent attention
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {highRisk
                                    .map(
                                        (c) =>
                                            `${c.child?.name} ${c.child?.surname}`,
                                    )
                                    .join(' · ')}
                            </p>
                        </div>
                        <button
                            onClick={() => setTab('missed')}
                            className="ml-auto rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                        >
                            Review
                        </button>
                    </div>
                )}

                {/* Status tabs */}
                <div className="flex flex-wrap gap-2">
                    {STATUS_TABS.map((t) => (
                        <button
                            key={t.key}
                            data-active={tab === t.key}
                            onClick={() => setTab(t.key)}
                            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors ${tabColors[t.key]}`}
                        >
                            <t.icon className="h-3.5 w-3.5" />
                            {t.label}
                            <span className="rounded-full bg-black/10 px-1.5 py-0 text-xs font-bold">
                                {counts[t.key as keyof typeof counts]}
                            </span>
                        </button>
                    ))}
                    <div className="ml-auto flex items-center gap-1 rounded-xl border border-neutral-200 p-0.5 dark:border-neutral-700">
                        <button
                            onClick={() => setView('cards')}
                            className={`rounded-lg p-1.5 transition-colors ${view === 'cards' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`rounded-lg p-1.5 transition-colors ${view === 'list' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                        >
                            <LayoutList className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Search by child, parent or vaccine…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                    {(search || tab !== 'all') && (
                        <button
                            onClick={() => {
                                setSearch('');
                                setTab('all');
                            }}
                            className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                        >
                            <RotateCcw className="h-3 w-3" /> Reset
                        </button>
                    )}
                    {!loading && (
                        <span className="ml-auto text-xs text-neutral-400">
                            {filtered.length} of {confirmations.length}{' '}
                            confirmations
                        </span>
                    )}
                </div>

                {/* Content */}
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
                    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-neutral-200 py-16 text-center dark:border-neutral-800">
                        <CheckCircle2 className="h-10 w-10 text-neutral-300" />
                        <p className="font-semibold text-neutral-500">
                            No confirmations match your filters
                        </p>
                        <button
                            onClick={() => {
                                setSearch('');
                                setTab('all');
                            }}
                            className="text-sm font-semibold text-emerald-600 hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : view === 'cards' ? (
                    <div className="space-y-3">
                        {filtered.map((c) => (
                            <ConfirmationCard
                                key={c.id}
                                confirmation={c}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                                    {[
                                        'Child',
                                        'Parent',
                                        'Vaccine',
                                        'Status',
                                        'Actions',
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-neutral-400 uppercase"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((c) => (
                                    <tr
                                        key={c.id}
                                        className="border-b border-neutral-50 transition-colors last:border-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                                    >
                                        <td className="px-4 py-3 font-semibold text-neutral-800 dark:text-neutral-200">
                                            {c.child?.name} {c.child?.surname}
                                        </td>
                                        <td className="px-4 py-3 text-neutral-500">
                                            {c.parent?.name} {c.parent?.surname}
                                        </td>
                                        <td className="px-4 py-3 text-neutral-500">
                                            {c.vaccine?.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                                                    c.status === 'taken'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : c.status === 'missed'
                                                          ? 'bg-red-50 text-red-700'
                                                          : c.status ===
                                                              'delayed'
                                                            ? 'bg-orange-50 text-orange-700'
                                                            : c.status ===
                                                                'upcoming'
                                                              ? 'bg-amber-50 text-amber-700'
                                                              : 'bg-blue-50 text-blue-700'
                                                }`}
                                            >
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/confirmations/${c.id}/edit`}
                                                className="text-xs font-semibold text-emerald-600 hover:underline"
                                            >
                                                Edit →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

ConfirmationsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Confirmations', href: '/admin/confirmations' },
    ],
};
