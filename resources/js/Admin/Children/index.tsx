import { useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertTriangle,
    Baby,
    ChevronRight,
    Droplets,
    Eye,
    MoreHorizontal,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Child = {
    id: number;
    name: string;
    surname: string;
    date_of_birth: string;
    gender: 'male' | 'female' | 'other';
    personal_number: number;
    blood_type: string;
    allergies: string | null;
    chronic_diseases: string | null;
};

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Index() {
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [genderFilter, setGenderFilter] = useState('all');
    const [bloodTypeFilter, setBloodTypeFilter] = useState('all');

    useEffect(() => {
        axios
            .get<Child[]>('/api/children')
            .then(({ data }) => setChildren(data))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this child?')) return;
        try {
            await axios.delete(`/api/children/${id}`);
            setChildren((prev) => prev.filter((c) => c.id !== id));
        } catch {
            alert('Failed to delete child.');
        }
    };

    const hasActiveFilters =
        search !== '' || genderFilter !== 'all' || bloodTypeFilter !== 'all';

    const resetFilters = () => {
        setSearch('');
        setGenderFilter('all');
        setBloodTypeFilter('all');
    };

    const filtered = children.filter((c) => {
        const matchesSearch =
            search === '' ||
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.surname.toLowerCase().includes(search.toLowerCase());
        const matchesGender =
            genderFilter === 'all' || c.gender === genderFilter;
        const matchesBlood =
            bloodTypeFilter === 'all' || c.blood_type === bloodTypeFilter;
        return matchesSearch && matchesGender && matchesBlood;
    });

    return (
        <>
            <Head title="Children" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Children
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {children.length} registered{' '}
                            {children.length === 1 ? 'child' : 'children'}
                        </p>
                    </div>
                    <Link href="/admin/children/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Child
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
                                placeholder="Search by name or surname..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="w-[160px] space-y-1.5">
                            <Label className="text-xs text-muted-foreground">
                                Gender
                            </Label>
                            <Select
                                value={genderFilter}
                                onValueChange={setGenderFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Genders
                                    </SelectItem>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">
                                        Female
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-[160px] space-y-1.5">
                            <Label className="text-xs text-muted-foreground">
                                Blood Type
                            </Label>
                            <Select
                                value={bloodTypeFilter}
                                onValueChange={setBloodTypeFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Types
                                    </SelectItem>
                                    {BLOOD_TYPES.map((bt) => (
                                        <SelectItem key={bt} value={bt}>
                                            {bt}
                                        </SelectItem>
                                    ))}
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
                                        Date of Birth
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Gender
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Blood Type
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Personal No.
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
                                                ? 'No children match the current filters.'
                                                : 'No children registered yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((child) => (
                                        <tr
                                            key={child.id}
                                            className="border-b transition-colors last:border-0 hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {child.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {child.surname}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {child.date_of_birth}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        child.gender === 'male'
                                                            ? 'default'
                                                            : child.gender ===
                                                                'female'
                                                              ? 'secondary'
                                                              : 'outline'
                                                    }
                                                    className="capitalize"
                                                >
                                                    {child.gender}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                                                    {child.blood_type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                                {child.personal_number}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/admin/children/${child.id}/edit`}
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
                                                                child.id,
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
                        Showing {filtered.length} of {children.length} children
                    </p>
                )}
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Children', href: '/admin/children' },
    ],
};
