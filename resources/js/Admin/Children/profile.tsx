import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertTriangle,
    Baby,
    CheckCircle2,
    Clock,
    Droplets,
    Heart,
    MapPin,
    Stethoscope,
    Syringe,
    User,
    XCircle,
} from 'lucide-react';
import { ConfirmationCard } from '@/components/ConfirmationCard';
import type { ConfirmationRecord } from '@/components/ConfirmationCard';
import type { ConfirmationStatus } from '@/components/ConfirmationStepper';
import { HealthTimeline } from '@/components/HealthTimeline';
import type { TimelineItem } from '@/components/HealthTimeline';

type Child = {
    id: number;
    name: string;
    surname: string;
    gender?: string;
    blood_type?: string;
    birthday?: string;
    parent?: { id: number; name: string; surname: string; email?: string };
    doctor?: { id: number; name: string; surname: string };
};

interface Props {
    child: Child;
}

function buildTimeline(
    child: Child,
    confs: ConfirmationRecord[],
): TimelineItem[] {
    const items: TimelineItem[] = [];

    if (child.birthday) {
        items.push({
            id: 0,
            type: 'birth',
            date: child.birthday,
            title: 'Birth',
            description: `${child.name} ${child.surname} was born`,
        });
    }

    confs.forEach((c, i) => {
        items.push({
            id: 100 + i,
            type: 'vaccine',
            date: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .slice(0, 10),
            title: c.vaccine?.name ?? 'Vaccine',
            description: `Scheduled vaccination`,
            status: c.status,
            doctor: child.doctor
                ? `${child.doctor.name} ${child.doctor.surname}`
                : undefined,
        });
    });

    return items;
}

