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
type DoctorUser = { id: number; name: string; email: string };
type Doctor = {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    child_id: number;
    status: string;
    user_id?: number | null;
};

type FormData = {
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    child_id: string;
    status: string;
    user_id: string;
};

export default function DoctorEdit({ doctor, doctorUsers }: { doctor: Doctor; doctorUsers: DoctorUser[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Doctors', href: '/admin/doctors' },
        { title: `Dr. ${doctor.name} ${doctor.surname}` },
    ];

    const [children, setChildren] = useState<Child[]>([]);
    const [form, setForm] = useState<FormData>({
        name: doctor.name,
        surname: doctor.surname,
        email: doctor.email,
        phone_number: String(doctor.phone_number),
        child_id: String(doctor.child_id),
        status: doctor.status,
        user_id: doctor.user_id ? String(doctor.user_id) : '',
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
        const payload = {
            ...form,
            user_id: form.user_id && form.user_id !== 'none' ? form.user_id : null,
        };
        axios
            .put(`/api/doctors/${doctor.id}`, payload)
            .then(() => router.visit('/admin/doctors'))
            .catch((err) => {
                if (err.response?.status === 422)
                    setErrors(err.response.data.errors ?? {});
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Dr. ${doctor.name} — No Child Missed`} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title={`Edit Dr. ${doctor.name} ${doctor.surname}`}
                    description="Update doctor details and assignment."
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

                            {/* Linked User Account */}
                            <div className="space-y-1.5">
                                <Label>Linked User Account</Label>
                                <Select
                                    value={form.user_id}
                                    onValueChange={(v) => set('user_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select user account (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">— Not linked —</SelectItem>
                                        {doctorUsers.map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)}>
                                                {u.name} ({u.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Link this doctor record to their login account so they can see their appointments.
                                </p>
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
