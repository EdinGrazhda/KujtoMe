import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertTriangle,
    Bell,
    CalendarCheck,
    CheckCircle2,
    ClipboardList,
    XCircle,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { CrudFilters, EmptyState, PageHeader, StatCard } from '@/components/crud';
import { ConfirmationCard, type ConfirmationRecord } from '@/components/ConfirmationCard';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Appointments' },
];

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState<ConfirmationRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        axios
            .get<ConfirmationRecord[]>('/api/confirmations')
            .then((r) => setAppointments(r.data))
            .finally(() => setLoading(false));
    }, []);

    const filtered = appointments.filter((a) => {
        const matchSearch = `${a.child?.name} ${a.child?.surname} ${a.vaccine?.name} ${a.parent?.name}`
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchStatus = statusFilter === '' || a.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const counts = {
        total: appointments.length,
        upcoming: appointments.filter((a) => a.status === 'upcoming').length,
        missed: appointments.filter((a) => a.status === 'missed').length,
        delayed: appointments.filter((a) => a.status === 'delayed').length,
        taken: appointments.filter((a) => a.status === 'taken').length,
    };

    const handleStatusChange = (id: number, newStatus: ConfirmationRecord['status']) => {
        setAppointments((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Appointments — No Child Missed" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="My Appointments"
                    description="Vaccine appointments assigned to you by parents."
                    breadcrumb={breadcrumbs}
                    icon={CalendarCheck}
                />

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total"
                        value={loading ? '—' : counts.total}
                        description="Assigned to you"
                        icon={ClipboardList}
                    />
                    <StatCard
                        title="Upcoming"
                        value={loading ? '—' : counts.upcoming}
                        description="Scheduled"
                        icon={Bell}
                    />
                    <StatCard
                        title="Missed"
                        value={loading ? '—' : counts.missed}
                        description="Needs follow-up"
                        icon={XCircle}
                    />
                    <StatCard
                        title="Taken"
                        value={loading ? '—' : counts.taken}
                        description="Completed"
                        icon={CheckCircle2}
                    />
                </div>

                {/* Filters */}
                <CrudFilters
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search by child, vaccine or parent..."
                    showStatusFilter
                    statusValue={statusFilter}
                    onStatusChange={setStatusFilter}
                    statusPlaceholder="All statuses"
                    statusOptions={[
                        { label: 'Pending', value: 'pending' },
                        { label: 'Upcoming', value: 'upcoming' },
                        { label: 'Delayed', value: 'delayed' },
                        { label: 'Missed', value: 'missed' },
                        { label: 'Taken', value: 'taken' },
                    ]}
                    total={appointments.length}
                    filtered={filtered.length}
                />

                {/* List */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-20 animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800"
                            />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={CalendarCheck}
                        title="No appointments found"
                        description={
                            search || statusFilter
                                ? 'Try adjusting your search or filter.'
                                : 'No appointments have been assigned to you yet.'
                        }
                    />
                ) : (
                    <div className="space-y-3">
                        {filtered.map((appt) => (
                            <ConfirmationCard
                                key={appt.id}
                                confirmation={appt}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
