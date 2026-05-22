import { useState } from 'react';
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

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

type FormState = {
    name: string;
    surname: string;
    date_of_birth: string;
    gender: string;
    personal_number: string;
    blood_type: string;
    allergies: string;
    chronic_diseases: string;
};

type FieldErrors = Partial<Record<keyof FormState, string[]>>;

const empty: FormState = {
    name: '',
    surname: '',
    date_of_birth: '',
    gender: '',
    personal_number: '',
    blood_type: '',
    allergies: '',
    chronic_diseases: '',
};

export default function Create() {
    const [form, setForm] = useState<FormState>(empty);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const set = (field: keyof FormState, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const err = (field: keyof FormState) => errors[field]?.[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        try {
            await axios.post('/api/children', form);
            router.visit('/admin/children');
        } catch (error: unknown) {
            const err = error as {
                response?: { status: number; data: { errors: FieldErrors } };
            };
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Add Child" />

            <div className="max-w-2xl space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Add Child
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Fill in the details to register a new child.
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
                            <Label htmlFor="date_of_birth">Date of Birth</Label>
                            <Input
                                id="date_of_birth"
                                type="date"
                                value={form.date_of_birth}
                                onChange={(e) =>
                                    set('date_of_birth', e.target.value)
                                }
                            />
                            {err('date_of_birth') && (
                                <p className="text-xs text-destructive">
                                    {err('date_of_birth')}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="personal_number">
                                Personal Number
                            </Label>
                            <Input
                                id="personal_number"
                                value={form.personal_number}
                                onChange={(e) =>
                                    set('personal_number', e.target.value)
                                }
                            />
                            {err('personal_number') && (
                                <p className="text-xs text-destructive">
                                    {err('personal_number')}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">
                                        Female
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {err('gender') && (
                                <p className="text-xs text-destructive">
                                    {err('gender')}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Blood Type</Label>
                            <Select
                                value={form.blood_type}
                                onValueChange={(v) => set('blood_type', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select blood type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BLOOD_TYPES.map((bt) => (
                                        <SelectItem key={bt} value={bt}>
                                            {bt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {err('blood_type') && (
                                <p className="text-xs text-destructive">
                                    {err('blood_type')}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="allergies">Allergies</Label>
                        <Input
                            id="allergies"
                            placeholder="e.g. Penicillin, Pollen..."
                            value={form.allergies}
                            onChange={(e) => set('allergies', e.target.value)}
                        />
                        {err('allergies') && (
                            <p className="text-xs text-destructive">
                                {err('allergies')}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="chronic_diseases">
                            Chronic Diseases
                        </Label>
                        <Input
                            id="chronic_diseases"
                            placeholder="e.g. Asthma, Diabetes..."
                            value={form.chronic_diseases}
                            onChange={(e) =>
                                set('chronic_diseases', e.target.value)
                            }
                        />
                        {err('chronic_diseases') && (
                            <p className="text-xs text-destructive">
                                {err('chronic_diseases')}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 border-t pt-2">
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save Child'}
                        </Button>
                        <Link href="/admin/children">
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
        { title: 'Children', href: '/admin/children' },
        { title: 'Add Child', href: '/admin/children/create' },
    ],
};
