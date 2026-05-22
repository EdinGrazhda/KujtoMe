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

type FormState = {
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    child_id: string;
    status: string;
};

type FieldErrors = Partial<Record<keyof FormState, string[]>>;

const empty: FormState = {
    name: '',
    surname: '',
    email: '',
    phone_number: '',
    child_id: '',
    status: '',
};

export default function Create() {
    const [form, setForm] = useState<FormState>(empty);
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
            await axios.post('/api/doctors', {
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
            <Head title="Add Doctor" />

            <div className="max-w-2xl space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Add Doctor
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Fill in the details to register a new doctor.
                    </p>
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
                                    {children.length === 0 ? (
                                        <div className="px-2 py-3 text-center text-sm text-muted-foreground">
                                            No children registered
                                        </div>
                                    ) : (
                                        children.map((c) => (
                                            <SelectItem
                                                key={c.id}
                                                value={String(c.id)}
                                            >
                                                {c.name} {c.surname}
                                            </SelectItem>
                                        ))
                                    )}
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
                                    <SelectValue placeholder="Select status" />
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
                            {submitting ? 'Saving...' : 'Save Doctor'}
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

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Doctors', href: '/admin/doctors' },
        { title: 'Add Doctor', href: '/admin/doctors/create' },
    ],
};
