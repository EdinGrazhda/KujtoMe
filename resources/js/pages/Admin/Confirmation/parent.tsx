import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import {
    AlertTriangle,
    Baby,
    CheckCircle2,
    Clock,
    Heart,
    ShieldCheck,
    Syringe,
    XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type ConfirmationRecord = {
    id: number;
    status: 'pending' | 'upcoming' | 'delayed' | 'missed' | 'taken';
    child?: {
        id: number;
        name: string;
        surname: string;
        blood_type?: string;
        date_of_birth?: string;
    };
    parent?: { id: number; name: string; surname: string };
    vaccine?: {
        id: number;
        name: string;
        protectsAgainst?: string;
        recommended_age_months?: string;
        dose?: string;
        description?: string;
        vaccination_municipality?: string;
    };
};

const statusConfig = {
    pending: {
        icon: Clock,
        color: 'text-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-200 dark:border-blue-800',
        label: 'Pending Confirmation',
    },
    upcoming: {
        icon: Clock,
        color: 'text-amber-600',
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        border: 'border-amber-200 dark:border-amber-800',
        label: 'Upcoming Vaccination',
    },
    delayed: {
        icon: AlertTriangle,
        color: 'text-orange-600',
        bg: 'bg-orange-50 dark:bg-orange-950/30',
        border: 'border-orange-200 dark:border-orange-800',
        label: 'Vaccination Delayed',
    },
    missed: {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-200 dark:border-red-800',
        label: 'Vaccination Missed',
    },
    taken: {
        icon: CheckCircle2,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        border: 'border-emerald-200 dark:border-emerald-800',
        label: 'Vaccination Completed',
    },
};

export default function ConfirmationParent({
    confirmation,
}: {
    confirmation: ConfirmationRecord;
}) {
    const [marking, setMarking] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(confirmation.status);

    const status = statusConfig[currentStatus] ?? statusConfig.pending;
    const StatusIcon = status.icon;

    const markTaken = () => {
        if (currentStatus === 'taken') return;
        setMarking(true);
        axios
            .put(`/api/confirmations/${confirmation.id}`, { status: 'taken' })
            .then(() => setCurrentStatus('taken'))
            .finally(() => setMarking(false));
    };

    return (
        <>
            <Head
                title={`Vaccination Confirmation — ${confirmation.child?.name ?? 'Child'}`}
            />
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-neutral-950 dark:to-neutral-900">
                {/* Top bar */}
                <header className="border-b bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80">
                    <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
                            <Heart className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                No Child Missed
                            </p>
                            <p className="text-xs text-neutral-400">
                                Kosovo child vaccination platform
                            </p>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-2xl space-y-5 px-4 py-8">
                    {/* Status banner */}
                    <div
                        className={`rounded-2xl border p-5 ${status.bg} ${status.border}`}
                    >
                        <div className="flex items-center gap-3">
                            <StatusIcon
                                className={`h-6 w-6 shrink-0 ${status.color}`}
                            />
                            <div>
                                <p className={`font-bold ${status.color}`}>
                                    {status.label}
                                </p>
                                {confirmation.child && (
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        For{' '}
                                        <strong>
                                            {confirmation.child.name}{' '}
                                            {confirmation.child.surname}
                                        </strong>
                                        {confirmation.parent &&
                                            ` · Parent: ${confirmation.parent.name} ${confirmation.parent.surname}`}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Child info */}
                    {confirmation.child && (
                        <div className="rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-3 flex items-center gap-2">
                                <Baby className="h-4 w-4 text-sky-500" />
                                <h2 className="font-bold text-neutral-900 dark:text-neutral-100">
                                    Child Information
                                </h2>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-lg font-bold text-white">
                                    {confirmation.child.name[0]}
                                    {confirmation.child.surname[0]}
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                        {confirmation.child.name}{' '}
                                        {confirmation.child.surname}
                                    </p>
                                    {confirmation.child.date_of_birth && (
                                        <p className="text-sm text-neutral-400">
                                            Born:{' '}
                                            {new Date(
                                                confirmation.child
                                                    .date_of_birth,
                                            ).toLocaleDateString()}
                                        </p>
                                    )}
                                    {confirmation.child.blood_type && (
                                        <p className="text-sm text-neutral-400">
                                            Blood type:{' '}
                                            {confirmation.child.blood_type}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Vaccine info */}
                    {confirmation.vaccine && (
                        <div className="rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-3 flex items-center gap-2">
                                <Syringe className="h-4 w-4 text-teal-500" />
                                <h2 className="font-bold text-neutral-900 dark:text-neutral-100">
                                    Vaccine Details
                                </h2>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500">
                                        Vaccine
                                    </span>
                                    <span className="font-semibold">
                                        {confirmation.vaccine.name}
                                    </span>
                                </div>
                                {confirmation.vaccine.protectsAgainst && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500">
                                            Protects against
                                        </span>
                                        <span className="font-medium">
                                            {
                                                confirmation.vaccine
                                                    .protectsAgainst
                                            }
                                        </span>
                                    </div>
                                )}
                                {confirmation.vaccine
                                    .recommended_age_months && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500">
                                            Recommended age
                                        </span>
                                        <span className="font-medium">
                                            {
                                                confirmation.vaccine
                                                    .recommended_age_months
                                            }{' '}
                                            months
                                        </span>
                                    </div>
                                )}
                                {confirmation.vaccine.dose && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500">
                                            Dose
                                        </span>
                                        <span className="font-medium">
                                            {confirmation.vaccine.dose}
                                        </span>
                                    </div>
                                )}
                                {confirmation.vaccine
                                    .vaccination_municipality && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500">
                                            Municipality
                                        </span>
                                        <span className="font-medium">
                                            {
                                                confirmation.vaccine
                                                    .vaccination_municipality
                                            }
                                        </span>
                                    </div>
                                )}
                                {confirmation.vaccine.description && (
                                    <p className="mt-3 rounded-lg bg-muted/40 p-3 text-sm text-neutral-600 dark:text-neutral-400">
                                        {confirmation.vaccine.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action */}
                    {currentStatus !== 'taken' ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
                            <div className="mb-3 flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                <h2 className="font-bold text-emerald-800 dark:text-emerald-200">
                                    Confirm Vaccination
                                </h2>
                            </div>
                            <p className="mb-4 text-sm text-emerald-700 dark:text-emerald-300">
                                Has this vaccination been administered? Click
                                the button below to confirm it is taken.
                            </p>
                            <Button
                                onClick={markTaken}
                                disabled={marking}
                                className="w-full bg-emerald-500 text-white hover:bg-emerald-600"
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                {marking ? 'Confirming…' : 'Mark as Taken'}
                            </Button>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
                            <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-emerald-500" />
                            <p className="font-bold text-emerald-800 dark:text-emerald-200">
                                Vaccination Confirmed!
                            </p>
                            <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                                Thank you for keeping your child's vaccinations
                                up to date.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
