import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import {
    MapPin,
    MoreHorizontal,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Shield,
    Syringe,
    Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

type Vaccine = {
    id: number;
    code: string;
    name: string;
    protectsAgainst: string;
    recommended_age_months: string;
    image: string;
    description: string;
    vaccination_municipality: string;
    dose: string;
};

export default function Index() {
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios
            .get<Vaccine[]>('/api/vaccines')
            .then(({ data }) => setVaccines(data))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this vaccine?')) return;
        try {
            await axios.delete(`/api/vaccines/${id}`);
            setVaccines((prev) => prev.filter((v) => v.id !== id));
        } catch {
            alert('Failed to delete vaccine.');
        }
    };

    const filtered = vaccines.filter(
        (v) =>
            search === '' ||
            v.name.toLowerCase().includes(search.toLowerCase()) ||
            v.code.toLowerCase().includes(search.toLowerCase()) ||
            v.protectsAgainst.toLowerCase().includes(search.toLowerCase()) ||
            v.vaccination_municipality
                .toLowerCase()
                .includes(search.toLowerCase()),
    );

    const municipalities = [
        ...new Set(
            vaccines.map((v) => v.vaccination_municipality).filter(Boolean),
        ),
    ];

    return (
        <>
            <Head title="Vaccines" />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Vaccines
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage the vaccine catalogue for child preventive
                            care
                        </p>
                    </div>
                    <Link href="/admin/vaccines/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Add Vaccine
                        </Button>
                    </Link>
                </div>

                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Vaccines
                            </CardTitle>
                            <Syringe className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {loading ? '—' : vaccines.length}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                In catalogue
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Municipalities
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {loading ? '—' : municipalities.length}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Coverage areas
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Diseases Covered
                            </CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {loading
                                    ? '—'
                                    : new Set(
                                          vaccines.map(
                                              (v) => v.protectsAgainst,
                                          ),
                                      ).size}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Unique conditions
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="flex items-center gap-3">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, code or disease…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    {search && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearch('')}
                            className="gap-1.5"
                        >
                            <RotateCcw className="h-3.5 w-3.5" /> Reset
                        </Button>
                    )}
                    {!loading && (
                        <span className="ml-auto text-xs text-muted-foreground">
                            {filtered.length} of {vaccines.length} vaccines
                        </span>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border bg-card">
                    {loading ? (
                        <div className="space-y-3 p-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-14 animate-pulse rounded-xl bg-muted"
                                />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 border-2 border-dashed border-border py-16 text-center">
                            <Syringe className="h-10 w-10 text-muted-foreground/40" />
                            <div>
                                <p className="font-semibold text-muted-foreground">
                                    {search
                                        ? 'No vaccines match your search'
                                        : 'No vaccines in catalogue yet'}
                                </p>
                                {!search && (
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Add the first vaccine to get started.
                                    </p>
                                )}
                            </div>
                            {!search && (
                                <Link href="/admin/vaccines/create">
                                    <Button size="sm" className="gap-2">
                                        <Plus className="h-3.5 w-3.5" /> Add
                                        Vaccine
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40">
                                    {[
                                        'Vaccine',
                                        'Code',
                                        'Protects Against',
                                        'Rec. Age',
                                        'Municipality',
                                        'Dose',
                                        '',
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className={`px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase ${h === '' ? 'w-12' : 'text-left'}`}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filtered.map((v) => (
                                    <tr
                                        key={v.id}
                                        className="transition-colors hover:bg-muted/30"
                                    >
                                        {/* Vaccine name + description */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {v.image ? (
                                                    <img
                                                        src={`/storage/${v.image}`}
                                                        alt={v.name}
                                                        className="h-9 w-9 shrink-0 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                        <Syringe className="h-4 w-4 text-primary" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold">
                                                        {v.name}
                                                    </p>
                                                    <p className="line-clamp-1 max-w-[200px] text-xs text-muted-foreground">
                                                        {v.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Code */}
                                        <td className="px-4 py-3">
                                            <span className="rounded-md border bg-muted px-2 py-0.5 font-mono text-xs font-semibold">
                                                {v.code}
                                            </span>
                                        </td>
                                        {/* Protects against */}
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant="secondary"
                                                className="capitalize"
                                            >
                                                {v.protectsAgainst}
                                            </Badge>
                                        </td>
                                        {/* Recommended age */}
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {v.recommended_age_months} mo.
                                        </td>
                                        {/* Municipality */}
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <MapPin className="h-3 w-3 shrink-0" />
                                                {v.vaccination_municipality}
                                            </span>
                                        </td>
                                        {/* Dose */}
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {v.dose}
                                        </td>
                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-40"
                                                >
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/admin/vaccines/${v.id}/edit`}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />{' '}
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() =>
                                                            handleDelete(v.id)
                                                        }
                                                    >
                                                        <Trash2 className="mr-2 h-3.5 w-3.5" />{' '}
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Vaccines', href: '/admin/vaccines' },
    ],
};
