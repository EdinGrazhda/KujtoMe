import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

type Doctor = {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone_number: number;
    child_id: number;
    status: 'pending' | 'missed';
    child?: { id: number; name: string; surname: string };
};

export default function Index() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        axios
            .get<Doctor[]>('/api/doctors')
            .then(({ data }) => setDoctors(data))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this doctor?')) return;
        try {
            await axios.delete(`/api/doctors/${id}`);
            setDoctors((prev) => prev.filter((d) => d.id !== id));
        } catch {
            alert('Failed to delete doctor.');
        }
    };

    const hasActiveFilters = search !== '' || statusFilter !== 'all';

    const resetFilters = () => {
        setSearch('');
        setStatusFilter('all');
    };

    const filtered = doctors.filter((d) => {
        const matchesSearch =
            search === '' ||
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.surname.toLowerCase().includes(search.toLowerCase()) ||
            d.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' || d.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <Head title="Doctors" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Doctors
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {doctors.length} registered{' '}
                            {doctors.length === 1 ? 'doctor' : 'doctors'}
                        </p>
                    </div>
                    <Link href="/admin/doctors/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Doctor
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="space-y-3 rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Filters</span>
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                            >
                                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                                Reset
                            </Button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <div className="min-w-[220px] flex-1 space-y-1.5">
                            <Label
                                htmlFor="search"
                                className="text-xs text-muted-foreground"
                            >
                                Search
                            </Label>
                            <Input
                                id="search"
                                placeholder="Search by name, surname or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="w-[160px] space-y-1.5">
                            <Label className="text-xs text-muted-foreground">
                                Status
                            </Label>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="missed">
                                        Missed
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border">
                    {loading ? (
                        <div className="py-16 text-center text-sm text-muted-foreground">
                            Loading...
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Surname
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Phone
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Child
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-12 text-center text-sm text-muted-foreground"
                                        >
                                            {hasActiveFilters
                                                ? 'No doctors match the current filters.'
                                                : 'No doctors registered yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((doctor) => (
                                        <tr
                                            key={doctor.id}
                                            className="border-b transition-colors last:border-0 hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {doctor.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {doctor.surname}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {doctor.email}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                                {doctor.phone_number}
                                            </td>
                                            <td className="px-4 py-3">
                                                {doctor.child ? (
                                                    `${doctor.child.name} ${doctor.child.surname}`
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        doctor.status ===
                                                        'pending'
                                                            ? 'secondary'
                                                            : 'destructive'
                                                    }
                                                    className="capitalize"
                                                >
                                                    {doctor.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/admin/doctors/${doctor.id}/edit`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() =>
                                                            handleDelete(
                                                                doctor.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {!loading && hasActiveFilters && (
                    <p className="text-xs text-muted-foreground">
                        Showing {filtered.length} of {doctors.length} doctors
                    </p>
                )}
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Doctors', href: '/admin/doctors' },
    ],
};
