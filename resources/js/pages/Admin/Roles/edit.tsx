import { useEffect, useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { ShieldCheck } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/crud';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';

type Role = {
    id: number;
    name: string;
    permissions: { name: string }[];
};

const splitPermission = (permission: string) => {
    const [resource, ...actionParts] = permission.split('_');

    return {
        resource: resource || 'General',
        action: actionParts.join('_') || permission,
    };
};

const formatLabel = (value: string) =>
    value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

export default function RolesEdit({ role }: { role: Role }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Roles', href: '/admin/roles' },
        { title: role.name, href: `/admin/roles/${role.id}/edit` },
    ];

    const [name, setName] = useState(role.name);
    const [selected, setSelected] = useState<string[]>(
        role.permissions.map((p) => p.name),
    );
    const [allPermissions, setAllPermissions] = useState<string[]>([]);
    const [errors, setErrors] = useState<{
        name?: string;
        permissions?: string;
    }>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        axios
            .get<string[]>('/api/permissions')
            .then(({ data }) => setAllPermissions(data));
    }, []);

    const groupedPermissions = useMemo(() => {
        const grouped: Record<string, string[]> = {};

        allPermissions.forEach((permission) => {
            const { resource } = splitPermission(permission);
            if (!grouped[resource]) grouped[resource] = [];
            grouped[resource].push(permission);
        });

        return Object.fromEntries(
            Object.entries(grouped)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([resource, permissions]) => [
                    resource,
                    permissions.sort((a, b) => a.localeCompare(b)),
                ]),
        );
    }, [allPermissions]);

    const toggle = (perm: string) =>
        setSelected((prev) =>
            prev.includes(perm)
                ? prev.filter((p) => p !== perm)
                : [...prev, perm],
        );

    const toggleAll = (resource: string) => {
        const perms = groupedPermissions[resource] ?? [];
        const allSel = perms.every((p) => selected.includes(p));
        setSelected((prev) =>
            allSel
                ? prev.filter((p) => !perms.includes(p))
                : [...new Set([...prev, ...perms])],
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSubmitting(true);
        axios
            .put(`/api/roles/${role.id}`, { name, permissions: selected })
            .then(() => router.visit('/admin/roles'))
            .catch((err) => {
                if (err.response?.status === 422)
                    setErrors(err.response.data.errors ?? {});
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Role: ${role.name} — No Child Missed`} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title={`Edit Role: ${role.name}`}
                    description="Update role name and assigned permissions."
                    breadcrumb={breadcrumbs}
                    icon={ShieldCheck}
                />
                <div className="mx-auto w-full max-w-2xl">
                    <div className="rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Role Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-xs text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label>Permissions</Label>
                                <div className="space-y-4">
                                    {Object.entries(groupedPermissions).map(
                                        ([resource, permissions]) => (
                                            <div
                                                key={resource}
                                                className="rounded-xl border p-4"
                                            >
                                                <div className="mb-3 flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`all-${resource}`}
                                                        checked={
                                                            permissions.length >
                                                                0 &&
                                                            permissions.every(
                                                                (permission) =>
                                                                    selected.includes(
                                                                        permission,
                                                                    ),
                                                            )
                                                        }
                                                        onChange={() =>
                                                            toggleAll(resource)
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300"
                                                    />
                                                    <label
                                                        htmlFor={`all-${resource}`}
                                                        className="text-sm font-semibold"
                                                    >
                                                        {resource}
                                                    </label>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                                    {permissions.map(
                                                        (permission) => {
                                                            const { action } =
                                                                splitPermission(
                                                                    permission,
                                                                );
                                                            return (
                                                                <label
                                                                    key={
                                                                        permission
                                                                    }
                                                                    className="flex items-center gap-2 text-sm"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selected.includes(
                                                                            permission,
                                                                        )}
                                                                        onChange={() =>
                                                                            toggle(
                                                                                permission,
                                                                            )
                                                                        }
                                                                        className="h-4 w-4 rounded border-gray-300"
                                                                    />
                                                                    {formatLabel(
                                                                        action,
                                                                    )}
                                                                </label>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                                {errors.permissions && (
                                    <p className="text-xs text-destructive">
                                        {errors.permissions}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit('/admin/roles')}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? 'Saving…' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
