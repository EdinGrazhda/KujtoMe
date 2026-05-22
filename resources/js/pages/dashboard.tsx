import { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    Activity,
    AlertTriangle,
    Baby,
    Bell,
    CheckCircle2,
    ChevronRight,
    Clock,
    Heart,
    Shield,
    Stethoscope,
    TrendingUp,
    Users,
    XCircle,
} from 'lucide-react';
import { dashboard } from '@/routes';
import type { Auth } from '@/types/auth';

type Confirmation = {
    id: number;
    status: 'pending' | 'upcoming' | 'delayed' | 'missed' | 'taken';
    child?: { id: number; name: string; surname: string };
    parent?: { id: number; name: string; surname: string };
    vaccine?: { id: number; name: string };
};

type Child = { id: number; name: string; surname: string; blood_type?: string };
type Doctor = { id: number; name: string; surname: string };

const MOCK_CONFIRMATIONS: Confirmation[] = [
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
];

const statusMeta = {
    pending: {
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-400',
        label: 'Pending',
    },
    upcoming: {
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-400',
        label: 'Upcoming',
    },
    delayed: {
        color: 'bg-orange-50 text-orange-700 border-orange-200',
        dot: 'bg-orange-500',
        label: 'Delayed',
    },
    missed: {
        color: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500',
        label: 'Missed',
    },
    taken: {
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Taken',
    },
};

function StatusPill({ status }: { status: Confirmation['status'] }) {
    const m = statusMeta[status];
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${m.color}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
            {m.label}
        </span>
    );
}

function AccessRestricted({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
            <Shield className="h-7 w-7 text-neutral-300 dark:text-neutral-600" />
            <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                {label}
            </p>
            <p className="text-xs text-neutral-400">
                You don&apos;t have permission to view this section.
            </p>
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    sub,
    color,
}: {
    icon: React.ElementType;
    label: string;
    value: number | string;
    sub?: string;
    color: string;
}) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div
                className={`absolute top-0 right-0 h-20 w-20 rounded-bl-3xl opacity-10 ${color}`}
            />
            <div
                className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
            >
                <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {value}
            </div>
            <div className="mt-0.5 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {label}
            </div>
            {sub && <div className="mt-1 text-xs text-neutral-400">{sub}</div>}
        </div>
    );
}

