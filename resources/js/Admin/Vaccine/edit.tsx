import { useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, ImageIcon, Syringe, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Vaccine = {
    id: number;
    code: string;
    name: string;
    protectsAgainst: string;
    recommended_age_months: string;
    image: string;
    description: string;
    vaccination_municipality: string;
    dose: string;
};

type FormState = {
    code: string;
    name: string;
    protectsAgainst: string;
    recommended_age_months: string;
    description: string;
    vaccination_municipality: string;
    dose: string;
};

type FieldErrors = Partial<Record<keyof FormState | 'image', string[]>>;

export default function Edit({ vaccine }: { vaccine: Vaccine }) {
    const [form, setForm] = useState<FormState>({
        code: vaccine.code,
        name: vaccine.name,
        protectsAgainst: vaccine.protectsAgainst,
        recommended_age_months: vaccine.recommended_age_months,
        description: vaccine.description ?? '',
        vaccination_municipality: vaccine.vaccination_municipality ?? '',
        dose: vaccine.dose ?? '',
    });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        vaccine.image ? `/storage/${vaccine.image}` : null,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const set = (field: keyof FormState, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const err = (field: keyof FormState | 'image') => errors[field]?.[0];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImageFile(file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const clearImage = () => {
        setImageFile(null);
        // revert preview to the saved image (don't delete server-side until save)
        setImagePreview(vaccine.image ? `/storage/${vaccine.image}` : null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        try {
            const data = new FormData();
            data.append('_method', 'PUT');
            Object.entries(form).forEach(([k, v]) => data.append(k, v));
            if (imageFile) data.append('image', imageFile);
            await axios.post(`/api/vaccines/${vaccine.id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            router.visit('/admin/vaccines');
        } catch (error: unknown) {
            const e = error as {
                response?: { status: number; data: { errors: FieldErrors } };
            };
            if (e.response?.status === 422) {
                setErrors(e.response.data.errors ?? {});
            } else {
                alert('Something went wrong. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Head title={`Edit ${vaccine.name}`} />
            <div className="mx-auto max-w-2xl space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/vaccines">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Edit Vaccine
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Update details for{' '}
                            <span className="font-semibold text-foreground">
                                {vaccine.name}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Form card */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3 border-b pb-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <Syringe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold">Vaccine Details</p>
                            <p className="text-xs text-muted-foreground">
                                Code:{' '}
                                <span className="font-mono">
                                    {vaccine.code}
                                </span>
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Code + Name */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="code">Vaccine Code</Label>
                                <Input
                                    id="code"
                                    value={form.code}
                                    onChange={(e) =>
                                        set('code', e.target.value)
                                    }
                                    className={
                                        err('code') ? 'border-destructive' : ''
                                    }
                                />
                                {err('code') && (
                                    <p className="text-xs text-destructive">
                                        {err('code')}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Vaccine Name</Label>
                                <Input
                                    id="name"
                                    value={form.name}
                                    onChange={(e) =>
                                        set('name', e.target.value)
                                    }
                                    className={
                                        err('name') ? 'border-destructive' : ''
                                    }
                                />
                                {err('name') && (
                                    <p className="text-xs text-destructive">
                                        {err('name')}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Protects Against + Dose */}
                        <div className="grid gap-4 sm:grid-cols-2">
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
                                    className={
                                        err('protectsAgainst')
                                            ? 'border-destructive'
                                            : ''
                                    }
                                />
                                {err('protectsAgainst') && (
                                    <p className="text-xs text-destructive">
                                        {err('protectsAgainst')}
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
                                    className={
                                        err('dose') ? 'border-destructive' : ''
                                    }
                                />
                                {err('dose') && (
                                    <p className="text-xs text-destructive">
                                        {err('dose')}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Recommended age + Municipality */}
                        <div className="grid gap-4 sm:grid-cols-2">
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
                                    className={
                                        err('recommended_age_months')
                                            ? 'border-destructive'
                                            : ''
                                    }
                                />
                                {err('recommended_age_months') && (
                                    <p className="text-xs text-destructive">
                                        {err('recommended_age_months')}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="vaccination_municipality">
                                    Municipality
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
                                    className={
                                        err('vaccination_municipality')
                                            ? 'border-destructive'
                                            : ''
                                    }
                                />
                                {err('vaccination_municipality') && (
                                    <p className="text-xs text-destructive">
                                        {err('vaccination_municipality')}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-1.5">
                            <Label>Vaccine Image</Label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition hover:bg-muted/50 ${
                                    err('image')
                                        ? 'border-destructive'
                                        : 'border-border hover:border-primary/50'
                                }`}
                            >
                                {imagePreview ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="mx-auto max-h-36 rounded-lg object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={(ev) => {
                                                ev.stopPropagation();
                                                clearImage();
                                            }}
                                            className="absolute -top-2 -right-2 rounded-full bg-destructive p-0.5 text-white"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground">
                                        <ImageIcon className="h-8 w-8" />
                                        <p className="text-sm font-medium">
                                            Click to replace image
                                        </p>
                                        <p className="text-xs">
                                            PNG, JPG, GIF, WEBP — max 2 MB
                                        </p>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                            {err('image') && (
                                <p className="text-xs text-destructive">
                                    {err('image')}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                rows={3}
                                value={form.description}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>,
                                ) => set('description', e.target.value)}
                                className={
                                    err('description')
                                        ? 'border-destructive'
                                        : ''
                                }
                            />
                            {err('description') && (
                                <p className="text-xs text-destructive">
                                    {err('description')}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 border-t pt-4">
                            <Link href="/admin/vaccines">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="gap-2"
                            >
                                <Syringe className="h-4 w-4" />
                                {submitting ? 'Saving…' : 'Update Vaccine'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Vaccines', href: '/admin/vaccines' },
        { title: 'Edit', href: '#' },
    ],
};
