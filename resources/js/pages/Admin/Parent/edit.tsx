import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Users } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/crud';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { BreadcrumbItem } from '@/types';

type Child = { id: number; name: string; surname: string };
type Parent = {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    personal_number: string;
    children?: Child[];
};

type FormData = {
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    personal_number: string;
    child_ids: number[];
};

export default function ParentEdit({ parent }: { parent: Parent }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Parents', href: '/admin/parents' },
        { title: `${parent.name} ${parent.surname}` },
    ];

    const [children, setChildren] = useState<Child[]>([]);
    const [form, setForm] = useState<FormData>({
        name: parent.name,
        surname: parent.surname,
        email: parent.email,
        phone_number: String(parent.phone_number),
        personal_number: parent.personal_number,
        child_ids: parent.children?.map((c) => c.id) ?? [],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        axios.get<Child[]>('/api/children').then((r) => setChildren(r.data));
    }, []);

    const set = (field: keyof Omit<FormData, 'child_ids'>, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const toggleChild = (id: number) => {
        setForm((prev) => ({
            ...prev,
            child_ids: prev.child_ids.includes(id)
                ? prev.child_ids.filter((c) => c !== id)
                : [...prev.child_ids, id],
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSubmitting(true);
        axios
            .put(`/api/parents/${parent.id}`, form)
            .then(() => router.visit('/admin/parents'))
            .catch((err) => {
                if (err.response?.status === 422)
                    setErrors(err.response.data.errors ?? {});
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${parent.name} — No Child Missed`} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title={`Edit ${parent.name} ${parent.surname}`}
                    description="Update parent details and linked children."
                    breadcrumb={breadcrumbs}
                    icon={Users}
                />

                <div className="mx-auto w-full max-w-2xl">
                    <div className="rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name">First Name</Label>
                                    <Input
                                        id="name"
                                        value={form.name}
                                        onChange={(e) =>
                                            set('name', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="surname">Last Name</Label>
                                    <Input
                                        id="surname"
                                        value={form.surname}
                                        onChange={(e) =>
                                            set('surname', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.surname && (
                                        <p className="text-xs text-destructive">
                                            {errors.surname}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        set('email', e.target.value)
                                    }
                                    required
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone_number">
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phone_number"
                                        type="tel"
                                        value={form.phone_number}
                                        onChange={(e) =>
                                            set('phone_number', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.phone_number && (
                                        <p className="text-xs text-destructive">
                                            {errors.phone_number}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="personal_number">
                                        Personal Number
                                    </Label>
                                    <Input
                                        id="personal_number"
                                        value={form.personal_number}
                                        onChange={(e) =>
                                            set(
                                                'personal_number',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {errors.personal_number && (
                                        <p className="text-xs text-destructive">
                                            {errors.personal_number}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Linked Children</Label>
                                {children.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">
                                        Loading children…
                                    </p>
                                ) : (
                                    <div className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-700">
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {children.map((child) => (
                                                <label
                                                    key={child.id}
                                                    className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors hover:bg-muted/50"
                                                >
                                                    <Checkbox
                                                        checked={form.child_ids.includes(
                                                            child.id,
                                                        )}
                                                        onCheckedChange={() =>
                                                            toggleChild(
                                                                child.id,
                                                            )
                                                        }
                                                    />
                                                    <span className="text-sm font-medium">
                                                        {child.name}{' '}
                                                        {child.surname}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        router.visit('/admin/parents')
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-emerald-500 hover:bg-emerald-600"
                                >
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
