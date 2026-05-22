import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Confirmation = {
    id: number;
    status: 'pending' | 'upcoming' | 'delayed' | 'missed' | 'taken';
    vaccine?: { id: number; name: string; code: string };
};

type ChildWithStatus = {
    id: number;
    name: string;
    surname: string;
    confirmations?: Confirmation[];
};

type Parent = {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone_number: number;
    personal_number: string;
    children?: ChildWithStatus[];
};

const statusMeta: Record<
    Confirmation['status'],
    { label: string; className: string }
> = {
    taken: {
        label: 'Taken',
        className: 'bg-green-100 text-green-700 border-green-200',
    },
    pending: {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
    upcoming: {
        label: 'Upcoming',
        className: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    delayed: {
        label: 'Delayed',
        className: 'bg-orange-100 text-orange-700 border-orange-200',
    },
    missed: {
        label: 'Missed',
        className: 'bg-red-100 text-red-700 border-red-200',
    },
};

export default function Index() {
    const [parents, setParents] = useState<Parent[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios
            .get<Parent[]>('/api/parents')
            .then(({ data }) => setParents(data))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this parent?')) return;
        try {
            await axios.delete(`/api/parents/${id}`);
            setParents((prev) => prev.filter((p) => p.id !== id));
        } catch {
            alert('Failed to delete parent.');
        }
    };

    const hasActiveFilters = search !== '';

    const resetFilters = () => setSearch('');

    const filtered = parents.filter((p) => {
        return (
            search === '' ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.surname.toLowerCase().includes(search.toLowerCase()) ||
            p.email.toLowerCase().includes(search.toLowerCase())
        );
    });

    return (
        <>
            <Head title="Parents" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Parents
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {parents.length} registered{' '}
                            {parents.length === 1 ? 'parent' : 'parents'}
                        </p>
                    </div>
                    <Link href="/admin/parents/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Parent
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="space-y-3 rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Filters</span>
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                            >
                                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                                Reset
                            </Button>
                        )}
                    </div>
                    <div className="max-w-sm min-w-[220px] space-y-1.5">
                        <Label
                            htmlFor="search"
                            className="text-xs text-muted-foreground"
                        >
                            Search
                        </Label>
                        <Input
                            id="search"
                            placeholder="Search by name, surname or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border">
                    {loading ? (
                        <div className="py-16 text-center text-sm text-muted-foreground">
                            Loading...
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Surname
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Phone
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Personal No.
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Children &amp; Vaccine Status
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="py-12 text-center text-sm text-muted-foreground"
                                        >
                                            {hasActiveFilters
                                                ? 'No parents match the current filters.'
                                                : 'No parents registered yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((parent) => (
                                        <tr
                                            key={parent.id}
                                            className="border-b transition-colors last:border-0 hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {parent.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {parent.surname}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {parent.email}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                                {parent.phone_number}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                                {parent.personal_number}
                                            </td>
                                            <td className="px-4 py-3">
                                                {parent.children &&
                                                parent.children.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {parent.children.map(
                                                            (child) => {
                                                                const total =
                                                                    child
                                                                        .confirmations
                                                                        ?.length ??
                                                                    0;
                                                                const taken =
                                                                    child.confirmations?.filter(
                                                                        (c) =>
                                                                            c.status ===
                                                                            'taken',
                                                                    ).length ??
                                                                    0;
                                                                const needAttention =
                                                                    child.confirmations?.filter(
                                                                        (c) =>
                                                                            c.status ===
                                                                                'missed' ||
                                                                            c.status ===
                                                                                'delayed',
                                                                    ).length ??
                                                                    0;
                                                                return (
                                                                    <div
                                                                        key={
                                                                            child.id
                                                                        }
                                                                        className="rounded-lg border bg-muted/30 px-3 py-2"
                                                                    >
                                                                        <div className="flex items-center justify-between gap-2">
                                                                            <span className="text-sm font-semibold">
                                                                                {
                                                                                    child.name
                                                                                }{' '}
                                                                                {
                                                                                    child.surname
                                                                                }
                                                                            </span>
                                                                            {total >
                                                                                0 && (
                                                                                <span className="text-xs text-muted-foreground">
                                                                                    {
                                                                                        taken
                                                                                    }
                                                                                    /
                                                                                    {
                                                                                        total
                                                                                    }{' '}
                                                                                    taken
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {total >
                                                                        0 ? (
                                                                            <div className="mt-1.5 flex flex-wrap gap-1">
                                                                                {child
                                                                                    .confirmations!.slice(
                                                                                        0,
                                                                                        4,
                                                                                    )
                                                                                    .map(
                                                                                        (
                                                                                            conf,
                                                                                        ) => (
                                                                                            <span
                                                                                                key={
                                                                                                    conf.id
                                                                                                }
                                                                                                title={`${conf.vaccine?.name ?? 'Unknown'}: ${statusMeta[conf.status].label}`}
                                                                                                className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${statusMeta[conf.status].className}`}
                                                                                            >
                                                                                                {conf
                                                                                                    .vaccine
                                                                                                    ?.code ??
                                                                                                    '?'}
                                                                                            </span>
                                                                                        ),
                                                                                    )}
                                                                                {total >
                                                                                    4 && (
                                                                                    <span className="inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                                                                        +
                                                                                        {total -
                                                                                            4}
                                                                                    </span>
                                                                                )}
                                                                                {needAttention >
                                                                                    0 && (
                                                                                    <span className="ml-auto inline-flex items-center rounded-full border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">
                                                                                        {
                                                                                            needAttention
                                                                                        }{' '}
                                                                                        need
                                                                                        attention
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                                No
                                                                                vaccine
                                                                                records
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">
                                                        No children assigned
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/admin/parents/${parent.id}/edit`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() =>
                                                            handleDelete(
                                                                parent.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {!loading && hasActiveFilters && (
                    <p className="text-xs text-muted-foreground">
                        Showing {filtered.length} of {parents.length} parents
                    </p>
                )}
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Parents', href: '/admin/parents' },
    ],
};
