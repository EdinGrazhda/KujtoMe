import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertTriangle,
    Baby,
    Calendar,
    CheckCircle2,
    Clock,
    Droplets,
    Heart,
    Pencil,
    Stethoscope,
    Users,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader, StatusBadge } from '@/components/crud';
import type { BreadcrumbItem } from '@/types';

type Confirmation = {
    id: number;
    status: 'pending' | 'upcoming' | 'delayed' | 'missed' | 'taken';
    vaccine?: { id: number; name: string };
    parent?: { id: number; name: string; surname: string };
};

type ChildProfile = {
    id: number;
    name: string;
    surname: string;
    date_of_birth: string;
    gender: string;
    personal_number: number;
    blood_type: string;
    allergies?: string;
    chronic_diseases?: string;
    doctors?: { id: number; name: string; surname: string; email: string }[];
    parents?: { id: number; name: string; surname: string; email: string }[];
};

export default function ChildrenProfile({ child }: { child: ChildProfile }) {
    const [confirmations, setConfirmations] = useState<Confirmation[]>([]);
    const [loading, setLoading] = useState(true);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Children', href: '/admin/children' },
        { title: `${child.name} ${child.surname}` },
    ];

    useEffect(() => {
        axios
            .get<Confirmation[]>('/api/confirmations')
            .then((r) => {
                setConfirmations(
                    r.data.filter((c: any) => c.child_id === child.id),
                );
            })
            .finally(() => setLoading(false));
    }, [child.id]);

    const counts = {
        missed: confirmations.filter((c) => c.status === 'missed').length,
        delayed: confirmations.filter((c) => c.status === 'delayed').length,
        upcoming: confirmations.filter((c) => c.status === 'upcoming').length,
        taken: confirmations.filter((c) => c.status === 'taken').length,
    };

    const age = child.date_of_birth
        ? Math.floor(
              (Date.now() - new Date(child.date_of_birth).getTime()) /
                  (1000 * 60 * 60 * 24 * 365.25),
          )
        : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${child.name} ${child.surname} — No Child Missed`} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title={`${child.name} ${child.surname}`}
                    description="Child health profile and vaccination timeline."
                    breadcrumb={breadcrumbs}
                    icon={Baby}
                    actionLabel="Edit Profile"
                    actionHref={`/admin/children/${child.id}/edit`}
                />

                {/* Profile header card */}
                <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm dark:border-sky-900/30 dark:from-sky-950/20 dark:to-neutral-900">
                    <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-3xl bg-sky-100/50 dark:bg-sky-900/10" />
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-2xl font-bold text-white shadow-lg">
                            {child.name[0]}
                            {child.surname[0]}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                {child.name} {child.surname}
                            </h2>
                            <div className="mt-1 flex flex-wrap gap-3 text-sm text-neutral-500">
                                {age !== null && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {age} years old
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Droplets className="h-3.5 w-3.5 text-red-400" />
                                    {child.blood_type}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Heart className="h-3.5 w-3.5 text-pink-400" />
                                    {child.gender.charAt(0).toUpperCase() +
                                        child.gender.slice(1)}
                                </span>
                            </div>
                            {(child.allergies || child.chronic_diseases) && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {child.allergies && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                            <AlertTriangle className="h-3 w-3" />
                                            {child.allergies}
                                        </span>
                                    )}
                                    {child.chronic_diseases && (
                                        <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-300">
                                            {child.chronic_diseases}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        <Link
                            href={`/admin/children/${child.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-sky-700 shadow-sm transition-colors hover:bg-sky-50 dark:border-sky-800 dark:bg-neutral-900 dark:text-sky-300"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                        </Link>
                    </div>
                </div>

                {/* Vaccination stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                        </div>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            {loading ? '—' : counts.taken}
                        </p>
                        <p className="text-sm text-neutral-500">Taken</p>
                    </div>
                    <div className="rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                            <Clock className="h-4.5 w-4.5 text-amber-600" />
                        </div>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            {loading ? '—' : counts.upcoming}
                        </p>
                        <p className="text-sm text-neutral-500">Upcoming</p>
                    </div>
                    <div className="rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
                            <AlertTriangle className="h-4.5 w-4.5 text-orange-600" />
                        </div>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            {loading ? '—' : counts.delayed}
                        </p>
                        <p className="text-sm text-neutral-500">Delayed</p>
                    </div>
                    <div className="rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
                            <AlertTriangle className="h-4.5 w-4.5 text-red-600" />
                        </div>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            {loading ? '—' : counts.missed}
                        </p>
                        <p className="text-sm text-neutral-500">Missed</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Vaccination timeline */}
                    <div className="rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-sm lg:col-span-2 dark:border-neutral-800 dark:bg-neutral-900">
                        <h3 className="mb-4 font-bold text-neutral-900 dark:text-neutral-100">
                            Vaccination Timeline
                        </h3>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-14 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800"
                                    />
                                ))}
                            </div>
                        ) : confirmations.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No vaccination records found.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {confirmations.map((conf) => (
                                    <div
                                        key={conf.id}
                                        className="flex items-center gap-4 rounded-xl border border-neutral-100 p-3 dark:border-neutral-800"
                                    >
                                        <div
                                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                                                conf.status === 'taken'
                                                    ? 'bg-emerald-500'
                                                    : conf.status === 'missed'
                                                      ? 'bg-red-500'
                                                      : conf.status ===
                                                          'delayed'
                                                        ? 'bg-orange-500'
                                                        : conf.status ===
                                                            'upcoming'
                                                          ? 'bg-amber-400'
                                                          : 'bg-blue-400'
                                            }`}
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                                {conf.vaccine?.name ??
                                                    'Unknown vaccine'}
                                            </p>
                                            {conf.parent && (
                                                <p className="text-xs text-neutral-400">
                                                    Parent: {conf.parent.name}{' '}
                                                    {conf.parent.surname}
                                                </p>
                                            )}
                                        </div>
                                        <StatusBadge status={conf.status} />
                                        <Link
                                            href={`/admin/confirmations/${conf.id}/edit`}
                                            className="rounded-lg p-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Doctors & Parents panel */}
                    <div className="space-y-4">
                        {/* Doctors */}
                        <div className="rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-3 flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-violet-500" />
                                <h3 className="font-bold text-neutral-900 dark:text-neutral-100">
                                    Assigned Doctors
                                </h3>
                            </div>
                            {!child.doctors || child.doctors.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No doctors assigned.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {child.doctors.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center gap-2"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                                                {doc.name[0]}
                                                {doc.surname[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {doc.name} {doc.surname}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {doc.email}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Parents */}
                        <div className="rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-3 flex items-center gap-2">
                                <Users className="h-4 w-4 text-emerald-500" />
                                <h3 className="font-bold text-neutral-900 dark:text-neutral-100">
                                    Parents / Guardians
                                </h3>
                            </div>
                            {!child.parents || child.parents.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No parents registered.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {child.parents.map((parent) => (
                                        <div
                                            key={parent.id}
                                            className="flex items-center gap-2"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                                {parent.name[0]}
                                                {parent.surname[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {parent.name}{' '}
                                                    {parent.surname}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {parent.email}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
