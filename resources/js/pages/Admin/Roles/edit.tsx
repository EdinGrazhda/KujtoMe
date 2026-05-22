import { useEffect, useState } from 'react';
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

const RESOURCES = ['Children', 'Doctors', 'Parents', 'Vaccines', 'Confirmations'];
const ACTIONS = ['View', 'Create', 'Update', 'Delete'];

export default function RolesEdit({ role }: { role: Role }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Roles', href: '/admin/roles' },
        { title: role.name },
    ];

    const [name, setName] = useState(role.name);
    const [selected, setSelected] = useState<string[]>(role.permissions.map((p) => p.name));
    const [allPermissions, setAllPermissions] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ name?: string; permissions?: string }>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        axios.get<string[]>('/api/permissions').then(({ data }) => setAllPermissions(data));
    }, []);

    const toggle = (perm: string) =>
        setSelected((prev) =>
            prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
        );

    const toggleAll = (resource: string) => {
        const perms = ACTIONS.map((a) => `${resource}_${a}`);
        const allSel = perms.every((p) => selected.includes(p));
        setSelected((prev) =>
            allSel ? prev.filter((p) => !perms.includes(p)) : [...new Set([...prev, ...perms])],
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
                if (err.response?.status === 422) setErrors(err.response.data.errors ?? {});
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
                                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-3">
                                <Label>Permissions</Label>
                                <div className="space-y-4">
                                    {RESOURCES.map((resource) => (
                                        <div key={resource} className="rounded-xl border p-4">
                                            <div className="mb-3 flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id={`all-${resource}`}
                                                    checked={ACTIONS.every((a) =>
                                                        selected.includes(`${resource}_${a}`),
                                                    )}
                                                    onChange={() => toggleAll(resource)}
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
                                                {ACTIONS.map((action) => {
                                                    const perm = `${resource}_${action}`;
                                                    const exists = allPermissions.includes(perm);
                                                    return (
                                                        <label
                                                            key={perm}
                                                            className={`flex items-center gap-2 text-sm ${!exists ? 'opacity-40' : ''}`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={selected.includes(perm)}
                                                                onChange={() => toggle(perm)}
                                                                disabled={!exists}
                                                                className="h-4 w-4 rounded border-gray-300"
                                                            />
                                                            {action}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.permissions && (
                                    <p className="text-xs text-destructive">{errors.permissions}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => router.visit('/admin/roles')}>
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
