import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Child = { id: number; name: string; surname: string };

type Parent = {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone_number: number;
    personal_number: string;
    children?: Child[];
};

type FormState = {
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    personal_number: string;
};

type FieldErrors = Partial<Record<keyof FormState | 'child_ids', string[]>>;

export default function Edit({ parent }: { parent: Parent }) {
    const [form, setForm] = useState<FormState>({
        name: parent.name,
        surname: parent.surname,
        email: parent.email,
        phone_number: String(parent.phone_number),
        personal_number: parent.personal_number,
    });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChildIds, setSelectedChildIds] = useState<number[]>(
        parent.children?.map((c) => c.id) ?? [],
    );

    useEffect(() => {
        axios
            .get<Child[]>('/api/children')
            .then(({ data }) => setChildren(data))
            .catch(() => {});
    }, []);

    const set = (field: keyof FormState, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const err = (field: keyof FormState | 'child_ids') => errors[field]?.[0];

    const toggleChild = (id: number) =>
        setSelectedChildIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        try {
            await axios.put(`/api/parents/${parent.id}`, {
                ...form,
                phone_number: Number(form.phone_number),
                child_ids: selectedChildIds,
            });
            router.visit('/admin/parents');
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
            <Head title="Edit Parent" />

            <div className="max-w-2xl space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Updating record for{' '}
                        <span className="text-muted-foreground">
                            {parent.name} {parent.surname}
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

                    {/* Children multi-select */}
                    <div className="space-y-1.5">
                        <Label>
                            Assigned Children
                            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                                ({selectedChildIds.length} selected)
                            </span>
                        </Label>
                        {children.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Loading children…
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {children.map((c) => {
                                    const checked = selectedChildIds.includes(
                                        c.id,
                                    );
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => toggleChild(c.id)}
                                            className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                                                checked
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-border hover:border-primary/40 hover:bg-muted/50'
                                            }`}
                                        >
                                            <span
                                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                                    checked
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : 'border-muted-foreground/40'
                                                }`}
                                            >
                                                {checked && (
                                                    <Check className="h-2.5 w-2.5" />
                                                )}
                                            </span>
                                            <span className="truncate font-medium">
                                                {c.name} {c.surname}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        {err('child_ids') && (
                            <p className="text-xs text-destructive">
                                {err('child_ids')}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 border-t pt-2">
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Update Parent'}
                        </Button>
                        <Link href="/admin/parents">
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
        { title: 'Parents', href: '/admin/parents' },
        { title: 'Edit Parent', href: '#' },
    ],
};
