import { FormEvent, useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { RotateCcw, Search, UserCog, UserPlus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type UserRow = {
    id: number;
    name: string;
    email: string;
    roles: string[];
};

type CreateUserForm = {
    name: string;
    email: string;
    password: string;
    role: string;
};

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/admin/users' },
];

export default function UsersIndex() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [saving, setSaving] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');
    const [createForm, setCreateForm] = useState<CreateUserForm>({
        name: '',
        email: '',
        password: '',
        role: '__none__',
    });

    useEffect(() => {
        Promise.all([
            axios.get<UserRow[]>('/api/users'),
            axios.get<{ name: string }[]>('/api/roles'),
        ])
            .then(([usersRes, rolesRes]) => {
                setUsers(usersRes.data);
                setRoles(rolesRes.data.map((r) => r.name));
            })
            .finally(() => setLoading(false));
    }, []);

    const assignRole = async (userId: number, role: string) => {
        setSaving(userId);
        try {
            const { data } = await axios.put<UserRow>(
                `/api/users/${userId}/roles`,
                {
                    roles: role === '__none__' ? [] : [role],
                },
            );
            setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
        } catch {
            alert('Failed to update role.');
        } finally {
            setSaving(null);
        }
    };

    const createUser = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreating(true);
        setCreateError('');
        setCreateSuccess('');

        try {
            const payload = {
                name: createForm.name.trim(),
                email: createForm.email.trim(),
                password: createForm.password,
                role: createForm.role === '__none__' ? null : createForm.role,
            };

            const { data } = await axios.post<UserRow>('/api/users', payload);
            setUsers((prev) => [data, ...prev]);
            setCreateForm({
                name: '',
                email: '',
                password: '',
                role: '__none__',
            });
            setCreateSuccess('User created successfully.');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                setCreateError(
                    'Please check the fields. Password must be at least 8 characters.',
                );
            } else {
                setCreateError('Failed to create user.');
            }
        } finally {
            setCreating(false);
        }
    };

    const filtered = users.filter(
        (u) =>
            search === '' ||
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users — No Child Missed" />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Users
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Create users and assign roles
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Create New User
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={createUser}
                            className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
                        >
                            <div className="space-y-2 lg:col-span-1">
                                <Label htmlFor="create-user-name">Name</Label>
                                <Input
                                    id="create-user-name"
                                    value={createForm.name}
                                    onChange={(e) =>
                                        setCreateForm((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    placeholder="Full name"
                                    required
                                />
                            </div>
                            <div className="space-y-2 lg:col-span-1">
                                <Label htmlFor="create-user-email">Email</Label>
                                <Input
                                    id="create-user-email"
                                    type="email"
                                    value={createForm.email}
                                    onChange={(e) =>
                                        setCreateForm((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2 lg:col-span-1">
                                <Label htmlFor="create-user-password">
                                    Password
                                </Label>
                                <Input
                                    id="create-user-password"
                                    type="password"
                                    value={createForm.password}
                                    onChange={(e) =>
                                        setCreateForm((prev) => ({
                                            ...prev,
                                            password: e.target.value,
                                        }))
                                    }
                                    placeholder="Min 8 characters"
                                    required
                                />
                            </div>
                            <div className="space-y-2 lg:col-span-1">
                                <Label>Role</Label>
                                <Select
                                    value={createForm.role}
                                    onValueChange={(value) =>
                                        setCreateForm((prev) => ({
                                            ...prev,
                                            role: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__none__">
                                            No role
                                        </SelectItem>
                                        {roles.map((r) => (
                                            <SelectItem key={r} value={r}>
                                                {r}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end lg:col-span-1">
                                <Button
                                    type="submit"
                                    className="w-full gap-2"
                                    disabled={creating}
                                >
                                    <UserPlus className="h-4 w-4" />
                                    {creating ? 'Creating...' : 'Create User'}
                                </Button>
                            </div>
                        </form>
                        {createError && (
                            <p className="mt-3 text-sm text-destructive">
                                {createError}
                            </p>
                        )}
                        {createSuccess && (
                            <p className="mt-3 text-sm text-emerald-600">
                                {createSuccess}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Users
                            </CardTitle>
                            <UserCog className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {loading ? '—' : users.length}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Registered accounts
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Without a Role
                            </CardTitle>
                            <UserCog className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {loading
                                    ? '—'
                                    : users.filter((u) => u.roles.length === 0)
                                          .length}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Need assignment
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="flex items-center gap-3">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email…"
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
                            {filtered.length} of {users.length} users
                        </span>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border bg-card">
                    {loading ? (
                        <div className="space-y-3 p-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-14 animate-pulse rounded-xl bg-muted"
                                />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
                            <UserCog className="h-10 w-10 opacity-30" />
                            <p className="text-sm">No users found</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/40">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Current Role
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Assign Role
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filtered.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="transition-colors hover:bg-muted/20"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {user.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.roles.length === 0 ? (
                                                <span className="text-xs text-muted-foreground italic">
                                                    None
                                                </span>
                                            ) : (
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((r) => (
                                                        <Badge
                                                            key={r}
                                                            variant="secondary"
                                                        >
                                                            {r}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Select
                                                value={
                                                    user.roles[0] ?? '__none__'
                                                }
                                                onValueChange={(val) =>
                                                    assignRole(user.id, val)
                                                }
                                                disabled={saving === user.id}
                                            >
                                                <SelectTrigger className="w-36">
                                                    <SelectValue placeholder="Select role…" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__none__">
                                                        — No role —
                                                    </SelectItem>
                                                    {roles.map((r) => (
                                                        <SelectItem
                                                            key={r}
                                                            value={r}
                                                        >
                                                            {r}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
