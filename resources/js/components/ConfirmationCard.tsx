import { useState } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertTriangle,
    Bell,
    CheckCircle2,
    ChevronRight,
    Clock,
    PhoneCall,
    Stethoscope,
    Syringe,
    User,
    XCircle,
} from 'lucide-react';
import { ConfirmationStepper } from '@/components/ConfirmationStepper';
import type { ConfirmationStatus } from '@/components/ConfirmationStepper';

export type ConfirmationRecord = {
    id: number;
    status: ConfirmationStatus;
    child?: { id: number; name: string; surname: string; blood_type?: string };
    parent?: { id: number; name: string; surname: string; email?: string };
    vaccine?: { id: number; name: string };
};

const riskLevel = (
    status: ConfirmationStatus,
): { label: string; color: string } => {
    if (status === 'missed')
        return {
            label: 'High Risk',
            color: 'text-red-600 bg-red-50 border-red-200',
        };
    if (status === 'delayed')
        return {
            label: 'High Risk',
            color: 'text-orange-600 bg-orange-50 border-orange-200',
        };
    if (status === 'upcoming')
        return {
            label: 'Medium Risk',
            color: 'text-amber-600 bg-amber-50 border-amber-200',
        };
    if (status === 'pending')
        return {
            label: 'Low Risk',
            color: 'text-blue-600 bg-blue-50 border-blue-200',
        };
    return {
        label: 'Completed',
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    };
};

const cardBorder: Record<ConfirmationStatus, string> = {
    missed: 'border-l-4 border-l-red-500',
    delayed: 'border-l-4 border-l-orange-500',
    upcoming: 'border-l-4 border-l-amber-400',
    pending: 'border-l-4 border-l-blue-400',
    taken: 'border-l-4 border-l-emerald-500',
};

interface Props {
    confirmation: ConfirmationRecord;
    onStatusChange?: (id: number, newStatus: ConfirmationStatus) => void;
    onDelete?: (id: number) => void;
    expanded?: boolean;
}

