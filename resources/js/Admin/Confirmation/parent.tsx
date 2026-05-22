import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import {
    Bell,
    CheckCircle2,
    Clock,
    Heart,
    PhoneCall,
    Shield,
    Syringe,
    XCircle,
} from 'lucide-react';
import { ConfirmationStepper } from '@/components/ConfirmationStepper';
import type { ConfirmationRecord } from '@/components/ConfirmationCard';
import type { ConfirmationStatus } from '@/components/ConfirmationStepper';

interface Props {
    confirmation: ConfirmationRecord;
}

export default function ParentConfirmationPage({
    confirmation: initial,
}: Props) {
    const [conf, setConf] = useState(initial);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [action, setAction] = useState<string | null>(null);

    const patch = async (status: ConfirmationStatus, label: string) => {
        setLoading(true);
        setAction(label);
        try {
            await axios.put(`/api/confirmations/${conf.id}`, {
                status,
                child_id: conf.child?.id,
                parent_id: conf.parent?.id,
                vaccine_id: conf.vaccine?.id,
            });
            setConf((c) => ({ ...c, status }));
            setDone(true);
        } catch {
            alert('Could not update. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Vaccination Confirmation" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-12 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
                {/* Brand */}
                <div className="mb-8 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-md">
                        <Heart className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                        No Child Missed
                    </span>
                </div>

                {done ? (
                    /* ✅ Success screen */
                    <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl dark:bg-neutral-900">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                            Thank you!
                        </h2>
                        <p className="mt-2 text-neutral-500">
                            You marked this confirmation as{' '}
                            <strong className="text-neutral-700 capitalize dark:text-neutral-300">
                                {action}
                            </strong>
                            . The healthcare team has been notified.
                        </p>
                        <Link
                            href="/dashboard"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="w-full max-w-lg space-y-5">
                        {/* Main card */}
                        <div className="rounded-3xl bg-white p-7 shadow-xl dark:bg-neutral-900">
                            {/* Header */}
                            <div className="mb-5 text-center">
                                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-950">
                                    <Syringe className="h-7 w-7 text-violet-500" />
                                </div>
                                <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                    Vaccination Reminder
                                </h1>
                                <p className="mt-1 text-sm text-neutral-500">
                                    Hi <strong>{conf.parent?.name}</strong>,
                                    please confirm the vaccination status for
                                    your child.
                                </p>
                            </div>

                            {/* Child + vaccine info */}
                            <div className="mb-5 rounded-2xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                                        {conf.child?.name?.[0]}
                                        {conf.child?.surname?.[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-neutral-800 dark:text-neutral-200">
                                            {conf.child?.name}{' '}
                                            {conf.child?.surname}
                                        </p>
                                        <p className="flex items-center gap-1 text-sm text-neutral-500">
                                            <Syringe className="h-3 w-3" />
                                            {conf.vaccine?.name ?? 'Vaccine'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Stepper */}
                            <ConfirmationStepper status={conf.status} />

                            {/* Friendly message */}
                            <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
                                <p className="font-semibold">
                                    Your child has a scheduled vaccine/check-up.
                                </p>
                                <p className="mt-1 text-amber-700 dark:text-amber-400">
                                    Please confirm if the child has taken it or
                                    needs rescheduling. This helps us ensure no
                                    child misses important preventive care.
                                </p>
                            </div>

                            {/* Action buttons */}
                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <button
                                    disabled={loading}
                                    onClick={() =>
                                        patch('taken', 'Confirm Taken')
                                    }
                                    className="flex flex-col items-center gap-1.5 rounded-2xl bg-emerald-500 px-4 py-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:opacity-60"
                                >
                                    <CheckCircle2 className="h-6 w-6" />
                                    Confirm Taken
                                </button>
                                <button
                                    disabled={loading}
                                    onClick={() =>
                                        patch('upcoming', 'Remind Me Later')
                                    }
                                    className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-4 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-60 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                                >
                                    <Bell className="h-6 w-6" />
                                    Remind Me Later
                                </button>
                                <button
                                    disabled={loading}
                                    onClick={() =>
                                        patch('missed', 'Mark as Not Taken')
                                    }
                                    className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-60 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
                                >
                                    <XCircle className="h-6 w-6" />
                                    Mark as Not Taken
                                </button>
                                <button
                                    disabled={loading}
                                    onClick={() =>
                                        patch('delayed', 'Request Doctor Call')
                                    }
                                    className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-sky-200 bg-sky-50 px-4 py-4 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-100 disabled:opacity-60 dark:border-sky-800 dark:bg-sky-950/30 dark:text-sky-300"
                                >
                                    <PhoneCall className="h-6 w-6" />
                                    Request Doctor Call
                                </button>
                            </div>
                        </div>

                        {/* Safety note */}
                        <div className="flex items-center gap-2 rounded-2xl bg-white/60 px-5 py-3 text-xs text-neutral-500 shadow-sm backdrop-blur-sm dark:bg-neutral-900/60">
                            <Shield className="h-4 w-4 shrink-0 text-emerald-500" />
                            Your response is shared only with the assigned
                            healthcare provider to ensure your child's
                            wellbeing.
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

// No sidebar layout for this public-facing page
