import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Baby, Calendar, Droplets, Heart, Plus, UserCheck } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import {
    CrudFilters,
    DataTableCard,
    EmptyState,
    PageHeader,
    RowActions,
    StatCard,
} from '@/components/crud';
import type { BreadcrumbItem } from '@/types';

type Child = {
    id: number;
    name: string;
    surname: string;
    date_of_birth: string;
    gender: 'male' | 'female' | 'other';
    personal_number: number;
    blood_type: string;
    allergies?: string;
    chronic_diseases?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Children' },
];

export default function ChildrenIndex() {
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [genderFilter, setGenderFilter] = useState('');

    useEffect(() => {
        axios
            .get<Child[]>('/api/children')
            .then((r) => setChildren(r.data))
            .finally(() => setLoading(false));
    }, []);

    const filtered = children.filter((c) => {
        const matchSearch =
            `${c.name} ${c.surname}`
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            String(c.personal_number).includes(search);
        const matchGender = genderFilter === '' || c.gender === genderFilter;
        return matchSearch && matchGender;
    });

    const genderCounts = {
        male: children.filter((c) => c.gender === 'male').length,
        female: children.filter((c) => c.gender === 'female').length,
        other: children.filter((c) => c.gender === 'other').length,
    };

    const handleDelete = (id: number) => {
        if (!confirm('Delete this child record?')) return;
        axios.delete(`/api/children/${id}`).then(() => {
            setChildren((prev) => prev.filter((c) => c.id !== id));
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Children — No Child Missed" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Children"
                    description="Manage registered child profiles and their health records."
                    breadcrumb={breadcrumbs}
                    icon={Baby}
                    actionLabel="Add Child"
                    actionHref="/admin/children/create"
                />

                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Children"
                        value={loading ? '—' : children.length}
                        description="Registered profiles"
                        icon={Baby}
                    />
                    <StatCard
                        title="Male"
                        value={loading ? '—' : genderCounts.male}
                        description="Male children"
                        icon={UserCheck}
                    />
                    <StatCard
                        title="Female"
                        value={loading ? '—' : genderCounts.female}
                        description="Female children"
                        icon={Heart}
                    />
                    <StatCard
                        title="With Allergies"
                        value={
                            loading
                                ? '—'
                                : children.filter((c) => c.allergies).length
                        }
                        description="Need special attention"
                        icon={Droplets}
                    />
                </div>

                {/* Table */}
                <DataTableCard
                    title="All Children"
                    description="Browse, search and manage child profiles."
                    headerAction={
                        <Link
                            href="/admin/children/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add Child
                        </Link>
                    }
                >
                    <div className="border-b px-5 py-4">
                        <CrudFilters
                            search={search}
                            onSearchChange={setSearch}
                            searchPlaceholder="Search by name or ID…"
                            showStatusFilter
                            statusValue={genderFilter}
                            onStatusChange={setGenderFilter}
                            statusPlaceholder="All genders"
                            statusOptions={[
                                { label: 'Male', value: 'male' },
                                { label: 'Female', value: 'female' },
                                { label: 'Other', value: 'other' },
                            ]}
                            total={children.length}
                            filtered={filtered.length}
                        />
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
                    ) : filtered.length === 0 ? (
                        <EmptyState
                            icon={Baby}
                            title="No children found"
                            description={
                                search || genderFilter
                                    ? 'Try adjusting your filters.'
                                    : 'Get started by adding the first child profile.'
                            }
                            actionLabel="Add Child"
                            actionHref="/admin/children/create"
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/30 text-xs font-medium text-muted-foreground">
                                        <th className="px-5 py-3 text-left">
                                            Child
                                        </th>
                                        <th className="px-5 py-3 text-left">
                                            Date of Birth
                                        </th>
                                        <th className="px-5 py-3 text-left">
                                            Gender
                                        </th>
                                        <th className="px-5 py-3 text-left">
                                            Blood Type
                                        </th>
                                        <th className="px-5 py-3 text-left">
                                            Personal No.
                                        </th>
                                        <th className="px-5 py-3 text-left">
                                            Allergies
                                        </th>
                                        <th className="px-5 py-3 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filtered.map((child) => (
                                        <tr
                                            key={child.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                                                        {child.name?.[0] ?? ''}
                                                        {child.surname?.[0] ??
                                                            ''}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                            {child.name}{' '}
                                                            {child.surname}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                                                    {child.date_of_birth
                                                        ? new Date(
                                                              child.date_of_birth,
                                                          ).toLocaleDateString()
                                                        : '—'}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${child.gender === 'male' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''} ${child.gender === 'female' ? 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' : ''} ${child.gender === 'other' ? 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' : ''} `}
                                                >
                                                    {child.gender
                                                        ? child.gender
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          child.gender.slice(1)
                                                        : '—'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Droplets className="h-3.5 w-3.5 shrink-0 text-red-400" />
                                                    <span className="font-medium">
                                                        {child.blood_type}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-muted-foreground">
                                                {child.personal_number}
                                            </td>
                                            <td className="px-5 py-3">
                                                {child.allergies ? (
                                                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                                        {child.allergies}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">
                                                        None
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <RowActions
                                                    onView={() =>
                                                        (window.location.href = `/admin/children/${child.id}/profile`)
                                                    }
                                                    onEdit={() =>
                                                        (window.location.href = `/admin/children/${child.id}/edit`)
                                                    }
                                                    onDelete={() =>
                                                        handleDelete(child.id)
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
