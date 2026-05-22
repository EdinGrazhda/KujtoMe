import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Baby } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import type { BreadcrumbItem } from '@/types';

type Child = {
    id: number;
    name: string;
    surname: string;
    date_of_birth: string;
    gender: string;
    personal_number: string;
    blood_type: string;
    allergies?: string;
    chronic_diseases?: string;
};

type FormData = {
    name: string;
    surname: string;
    date_of_birth: string;
    gender: string;
    personal_number: string;
    blood_type: string;
    allergies: string;
    chronic_diseases: string;
};

export default function ChildrenEdit({ child }: { child: Child }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Children', href: '/admin/children' },
        { title: `${child.name} ${child.surname}` },
    ];

    const [form, setForm] = useState<FormData>({
        name: child.name,
        surname: child.surname,
        date_of_birth: child.date_of_birth?.split('T')[0] ?? '',
        gender: child.gender,
        personal_number: String(child.personal_number),
        blood_type: child.blood_type,
        allergies: child.allergies ?? '',
        chronic_diseases: child.chronic_diseases ?? '',
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [submitting, setSubmitting] = useState(false);

    const set = (field: keyof FormData, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSubmitting(true);
        axios
            .put(`/api/children/${child.id}`, form)
            .then(() => router.visit('/admin/children'))
            .catch((err) => {
                if (err.response?.status === 422) {
                    setErrors(err.response.data.errors ?? {});
                }
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${child.name} — No Child Missed`} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title={`Edit ${child.name} ${child.surname}`}
                    description="Update this child's profile and health information."
                    breadcrumb={breadcrumbs}
                    icon={Baby}
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

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="date_of_birth">
                                        Date of Birth
                                    </Label>
                                    <Input
                                        id="date_of_birth"
                                        type="date"
                                        value={form.date_of_birth}
                                        onChange={(e) =>
                                            set('date_of_birth', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.date_of_birth && (
                                        <p className="text-xs text-destructive">
                                            {errors.date_of_birth}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Gender</Label>
                                    <Select
                                        value={form.gender}
                                        onValueChange={(v) => set('gender', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">
                                                Male
                                            </SelectItem>
                                            <SelectItem value="female">
                                                Female
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && (
                                        <p className="text-xs text-destructive">
                                            {errors.gender}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="personal_number">
                                        Personal Number
                                    </Label>
                                    <Input
                                        id="personal_number"
                                        type="number"
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
                                <div className="space-y-1.5">
                                    <Label htmlFor="blood_type">
                                        Blood Type
                                    </Label>
                                    <Input
                                        id="blood_type"
                                        value={form.blood_type}
                                        onChange={(e) =>
                                            set('blood_type', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.blood_type && (
                                        <p className="text-xs text-destructive">
                                            {errors.blood_type}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="allergies">Allergies</Label>
                                <Input
                                    id="allergies"
                                    value={form.allergies}
                                    onChange={(e) =>
                                        set('allergies', e.target.value)
                                    }
                                    placeholder="Penicillin, peanuts… (optional)"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="chronic_diseases">
                                    Chronic Diseases
                                </Label>
                                <Textarea
                                    id="chronic_diseases"
                                    value={form.chronic_diseases}
                                    onChange={(e) =>
                                        set('chronic_diseases', e.target.value)
                                    }
                                    placeholder="List any chronic conditions… (optional)"
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        router.visit('/admin/children')
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
