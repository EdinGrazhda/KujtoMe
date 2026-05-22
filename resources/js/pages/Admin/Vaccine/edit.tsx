import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Syringe } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { PageHeader } from '@/components/crud';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { BreadcrumbItem } from '@/types';

type Vaccine = {
    id: number;
    code: string;
    name: string;
    protectsAgainst: string;
    recommended_age_months: string;
    description: string;
    vaccination_municipality: string;
    dose: string;
    image?: string;
};

type FormData = {
    code: string;
    name: string;
    protectsAgainst: string;
    recommended_age_months: string;
    description: string;
    vaccination_municipality: string;
    dose: string;
};

export default function VaccineEdit({ vaccine }: { vaccine: Vaccine }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Vaccines', href: '/admin/vaccines' },
        { title: vaccine.name },
    ];

    const [form, setForm] = useState<FormData>({
        code: vaccine.code,
        name: vaccine.name,
        protectsAgainst: vaccine.protectsAgainst,
        recommended_age_months: vaccine.recommended_age_months,
        description: vaccine.description,
        vaccination_municipality: vaccine.vaccination_municipality,
        dose: vaccine.dose,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [submitting, setSubmitting] = useState(false);

    const set = (field: keyof FormData, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSubmitting(true);

        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, v));
        if (imageFile) data.append('image', imageFile);
        data.append('_method', 'PUT');

        axios
            .post(`/api/vaccines/${vaccine.id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then(() => router.visit('/admin/vaccines'))
            .catch((err) => {
                if (err.response?.status === 422)
                    setErrors(err.response.data.errors ?? {});
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${vaccine.name} — No Child Missed`} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title={`Edit ${vaccine.name}`}
                    description="Update vaccine information in the catalogue."
                    breadcrumb={breadcrumbs}
                    icon={Syringe}
                />

                <div className="mx-auto w-full max-w-2xl">
                    <div className="rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        {vaccine.image && (
                            <div className="mb-5">
                                <img
                                    src={`/storage/${vaccine.image}`}
                                    alt={vaccine.name}
                                    className="h-20 w-20 rounded-xl object-cover"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Current image. Upload a new one to replace.
                                </p>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name">Vaccine Name</Label>
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
                                    <Label htmlFor="code">Code</Label>
                                    <Input
                                        id="code"
                                        value={form.code}
                                        onChange={(e) =>
                                            set('code', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.code && (
                                        <p className="text-xs text-destructive">
                                            {errors.code}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="protectsAgainst">
                                    Protects Against
                                </Label>
                                <Input
                                    id="protectsAgainst"
                                    value={form.protectsAgainst}
                                    onChange={(e) =>
                                        set('protectsAgainst', e.target.value)
                                    }
                                    required
                                />
                                {errors.protectsAgainst && (
                                    <p className="text-xs text-destructive">
                                        {errors.protectsAgainst}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="recommended_age_months">
                                        Recommended Age (months)
                                    </Label>
                                    <Input
                                        id="recommended_age_months"
                                        value={form.recommended_age_months}
                                        onChange={(e) =>
                                            set(
                                                'recommended_age_months',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {errors.recommended_age_months && (
                                        <p className="text-xs text-destructive">
                                            {errors.recommended_age_months}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="dose">Dose</Label>
                                    <Input
                                        id="dose"
                                        value={form.dose}
                                        onChange={(e) =>
                                            set('dose', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.dose && (
                                        <p className="text-xs text-destructive">
                                            {errors.dose}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="vaccination_municipality">
                                    Vaccination Municipality
                                </Label>
                                <Input
                                    id="vaccination_municipality"
                                    value={form.vaccination_municipality}
                                    onChange={(e) =>
                                        set(
                                            'vaccination_municipality',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {errors.vaccination_municipality && (
                                    <p className="text-xs text-destructive">
                                        {errors.vaccination_municipality}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={form.description}
                                    onChange={(e) =>
                                        set('description', e.target.value)
                                    }
                                    rows={3}
                                    required
                                />
                                {errors.description && (
                                    <p className="text-xs text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="image">
                                    Replace Image (optional)
                                </Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setImageFile(
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                    className="cursor-pointer"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        router.visit('/admin/vaccines')
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
