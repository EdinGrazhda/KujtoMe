import { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Mail, Phone, Plus, Stethoscope, UserCheck, Users } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import {
    CrudFilters,
    DataTableCard,
    EmptyState,
    PageHeader,
    RowActions,
    StatCard,
    StatusBadge,
} from '@/components/crud';
import type { Auth } from '@/types/auth';
import type { BreadcrumbItem } from '@/types';

type Doctor = {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    status: 'pending' | 'missed';
    child?: { id: number; name: string; surname: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Doctors' },
];

export default function DoctorIndex() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const canViewDoctors = (auth.permissions ?? []).includes('Doctors_View');

    useEffect(() => {
        if (!canViewDoctors) {
            setLoading(false);
            return;
        }

        axios
            .get<Doctor[]>('/api/doctors')
            .then((r) => setDoctors(r.data))
            .finally(() => setLoading(false));
    }, [canViewDoctors]);

    const filtered = doctors.filter((d) => {
        const matchSearch = `${d.name} ${d.surname} ${d.email}`
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchStatus = statusFilter === '' || d.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleDelete = (id: number) => {
        if (!confirm('Delete this doctor?')) return;
        axios
            .delete(`/api/doctors/${id}`)
            .then(() => setDoctors((prev) => prev.filter((d) => d.id !== id)))
            .catch((error) => {
                if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 403
                ) {
                    alert('You do not have permission to delete doctors.');
                    return;
                }

                alert('Failed to delete doctor.');
            });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Doctors — No Child Missed" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Doctors"
                    description="Manage doctors assigned to children in the system."
                    breadcrumb={breadcrumbs}
                    icon={Stethoscope}
                    actionLabel="Add Doctor"
                    actionHref="/admin/doctors/create"
                />

                <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard
                        title="Total Doctors"
                        value={loading ? '—' : doctors.length}
                        description="Registered doctors"
                        icon={Stethoscope}
                    />
                    <StatCard
                        title="Active / Pending"
                        value={
                            loading
                                ? '—'
                                : doctors.filter((d) => d.status === 'pending')
                                      .length
                        }
                        description="Pending follow-up"
                        icon={UserCheck}
                    />
                    <StatCard
                        title="Children Covered"
                        value={
                            loading
                                ? '—'
                                : new Set(
                                      doctors
                                          .map((d) => d.child?.id)
                                          .filter(Boolean),
                                  ).size
                        }
                        description="Unique children"
                        icon={Users}
                    />
                </div>

                <DataTableCard
                    title="All Doctors"
                    description="Browse and manage doctor records."
                    headerAction={
                        <Link
                            href="/admin/doctors/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add Doctor
                        </Link>
                    }
                >
                    <div className="border-b px-5 py-4">
                        <CrudFilters
                            search={search}
                            onSearchChange={setSearch}
                            searchPlaceholder="Search by name or email…"
                            showStatusFilter
                            statusValue={statusFilter}
                            onStatusChange={setStatusFilter}
                            statusPlaceholder="All statuses"
                            statusOptions={[
                                { label: 'Pending', value: 'pending' },
                                { label: 'Missed', value: 'missed' },
                            ]}
                            total={doctors.length}
                            filtered={filtered.length}
                        />
                    </div>

                    {loading ? (
                        <div className="space-y-3 p-5">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-12 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800"
                                />
                            ))}
                        </div>
                    ) : !canViewDoctors ? (
                        <EmptyState
                            icon={Stethoscope}
                            title="No access to doctors"
                            description="Your account does not have permission to view doctors."
                            actionLabel="Go to dashboard"
                            actionHref="/dashboard"
                        />
                    ) : filtered.length === 0 ? (
                        <EmptyState
                            icon={Stethoscope}
                            title="No doctors found"
                            description={
                                search || statusFilter
                                    ? 'Try adjusting your filters.'
                                    : 'Add the first doctor to get started.'
                            }
                            actionLabel="Add Doctor"
                            actionHref="/admin/doctors/create"
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/30 text-xs font-medium text-muted-foreground">
                                        <th className="px-5 py-3 text-left">
                                            Doctor
                                        </th>
                                        <th className="px-5 py-3 text-left">
                                            Contact
                                        </th>
                                        <th className="px-5 py-3 text-left">
                                            Assigned Child
                                        </th>
                                        <th className="px-5 py-3 text-left">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filtered.map((doctor) => (
                                        <tr
                                            key={doctor.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                                                        {doctor.name[0]}
                                                        {doctor.surname[0]}
                                                    </div>
                                                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                        Dr. {doctor.name}{' '}
                                                        {doctor.surname}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Mail className="h-3 w-3 shrink-0" />
                                                        {doctor.email}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Phone className="h-3 w-3 shrink-0" />
                                                        {doctor.phone_number}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                {doctor.child ? (
                                                    <Link
                                                        href={`/admin/children/${doctor.child.id}/profile`}
                                                        className="text-sm font-medium text-sky-600 hover:underline"
                                                    >
                                                        {doctor.child.name}{' '}
                                                        {doctor.child.surname}
                                                    </Link>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3">
                                                <StatusBadge
                                                    status={doctor.status}
                                                />
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <RowActions
                                                    onEdit={() =>
                                                        (window.location.href = `/admin/doctors/${doctor.id}/edit`)
                                                    }
                                                    onDelete={() =>
                                                        handleDelete(doctor.id)
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </DataTableCard>
            </div>
        </AppLayout>
    );
}