export function ConfirmationCard({
    confirmation: c,
    onStatusChange,
    onDelete,
    expanded = false,
}: Props) {
    const [open, setOpen] = useState(expanded);
    const [loading, setLoading] = useState(false);
    const [remindState, setRemindState] = useState<'idle' | 'loading' | 'sent'>(
        'idle',
    );
    const [doctorState, setDoctorState] = useState<'idle' | 'loading' | 'sent'>(
        'idle',
    );
    const risk = riskLevel(c.status);

    const patch = async (newStatus: ConfirmationStatus) => {
        setLoading(true);
        try {
            await axios.put(`/api/confirmations/${c.id}`, {
                status: newStatus,
                child_id: c.child?.id,
                parent_id: c.parent?.id,
                vaccine_id: c.vaccine?.id,
            });
            onStatusChange?.(c.id, newStatus);
        } catch {
            alert('Could not update status.');
        } finally {
            setLoading(false);
        }
    };

    const sendReminder = async () => {
        setRemindState('loading');
        try {
            await axios.post(`/api/confirmations/${c.id}/remind`);
            setRemindState('sent');
            setTimeout(() => setRemindState('idle'), 3000);
        } catch {
            alert('Could not send reminder.');
            setRemindState('idle');
        }
    };

    const requestDoctorCall = async () => {
        setDoctorState('loading');
        try {
            await axios.post(`/api/confirmations/${c.id}/doctor-call`);
            setDoctorState('sent');
            setTimeout(() => setDoctorState('idle'), 3000);
        } catch {
            alert('Could not request doctor call.');
            setDoctorState('idle');
        }
    };

    return (
        <div
            className={`overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 ${cardBorder[c.status]}`}
        >
            {/* Header row */}
            <div
                className="flex cursor-pointer items-center gap-4 px-5 py-4"
                onClick={() => setOpen((o) => !o)}
            >
                {/* Avatar */}
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm ${
                        c.status === 'missed'
                            ? 'bg-red-500'
                            : c.status === 'delayed'
                              ? 'bg-orange-500'
                              : c.status === 'upcoming'
                                ? 'bg-amber-500'
                                : c.status === 'taken'
                                  ? 'bg-emerald-500'
                                  : 'bg-blue-500'
                    }`}
                >
                    {c.child?.name?.[0]}
                    {c.child?.surname?.[0]}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                            {c.child?.name} {c.child?.surname}
                        </p>
                        <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${risk.color}`}
                        >
                            {risk.label}
                        </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                            <Syringe className="h-3 w-3" />
                            {c.vaccine?.name ?? 'Vaccine N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {c.parent?.name} {c.parent?.surname}
                        </span>
                    </div>
                </div>

                {/* Status icon */}
                <div className="shrink-0">
                    {c.status === 'taken' && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    )}
                    {c.status === 'missed' && (
                        <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    {c.status === 'delayed' && (
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                    )}
                    {(c.status === 'pending' || c.status === 'upcoming') && (
                        <Clock className="h-5 w-5 text-amber-500" />
                    )}
                </div>
                <ChevronRight
                    className={`h-4 w-4 text-neutral-400 transition-transform ${open ? 'rotate-90' : ''}`}
                />
            </div>

            {/* Expanded section */}
            {open && (
                <div className="border-t border-neutral-100 px-5 pt-4 pb-5 dark:border-neutral-800">
                    {/* Stepper */}
                    <ConfirmationStepper status={c.status} />

                    {/* Info grid */}
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            {
                                icon: User,
                                label: 'Child',
                                value: `${c.child?.name} ${c.child?.surname}`,
                            },
                            {
                                icon: Stethoscope,
                                label: 'Parent',
                                value: `${c.parent?.name} ${c.parent?.surname}`,
                            },
                            {
                                icon: Syringe,
                                label: 'Vaccine',
                                value: c.vaccine?.name ?? 'N/A',
                            },
                            {
                                icon: AlertTriangle,
                                label: 'Risk',
                                value: risk.label,
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800"
                            >
                                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                                    <item.icon className="h-3 w-3" />
                                    {item.label}
                                </div>
                                <p className="mt-1 truncate text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {c.status !== 'upcoming' && (
                            <button
                                disabled={loading}
                                onClick={() => patch('upcoming')}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-50"
                            >
                                <Clock className="h-3.5 w-3.5" /> Mark Upcoming
                            </button>
                        )}
                        {c.status !== 'taken' && (
                            <button
                                disabled={loading}
                                onClick={() => patch('taken')}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
                            >
                                <CheckCircle2 className="h-3.5 w-3.5" /> Mark
                                Taken
                            </button>
                        )}
                        {c.status !== 'delayed' && (
                            <button
                                disabled={loading}
                                onClick={() => patch('delayed')}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-100 disabled:opacity-50"
                            >
                                <AlertTriangle className="h-3.5 w-3.5" /> Mark
                                Delayed
                            </button>
                        )}
                        {c.status !== 'missed' && (
                            <button
                                disabled={loading}
                                onClick={() => patch('missed')}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                            >
                                <XCircle className="h-3.5 w-3.5" /> Mark Missed
                            </button>
                        )}
                        <button
                            disabled={remindState !== 'idle'}
                            onClick={sendReminder}
                            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-60 ${
                                remindState === 'sent'
                                    ? 'bg-violet-100 text-violet-800'
                                    : 'bg-violet-50 text-violet-700 hover:bg-violet-100'
                            }`}
                        >
                            <Bell className="h-3.5 w-3.5" />
                            {remindState === 'loading'
                                ? 'Sending…'
                                : remindState === 'sent'
                                  ? 'Reminder Sent ✓'
                                  : 'Send Reminder'}
                        </button>
                        <button
                            disabled={doctorState !== 'idle'}
                            onClick={requestDoctorCall}
                            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-60 ${
                                doctorState === 'sent'
                                    ? 'bg-sky-100 text-sky-800'
                                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                            }`}
                        >
                            <PhoneCall className="h-3.5 w-3.5" />
                            {doctorState === 'loading'
                                ? 'Requesting…'
                                : doctorState === 'sent'
                                  ? 'Call Requested ✓'
                                  : 'Request Doctor Call'}
                        </button>
                        <Link
                            href={`/admin/children/${c.child?.id}/timeline`}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                            <ChevronRight className="h-3.5 w-3.5" /> View Child
                            Timeline
                        </Link>

                        {onDelete && (
                            <button
                                disabled={loading}
                                onClick={() => {
                                    if (confirm('Delete this confirmation?'))
                                        onDelete(c.id);
                                }}
                                className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:bg-neutral-800"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