export default function ChildProfile({ child }: Props) {
    const [confirmations, setConfirmations] = useState<ConfirmationRecord[]>(
        [],
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get<ConfirmationRecord[]>('/api/confirmations')
            .then(({ data }) =>
                setConfirmations(data.filter((c) => c.child?.id === child.id)),
            )
            .catch(() => setConfirmations([]))
            .finally(() => setLoading(false));
    }, [child.id]);

    const handleStatusChange = (id: number, newStatus: ConfirmationStatus) => {
        setConfirmations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
        );
    };

    const timeline = buildTimeline(child, confirmations);

    const counts = {
        taken: confirmations.filter((c) => c.status === 'taken').length,
        missed: confirmations.filter((c) => c.status === 'missed').length,
        delayed: confirmations.filter((c) => c.status === 'delayed').length,
        total: confirmations.length,
    };
    const completion =
        counts.total > 0 ? Math.round((counts.taken / counts.total) * 100) : 0;
    const riskScore =
        counts.missed > 0 ? 'High' : counts.delayed > 0 ? 'Medium' : 'Low';

    return (
        <>
            <Head title={`${child.name} ${child.surname} — Profile`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Hero card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg">
                    <div className="absolute top-0 right-0 h-40 w-40 rounded-bl-full bg-white/10" />
                    <div className="absolute -right-4 -bottom-4 h-32 w-32 rounded-full bg-white/5" />

                    <div className="flex flex-wrap items-start gap-5">
                        {/* Avatar */}
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur-sm">
                            {child.name[0]}
                            {child.surname[0]}
                        </div>

                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">
                                {child.name} {child.surname}
                            </h1>
                            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-emerald-50">
                                {child.birthday && (
                                    <span className="flex items-center gap-1">
                                        <Baby className="h-3.5 w-3.5" /> Born{' '}
                                        {child.birthday}
                                    </span>
                                )}
                                {child.gender && (
                                    <span className="flex items-center gap-1">
                                        <User className="h-3.5 w-3.5" />{' '}
                                        {child.gender}
                                    </span>
                                )}
                                {child.blood_type && (
                                    <span className="flex items-center gap-1">
                                        <Droplets className="h-3.5 w-3.5" />{' '}
                                        {child.blood_type}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Risk badge */}
                        <div
                            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-bold backdrop-blur-sm ${
                                riskScore === 'High'
                                    ? 'bg-red-500/30 text-red-100'
                                    : riskScore === 'Medium'
                                      ? 'bg-amber-500/30 text-amber-100'
                                      : 'bg-emerald-200/30 text-emerald-100'
                            }`}
                        >
                            {riskScore} Risk
                        </div>
                    </div>

                    {/* Completion bar */}
                    <div className="mt-5">
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                            <span className="font-semibold text-emerald-100">
                                Vaccination Completion
                            </span>
                            <span className="font-bold">{completion}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/20">
                            <div
                                className="h-full rounded-full bg-white transition-all"
                                style={{ width: `${completion}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        {
                            icon: CheckCircle2,
                            label: 'Taken',
                            value: counts.taken,
                            color: 'text-emerald-600 bg-emerald-50',
                        },
                        {
                            icon: XCircle,
                            label: 'Missed',
                            value: counts.missed,
                            color: 'text-red-600 bg-red-50',
                        },
                        {
                            icon: AlertTriangle,
                            label: 'Delayed',
                            value: counts.delayed,
                            color: 'text-orange-600 bg-orange-50',
                        },
                        {
                            icon: Clock,
                            label: 'Total',
                            value: counts.total,
                            color: 'text-blue-600 bg-blue-50',
                        },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className={`flex items-center gap-3 rounded-2xl p-4 ${s.color}`}
                        >
                            <s.icon className="h-6 w-6 shrink-0" />
                            <div>
                                <p className="text-xl font-bold">{s.value}</p>
                                <p className="text-xs font-medium opacity-70">
                                    {s.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Parent & Doctor info */}
                <div className="grid gap-4 sm:grid-cols-2">
                    {child.parent && (
                        <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                                <User className="h-4 w-4" /> Parent / Guardian
                            </div>
                            <p className="font-bold text-neutral-800 dark:text-neutral-200">
                                {child.parent.name} {child.parent.surname}
                            </p>
                            {child.parent.email && (
                                <p className="text-sm text-neutral-400">
                                    {child.parent.email}
                                </p>
                            )}
                            <Link
                                href={`/admin/parents/${child.parent.id}/edit`}
                                className="inline-text mt-2 text-xs font-semibold text-emerald-600 hover:underline"
                            >
                                View profile →
                            </Link>
                        </div>
                    )}
                    {child.doctor && (
                        <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                                <Stethoscope className="h-4 w-4" /> Assigned
                                Doctor
                            </div>
                            <p className="font-bold text-neutral-800 dark:text-neutral-200">
                                Dr. {child.doctor.name} {child.doctor.surname}
                            </p>
                            <Link
                                href={`/admin/doctors/${child.doctor.id}/edit`}
                                className="inline-text mt-2 text-xs font-semibold text-emerald-600 hover:underline"
                            >
                                View profile →
                            </Link>
                        </div>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Confirmations */}
                    <div>
                        <h2 className="mb-3 flex items-center gap-2 font-bold text-neutral-900 dark:text-neutral-100">
                            <Syringe className="h-4 w-4 text-violet-500" />
                            Vaccination Confirmations
                        </h2>
                        {loading ? (
                            <div className="space-y-2">
                                {[1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className="h-16 animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800"
                                    />
                                ))}
                            </div>
                        ) : confirmations.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-neutral-200 py-12 text-center dark:border-neutral-800">
                                <Syringe className="h-8 w-8 text-neutral-300" />
                                <p className="text-sm text-neutral-400">
                                    No confirmations yet
                                </p>
                                <Link
                                    href="/admin/confirmations/create"
                                    className="text-xs font-semibold text-emerald-600 hover:underline"
                                >
                                    Add confirmation +
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {confirmations.map((c) => (
                                    <ConfirmationCard
                                        key={c.id}
                                        confirmation={c}
                                        onStatusChange={handleStatusChange}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <HealthTimeline items={timeline} />
                    </div>
                </div>
            </div>
        </>
    );
}

ChildProfile.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Children', href: '/admin/children' },
        { title: 'Profile', href: '#' },
    ],
};
