import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Child = { id: number; name: string; surname: string };

type Doctor = {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone_number: number;
    child_id: number;
    status: string;
};

type FormState = {
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    child_id: string;
    status: string;
};

type FieldErrors = Partial<Record<keyof FormState, string[]>>;

export default function Edit({ doctor }: { doctor: Doctor }) {
    const [form, setForm] = useState<FormState>({
        name: doctor.name,
        surname: doctor.surname,
        email: doctor.email,
        phone_number: String(doctor.phone_number),
        child_id: String(doctor.child_id),
        status: doctor.status,
    });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [children, setChildren] = useState<Child[]>([]);

    useEffect(() => {
        axios
            .get<Child[]>('/api/children')
            .then(({ data }) => setChildren(data))
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
            await axios.put(`/api/doctors/${doctor.id}`, {
                ...form,
                phone_number: Number(form.phone_number),
                child_id: Number(form.child_id),
            });
            router.visit('/admin/doctors');
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
            <Head title="Edit Doctor" />

            <div className="max-w-2xl space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Updating record for{' '}
                        <span className="text-muted-foreground">
                            {doctor.name} {doctor.surname}
                        </span>
                    </h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-lg border bg-card p-6"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">First Name</Label>
                            <Input
                                id="name"
                                value={form.name}
                                onChange={(e) => set('name', e.target.value)}
                            />
                            {err('name') && (
                                <p className="text-xs text-destructive">
                                    {err('name')}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="surname">Surname</Label>
                            <Input
                                id="surname"
                                value={form.surname}
                                onChange={(e) => set('surname', e.target.value)}
                            />
                            {err('surname') && (
                                <p className="text-xs text-destructive">
                                    {err('surname')}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => set('email', e.target.value)}
                            />
                            {err('email') && (
                                <p className="text-xs text-destructive">
                                    {err('email')}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="phone_number">Phone Number</Label>
                            <Input
                                id="phone_number"
                                type="number"
                                value={form.phone_number}
                                onChange={(e) =>
                                    set('phone_number', e.target.value)
                                }
                            />
                            {err('phone_number') && (
                                <p className="text-xs text-destructive">
                                    {err('phone_number')}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Assigned Child</Label>
                            <Select
                                value={form.child_id}
                                onValueChange={(v) => set('child_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a child" />
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
                                    <SelectItem value="missed">
                                        Missed
                                    </SelectItem>
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
                            {submitting ? 'Saving...' : 'Update Doctor'}
                        </Button>
                        <Link href="/admin/doctors">
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
        { title: 'Doctors', href: '/admin/doctors' },
        { title: 'Edit Doctor', href: '#' },
    ],
};
