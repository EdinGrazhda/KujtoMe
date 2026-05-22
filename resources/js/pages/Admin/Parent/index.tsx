import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Baby, Mail, Phone, Plus, UserCheck, Users } from 'lucide-react';
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

type Parent = {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    personal_number: string;
    children?: { id: number; name: string; surname: string }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Parents' },
];

export default function ParentIndex() {
    const [parents, setParents] = useState<Parent[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios
            .get<Parent[]>('/api/parents')
            .then((r) => setParents(r.data))
            .finally(() => setLoading(false));
    }, []);

    const filtered = parents.filter((p) =>
        `${p.name} ${p.surname} ${p.email}`
            .toLowerCase()
            .includes(search.toLowerCase()),
    );

    const handleDelete = (id: number) => {
        if (!confirm('Delete this parent?')) return;
        axios
            .delete(`/api/parents/${id}`)
            .then(() => setParents((prev) => prev.filter((p) => p.id !== id)));
    };

    const totalChildren = parents.reduce(
        (sum, p) => sum + (p.children?.length ?? 0),
        0,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Parents — No Child Missed" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Parents"
                    description="Manage parent and guardian records linked to children."
                    breadcrumb={breadcrumbs}
                    icon={Users}
                    actionLabel="Add Parent"
                    actionHref="/admin/parents/create"
                />

                <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard
                        title="Total Parents"
                        value={loading ? '—' : parents.length}
                        description="Registered guardians"
                        icon={Users}
                    />
                    <StatCard
                        title="Children Linked"
                        value={loading ? '—' : totalChildren}
                        description="Across all parents"
                        icon={Baby}
                    />
                    <StatCard
                        title="Avg. Children"
                        value={
                            loading
                                ? '—'
                                : parents.length > 0
                                  ? (totalChildren / parents.length).toFixed(1)
                                  : 0
                        }
                        description="Per parent"
                        icon={UserCheck}
                    />
                </div>

                <DataTableCard
                    title="All Parents"
                    description="Browse and manage parent records."
                    headerAction={
                        <Link
                            href="/admin/parents/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add Parent
                        </Link>
                    }
                >
                    <div className="border-b px-5 py-4">
                        <CrudFilters
                            search={search}
                            onSearchChange={setSearch}
                            searchPlaceholder="Search by name or email…"
                            total={parents.length}
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
                    ) : filtered.length === 0 ? (
                        <EmptyState
                            icon={Users}
                            title="No parents found"
                            description={
                                search
                                    ? 'Try adjusting your search.'
                                    : 'Add the first parent to get started.'
                            }
                            actionLabel="Add Parent"
                            actionHref="/admin/parents/create"
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/30 text-xs font-medium text-muted-foreground">
                                        <th className="px-5 py-3 text-left">
                                            Parent
                                        </th>
                                        <th className="px-5 py-3 text-left">
                                            Contact
                                        </th>
                                        <th className="px-5 py-3 text-left">
                                            Personal No.
                                        </th>
                                        <th className="px-5 py-3 text-left">
                                            Children
                                        </th>
                                        <th className="px-5 py-3 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filtered.map((parent) => (
                                        <tr
                                            key={parent.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                        {parent.name[0]}
                                                        {parent.surname[0]}
                                                    </div>
                                                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                        {parent.name}{' '}
                                                        {parent.surname}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Mail className="h-3 w-3 shrink-0" />
                                                        {parent.email}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Phone className="h-3 w-3 shrink-0" />
                                                        {parent.phone_number}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-sm text-muted-foreground">
                                                {parent.personal_number}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {parent.children &&
                                                    parent.children.length >
                                                        0 ? (
                                                        parent.children
                                                            .slice(0, 3)
                                                            .map((c) => (
                                                                <Link
                                                                    key={c.id}
                                                                    href={`/admin/children/${c.id}/profile`}
                                                                    className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-300"
                                                                >
                                                                    {c.name}
                                                                </Link>
                                                            ))
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">
                                                            —
                                                        </span>
                                                    )}
                                                    {parent.children &&
                                                        parent.children.length >
                                                            3 && (
                                                            <span className="text-xs text-muted-foreground">
                                                                +
                                                                {parent.children
                                                                    .length - 3}
                                                            </span>
                                                        )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <RowActions
                                                    onEdit={() =>
                                                        (window.location.href = `/admin/parents/${parent.id}/edit`)
                                                    }
                                                    onDelete={() =>
                                                        handleDelete(parent.id)
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
