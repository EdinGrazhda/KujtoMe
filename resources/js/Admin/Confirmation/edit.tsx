import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Child = { id: number; name: string; surname: string };
type Parent = { id: number; name: string; surname: string };
type Vaccine = { id: number; name: string };

type ConfirmationRecord = {
    id: number;
    child_id: number;
    parent_id: number;
    vaccine_id: number;
    status: string;
    child?: Child;
    parent?: Parent;
    vaccine?: Vaccine;
};

type FormState = {
    child_id: string;
    parent_id: string;
    vaccine_id: string;
    status: string;
};

type FieldErrors = Partial<Record<keyof FormState, string[]>>;

export default function Edit({
    confirmation,
}: {
    confirmation: ConfirmationRecord;
}) {
    const [form, setForm] = useState<FormState>({
        child_id: String(confirmation.child_id),
        parent_id: String(confirmation.parent_id),
        vaccine_id: String(confirmation.vaccine_id),
        status: confirmation.status,
    });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [children, setChildren] = useState<Child[]>([]);
    const [parents, setParents] = useState<Parent[]>([]);
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);

    useEffect(() => {
        Promise.all([
            axios.get<Child[]>('/api/children'),
            axios.get<Parent[]>('/api/parents'),
            axios.get<Vaccine[]>('/api/vaccines'),
        ])
            .then(([c, p, v]) => {
                setChildren(c.data);
                setParents(p.data);
                setVaccines(v.data);
            })
            .catch(() => {});
    }, []);

    const set = (field: keyof FormState, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const err = (field: keyof FormState) => errors[field]?.[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        try {
            await axios.put(`/api/confirmations/${confirmation.id}`, {
                child_id: Number(form.child_id),
                parent_id: Number(form.parent_id),
                vaccine_id: Number(form.vaccine_id),
                status: form.status,
            });
            router.visit('/admin/confirmations');
        } catch (error: unknown) {
            const e = error as {
                response?: { status: number; data: { errors: FieldErrors } };
            };
            if (e.response?.status === 422) {
                setErrors(e.response.data.errors ?? {});
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Edit Confirmation" />

            <div className="max-w-2xl space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Edit Confirmation{' '}
                        <span className="text-muted-foreground">
                            #{confirmation.id}
                        </span>
                    </h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-lg border bg-card p-6"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Child</Label>
                            <Select
                                value={form.child_id}
                                onValueChange={(v) => set('child_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
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
                            {err('child_id') && (
                                <p className="text-xs text-destructive">
                                    {err('child_id')}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Parent</Label>
                            <Select
                                value={form.parent_id}
                                onValueChange={(v) => set('parent_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
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
                            {err('parent_id') && (
                                <p className="text-xs text-destructive">
                                    {err('parent_id')}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Vaccine</Label>
                            <Select
                                value={form.vaccine_id}
                                onValueChange={(v) => set('vaccine_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
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
                            {err('vaccine_id') && (
                                <p className="text-xs text-destructive">
                                    {err('vaccine_id')}
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
                                    <SelectValue />
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
                                    <SelectItem value="taken">Taken</SelectItem>
                                </SelectContent>
                            </Select>
                            {err('status') && (
                                <p className="text-xs text-destructive">
                                    {err('status')}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 border-t pt-2">
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Update Confirmation'}
                        </Button>
                        <Link href="/admin/confirmations">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Confirmations', href: '/admin/confirmations' },
        { title: 'Edit Confirmation', href: '#' },
    ],
};
