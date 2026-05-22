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

type FormData = {
    code: string;
    name: string;
    protectsAgainst: string;
    recommended_age_months: string;
    description: string;
    vaccination_municipality: string;
    dose: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Vaccines', href: '/admin/vaccines' },
    { title: 'Add Vaccine' },
];

export default function VaccineCreate() {
    const [form, setForm] = useState<FormData>({
        code: '',
        name: '',
        protectsAgainst: '',
        recommended_age_months: '',
        description: '',
        vaccination_municipality: '',
        dose: '',
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

        axios
            .post('/api/vaccines', data, {
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
            <Head title="Add Vaccine — No Child Missed" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Add Vaccine"
                    description="Add a new vaccine to the catalogue."
                    breadcrumb={breadcrumbs}
                    icon={Syringe}
                />

                <div className="mx-auto w-full max-w-2xl">
                    <div className="rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
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
                                        placeholder="BCG Vaccine"
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
                                        placeholder="BCG-001"
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
                                    placeholder="Tuberculosis"
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
                                        placeholder="0-1"
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
                                        placeholder="0.5 ml"
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
                                    placeholder="Prishtina"
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
                                    placeholder="Brief description of the vaccine…"
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
                                <Label htmlFor="image">Image (optional)</Label>
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
                                    {submitting ? 'Saving…' : 'Save Vaccine'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
