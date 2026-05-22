import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { MoreHorizontal, Pencil, Plus, RotateCcw, Search, ShieldCheck, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
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

type Role = {
    id: number;
    name: string;
    permissions: string[];
};

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/admin/roles' },
];

export default function RolesIndex() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios
            .get<Role[]>('/api/roles')
            .then(({ data }) => setRoles(data))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this role?')) return;
        try {
            await axios.delete(`/api/roles/${id}`);
            setRoles((prev) => prev.filter((r) => r.id !== id));
        } catch {
            alert('Failed to delete role.');
        }
    };

    const filtered = roles.filter(
        (r) =>
            search === '' ||
            r.name.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Roles</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage roles and their permissions
                        </p>
                    </div>
                    <Link href="/admin/roles/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Add Role
                        </Button>
                    </Link>
                </div>

                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Roles
                            </CardTitle>
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{loading ? '—' : roles.length}</p>
                            <p className="mt-1 text-xs text-muted-foreground">Defined roles</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Permissions
                            </CardTitle>
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {loading
                                    ? '—'
                                    : new Set(roles.flatMap((r) => r.permissions)).size}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">Unique permissions</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="flex items-center gap-3">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search roles…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    {search && (
                        <Button variant="ghost" size="sm" onClick={() => setSearch('')} className="gap-1.5">
                            <RotateCcw className="h-3.5 w-3.5" /> Reset
                        </Button>
                    )}
                    {!loading && (
                        <span className="ml-auto text-xs text-muted-foreground">
                            {filtered.length} of {roles.length} roles
                        </span>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border bg-card">
                    {loading ? (
                        <div className="space-y-3 p-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
                            <ShieldCheck className="h-10 w-10 opacity-30" />
                            <p className="text-sm">No roles found</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Permissions
                                    </th>
                                    <th className="w-12 px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filtered.map((role) => (
                                    <tr key={role.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-4 py-3 font-medium">{role.name}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {role.permissions.length === 0 ? (
                                                    <span className="text-xs text-muted-foreground">
                                                        No permissions
                                                    </span>
                                                ) : (
                                                    role.permissions.map((p) => (
                                                        <Badge key={p} variant="secondary" className="text-xs">
                                                            {p}
                                                        </Badge>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/roles/${role.id}/edit`} className="flex items-center gap-2">
                                                            <Pencil className="h-4 w-4" /> Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => handleDelete(role.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" /> Delete
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
        </AppLayout>
    );
}
