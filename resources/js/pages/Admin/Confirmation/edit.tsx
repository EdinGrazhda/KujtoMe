import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { ClipboardCheck } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/crud';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

type Child = { id: number; name: string; surname: string };
type Parent = { id: number; name: string; surname: string };
type Vaccine = { id: number; name: string };

type ConfirmationRecord = {
    id: number;
    status: string;
    child_id: number;
    parent_id: number;
    vaccine_id: number;
    child?: Child;
    parent?: Parent;
    vaccine?: Vaccine;
};

type FormData = {
    child_id: string;
    parent_id: string;
    vaccine_id: string;
    status: string;
};

export default function ConfirmationEdit({
    confirmation,
}: {
    confirmation: ConfirmationRecord;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Confirmations', href: '/admin/confirmations' },
        {
            title: `${confirmation.child?.name ?? 'Confirmation'} — ${confirmation.vaccine?.name ?? ''}`,
        },
    ];

    const [children, setChildren] = useState<Child[]>([]);
    const [parents, setParents] = useState<Parent[]>([]);
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [form, setForm] = useState<FormData>({
        child_id: String(confirmation.child_id),
        parent_id: String(confirmation.parent_id),
        vaccine_id: String(confirmation.vaccine_id),
        status: confirmation.status,
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        Promise.all([
            axios.get<Child[]>('/api/children'),
            axios.get<Parent[]>('/api/parents'),
            axios.get<Vaccine[]>('/api/vaccines'),
        ]).then(([c, p, v]) => {
            setChildren(c.data);
            setParents(p.data);
            setVaccines(v.data);
        });
    }, []);

    const set = (field: keyof FormData, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSubmitting(true);
        axios
            .put(`/api/confirmations/${confirmation.id}`, form)
            .then(() => router.visit('/admin/confirmations'))
            .catch((err) => {
                if (err.response?.status === 422)
                    setErrors(err.response.data.errors ?? {});
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Confirmation — No Child Missed" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Edit Confirmation"
                    description="Update this vaccination confirmation record."
                    breadcrumb={breadcrumbs}
                    icon={ClipboardCheck}
                />

                <div className="mx-auto w-full max-w-2xl">
                    {/* Current info banner */}
                    <div className="mb-5 rounded-xl border border-neutral-200/60 bg-muted/40 px-5 py-4 text-sm dark:border-neutral-800">
                        <div className="flex flex-wrap gap-4 text-muted-foreground">
                            {confirmation.child && (
                                <span>
                                    <strong className="text-foreground">
                                        Child:
                                    </strong>{' '}
                                    {confirmation.child.name}{' '}
                                    {confirmation.child.surname}
                                </span>
                            )}
                            {confirmation.vaccine && (
                                <span>
                                    <strong className="text-foreground">
                                        Vaccine:
                                    </strong>{' '}
                                    {confirmation.vaccine.name}
                                </span>
                            )}
                            {confirmation.parent && (
                                <span>
                                    <strong className="text-foreground">
                                        Parent:
                                    </strong>{' '}
                                    {confirmation.parent.name}{' '}
                                    {confirmation.parent.surname}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <Label>Child</Label>
                                <Select
                                    value={form.child_id}
                                    onValueChange={(v) => set('child_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select child" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {children.map((c) => (
                                            <SelectItem
                                                key={c.id}
                                                value={String(c.id)}
                                            >
                                                {c.name} {c.surname}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.child_id && (
                                    <p className="text-xs text-destructive">
                                        {errors.child_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label>Parent / Guardian</Label>
                                <Select
                                    value={form.parent_id}
                                    onValueChange={(v) => set('parent_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select parent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {parents.map((p) => (
                                            <SelectItem
                                                key={p.id}
                                                value={String(p.id)}
                                            >
                                                {p.name} {p.surname}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.parent_id && (
                                    <p className="text-xs text-destructive">
                                        {errors.parent_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label>Vaccine</Label>
                                <Select
                                    value={form.vaccine_id}
                                    onValueChange={(v) => set('vaccine_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select vaccine" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vaccines.map((v) => (
                                            <SelectItem
                                                key={v.id}
                                                value={String(v.id)}
                                            >
                                                {v.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.vaccine_id && (
                                    <p className="text-xs text-destructive">
                                        {errors.vaccine_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label>Status</Label>
                                <Select
                                    value={form.status}
                                    onValueChange={(v) => set('status', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="upcoming">
                                            Upcoming
                                        </SelectItem>
                                        <SelectItem value="delayed">
                                            Delayed
                                        </SelectItem>
                                        <SelectItem value="missed">
                                            Missed
                                        </SelectItem>
                                        <SelectItem value="taken">
                                            Taken
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-xs text-destructive">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        router.visit('/admin/confirmations')
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
