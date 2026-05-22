import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Stethoscope } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/crud';
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
import type { BreadcrumbItem } from '@/types';

type Child = { id: number; name: string; surname: string };

type FormData = {
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    child_id: string;
    status: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Doctors', href: '/admin/doctors' },
    { title: 'Add Doctor' },
];

export default function DoctorCreate() {
    const [children, setChildren] = useState<Child[]>([]);
    const [form, setForm] = useState<FormData>({
        name: '',
        surname: '',
        email: '',
        phone_number: '',
        child_id: '',
        status: '',
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        axios.get<Child[]>('/api/children').then((r) => setChildren(r.data));
    }, []);

    const set = (field: keyof FormData, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSubmitting(true);
        axios
            .post('/api/doctors', form)
            .then(() => router.visit('/admin/doctors'))
            .catch((err) => {
                if (err.response?.status === 422)
                    setErrors(err.response.data.errors ?? {});
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Doctor — No Child Missed" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Add Doctor"
                    description="Register a new doctor and assign them to a child."
                    breadcrumb={breadcrumbs}
                    icon={Stethoscope}
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
                                        placeholder="Blerim"
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
                                        placeholder="Krasniqi"
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
                                    placeholder="doctor@example.com"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

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
                                    placeholder="+383 44 000 000"
                                    required
                                />
                                {errors.phone_number && (
                                    <p className="text-xs text-destructive">
                                        {errors.phone_number}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label>Assigned Child</Label>
                                    <Select
                                        value={form.child_id}
                                        onValueChange={(v) =>
                                            set('child_id', v)
                                        }
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
                                    {errors.status && (
                                        <p className="text-xs text-destructive">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        router.visit('/admin/doctors')
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-emerald-500 hover:bg-emerald-600"
                                >
                                    {submitting ? 'Saving…' : 'Save Doctor'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