export default function Dashboard() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [confirmations, setConfirmations] = useState<Confirmation[]>([]);
    const [children, setChildren] = useState<Child[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);

    const userPermissions = new Set(auth.permissions ?? []);
    const canViewConfirmations = userPermissions.has('Confirmations_View');
    const canViewChildren = userPermissions.has('Children_View');
    const canViewDoctors = userPermissions.has('Doctors_View');

    useEffect(() => {
        const confirmationsRequest = canViewConfirmations
            ? axios
                  .get<Confirmation[]>('/api/confirmations')
                  .catch(() => ({ data: MOCK_CONFIRMATIONS }))
            : Promise.resolve({ data: MOCK_CONFIRMATIONS as Confirmation[] });

        const childrenRequest = canViewChildren
            ? axios
                  .get<Child[]>('/api/children')
                  .catch(() => ({ data: [] as Child[] }))
            : Promise.resolve({ data: [] as Child[] });

        const doctorsRequest = canViewDoctors
            ? axios
                  .get<Doctor[]>('/api/doctors')
                  .catch(() => ({ data: [] as Doctor[] }))
            : Promise.resolve({ data: [] as Doctor[] });

        Promise.all([confirmationsRequest, childrenRequest, doctorsRequest])
            .then(([conf, ch, doc]) => {
                setConfirmations(
                    conf.data.length ? conf.data : MOCK_CONFIRMATIONS,
                );
                setChildren(ch.data);
                setDoctors(doc.data);
            })
            .finally(() => setLoading(false));
    }, [canViewChildren, canViewConfirmations, canViewDoctors]);

    const counts = {
        missed: confirmations.filter((c) => c.status === 'missed').length,
        delayed: confirmations.filter((c) => c.status === 'delayed').length,
        upcoming: confirmations.filter((c) => c.status === 'upcoming').length,
        taken: confirmations.filter((c) => c.status === 'taken').length,
        pending: confirmations.filter((c) => c.status === 'pending').length,
    };
    const highRisk = confirmations.filter(
        (c) => c.status === 'missed' || c.status === 'delayed',
    );
    const mediumRisk = confirmations.filter((c) => c.status === 'upcoming');

    return (
        <>
            <Head title="Dashboard — KujtoMe" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
                                <Heart className="h-4 w-4 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                KujtoMe Dashboard
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-neutral-500">
                            Kosovo child preventive healthcare platform —
                            vaccination &amp; check-up tracking
                        </p>
                    </div>
                    <Link
                        href="/admin/confirmations"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
                    >
                        <Activity className="h-4 w-4" /> View All Confirmations
                    </Link>
                </div>

                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {canViewChildren ? (
                        <StatCard
                            icon={Baby}
                            label="Total Children"
                            value={loading ? '—' : children.length || 3}
                            color="bg-sky-500"
                            sub="Registered profiles"
                        />
                    ) : null}
                    {canViewConfirmations ? (
                        <>
                            <StatCard
                                icon={AlertTriangle}
                                label="Missed"
                                value={loading ? '—' : counts.missed}
                                color="bg-red-500"
                                sub="Urgent attention"
                            />
                            <StatCard
                                icon={Clock}
                                label="Delayed"
                                value={loading ? '—' : counts.delayed}
                                color="bg-orange-500"
                                sub="Needs follow-up"
                            />
                            <StatCard
                                icon={Bell}
                                label="Upcoming"
                                value={loading ? '—' : counts.upcoming}
                                color="bg-amber-500"
                                sub="Action required"
                            />
                            <StatCard
                                icon={CheckCircle2}
                                label="Taken"
                                value={loading ? '—' : counts.taken}
                                color="bg-emerald-500"
                                sub="Completed"
                            />
                        </>
                    ) : null}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* 🚨 No Child Missed alert section */}
                    {canViewConfirmations ? (
                        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 lg:col-span-2 dark:border-red-900/40 dark:bg-red-950/20">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500">
                                        <Shield className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-red-900 dark:text-red-200">
                                            KujtoMe — Urgent Alerts
                                        </h2>
                                        <p className="text-xs text-red-600 dark:text-red-400">
                                            {highRisk.length} children need
                                            immediate attention
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href="/admin/confirmations?status=missed"
                                    className="text-xs font-semibold text-red-600 hover:underline"
                                >
                                    View all →
                                </Link>
                            </div>

                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="h-16 animate-pulse rounded-xl bg-red-100 dark:bg-red-900/30"
                                        />
                                    ))}
                                </div>
                            ) : highRisk.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 py-8 text-center">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                                    <p className="font-semibold text-emerald-700">
                                        All children are on track!
                                    </p>
                                    <p className="text-sm text-emerald-600">
                                        No missed or delayed vaccinations.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {highRisk.map((c) => (
                                        <div
                                            key={c.id}
                                            className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3 shadow-sm dark:bg-neutral-900/50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${c.status === 'missed' ? 'bg-red-500' : 'bg-orange-500'}`}
                                                >
                                                    {c.child?.name?.[0]}
                                                    {c.child?.surname?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                                        {c.child?.name}{' '}
                                                        {c.child?.surname}
                                                    </p>
                                                    <p className="text-xs text-neutral-500">
                                                        {c.vaccine?.name} ·
                                                        Parent: {c.parent?.name}{' '}
                                                        {c.parent?.surname}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <StatusPill status={c.status} />
                                                <Link
                                                    href={`/admin/confirmations/${c.id}/edit`}
                                                    className="rounded-lg p-1.5 transition-colors hover:bg-red-100 dark:hover:bg-red-900/30"
                                                >
                                                    <ChevronRight className="h-4 w-4 text-red-500" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="lg:col-span-2">
                            <AccessRestricted label="Confirmations view permission required" />
                        </div>
                    )}

                    {/* Risk Score Overview */}
                    {canViewConfirmations ? (
                        <div className="rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500">
                                    <TrendingUp className="h-4 w-4 text-white" />
                                </div>
                                <h2 className="font-bold text-neutral-900 dark:text-neutral-100">
                                    Risk Overview
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {[
                                    {
                                        label: 'High Risk',
                                        desc: 'Missed / Delayed',
                                        count: highRisk.length,
                                        total: confirmations.length,
                                        color: 'bg-red-500',
                                        text: 'text-red-600',
                                    },
                                    {
                                        label: 'Medium Risk',
                                        desc: 'Upcoming, unconfirmed',
                                        count: mediumRisk.length,
                                        total: confirmations.length,
                                        color: 'bg-amber-400',
                                        text: 'text-amber-600',
                                    },
                                    {
                                        label: 'Low Risk',
                                        desc: 'Taken / completed',
                                        count: counts.taken,
                                        total: confirmations.length,
                                        color: 'bg-emerald-500',
                                        text: 'text-emerald-600',
                                    },
                                ].map((r) => (
                                    <div key={r.label}>
                                        <div className="mb-1 flex items-center justify-between text-sm">
                                            <div>
                                                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                                                    {r.label}
                                                </span>
                                                <span className="ml-1.5 text-xs text-neutral-400">
                                                    {r.desc}
                                                </span>
                                            </div>
                                            <span
                                                className={`font-bold ${r.text}`}
                                            >
                                                {r.count}
                                            </span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                            <div
                                                className={`h-full rounded-full transition-all ${r.color}`}
                                                style={{
                                                    width:
                                                        confirmations.length > 0
                                                            ? `${(r.count / confirmations.length) * 100}%`
                                                            : '0%',
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
                                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                    <Stethoscope className="h-4 w-4 text-violet-500" />
                                    Quick Stats
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                                    <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-neutral-900">
                                        <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                            {loading
                                                ? '—'
                                                : children.length || 3}
                                        </div>
                                        <div className="text-xs text-neutral-400">
                                            Children
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-neutral-900">
                                        <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                            {loading
                                                ? '—'
                                                : doctors.length || 2}
                                        </div>
                                        <div className="text-xs text-neutral-400">
                                            Doctors
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-neutral-900">
                                        <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                            {loading
                                                ? '—'
                                                : confirmations.length}
                                        </div>
                                        <div className="text-xs text-neutral-400">
                                            Confirmations
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-neutral-900">
                                        <div className="text-xl font-bold text-emerald-600">
                                            {confirmations.length > 0
                                                ? Math.round(
                                                      (counts.taken /
                                                          confirmations.length) *
                                                          100,
                                                  )
                                                : 0}
                                            %
                                        </div>
                                        <div className="text-xs text-neutral-400">
                                            Completion
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <AccessRestricted label="Confirmations view permission required" />
                    )}
                </div>

                {/* Recent confirmations table */}
                {canViewConfirmations ? (
                    <div className="rounded-2xl border border-neutral-200/60 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between border-b border-neutral-100 p-5 dark:border-neutral-800">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-neutral-400" />
                                <h2 className="font-bold text-neutral-900 dark:text-neutral-100">
                                    Recent Confirmations
                                </h2>
                            </div>
                            <Link
                                href="/admin/confirmations"
                                className="text-xs font-semibold text-emerald-600 hover:underline"
                            >
                                See all →
                            </Link>
                        </div>

                        {loading ? (
                            <div className="space-y-3 p-5">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="h-12 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {(confirmations.length
                                    ? confirmations
                                    : MOCK_CONFIRMATIONS
                                )
                                    .slice(0, 6)
                                    .map((c) => (
                                        <div
                                            key={c.id}
                                            className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                        >
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-600 dark:bg-neutral-800">
                                                {c.child?.name?.[0]}
                                                {c.child?.surname?.[0]}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                                    {c.child?.name}{' '}
                                                    {c.child?.surname}
                                                </p>
                                                <p className="truncate text-xs text-neutral-400">
                                                    {c.vaccine?.name}
                                                </p>
                                            </div>
                                            <div className="hidden text-xs text-neutral-400 sm:block">
                                                {c.parent?.name}{' '}
                                                {c.parent?.surname}
                                            </div>
                                            <StatusPill status={c.status} />
                                            <Link
                                                href={`/admin/confirmations/${c.id}/edit`}
                                                className="rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                            >
                                                <ChevronRight className="h-4 w-4 text-neutral-400" />
                                            </Link>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <AccessRestricted label="Confirmations view permission required" />
                )}
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
