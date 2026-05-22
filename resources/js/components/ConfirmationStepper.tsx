import {
    Check,
    Clock,
    AlertTriangle,
    XCircle,
    CheckCircle2,
} from 'lucide-react';

export type ConfirmationStatus =
    | 'pending'
    | 'upcoming'
    | 'delayed'
    | 'missed'
    | 'taken';

interface Step {
    key: string;
    label: string;
    desc: string;
}

const STEPS: Step[] = [
    { key: 'pending', label: 'Pending Review', desc: 'Awaiting review' },
    {
        key: 'upcoming',
        label: 'Upcoming Appointment',
        desc: 'Appointment scheduled',
    },
    { key: 'review', label: 'Confirmation Needed', desc: 'Confirm attendance' },
    { key: 'taken', label: 'Completed / Taken', desc: 'Vaccination confirmed' },
];

const stepIndex = (status: ConfirmationStatus) => {
    if (status === 'taken') return 3;
    if (status === 'upcoming') return 1;
    if (status === 'pending') return 0;
    return -1; // delayed / missed — show as failed
};

const statusColors: Record<
    ConfirmationStatus,
    { ring: string; bg: string; text: string; label: string }
> = {
    pending: {
        ring: 'ring-blue-400',
        bg: 'bg-blue-500',
        text: 'text-blue-600',
        label: 'Pending',
    },
    upcoming: {
        ring: 'ring-amber-400',
        bg: 'bg-amber-500',
        text: 'text-amber-600',
        label: 'Upcoming',
    },
    delayed: {
        ring: 'ring-orange-400',
        bg: 'bg-orange-500',
        text: 'text-orange-600',
        label: 'Delayed',
    },
    missed: {
        ring: 'ring-red-400',
        bg: 'bg-red-500',
        text: 'text-red-600',
        label: 'Missed',
    },
    taken: {
        ring: 'ring-emerald-400',
        bg: 'bg-emerald-500',
        text: 'text-emerald-600',
        label: 'Taken',
    },
};

export function ConfirmationStepper({
    status,
}: {
    status: ConfirmationStatus;
}) {
    const current = stepIndex(status);
    const isFailed = status === 'delayed' || status === 'missed';
    const colors = statusColors[status];

    return (
        <div className="w-full">
            {/* Status banner */}
            <div
                className={`mb-4 flex items-center gap-2 rounded-xl px-4 py-2.5 ${
                    status === 'taken'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                        : status === 'missed'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300'
                          : status === 'delayed'
                            ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300'
                            : status === 'upcoming'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300'
                }`}
            >
                {status === 'taken' && (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                )}
                {status === 'missed' && (
                    <XCircle className="h-4 w-4 shrink-0" />
                )}
                {status === 'delayed' && (
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                )}
                {status === 'upcoming' && (
                    <Clock className="h-4 w-4 shrink-0" />
                )}
                {status === 'pending' && <Clock className="h-4 w-4 shrink-0" />}
                <span className="text-sm font-semibold capitalize">
                    {colors.label}
                </span>
                {isFailed && (
                    <span className="ml-1 text-xs opacity-80">
                        —{' '}
                        {status === 'missed'
                            ? 'Vaccination was not taken.'
                            : 'Appointment was delayed.'}
                    </span>
                )}
            </div>

            {/* Stepper track */}
            <div className="flex items-start gap-0">
                {STEPS.map((step, idx) => {
                    const done = !isFailed && idx < current;
                    const active = !isFailed && idx === current;
                    const failed = isFailed && idx === 1; // highlight at "upcoming" step

                    return (
                        <div
                            key={step.key}
                            className="flex flex-1 flex-col items-center"
                        >
                            {/* connector + bubble row */}
                            <div className="flex w-full items-center">
                                {/* left line */}
                                <div
                                    className={`h-0.5 flex-1 ${idx === 0 ? 'invisible' : done || (active && idx > 0) ? colors.bg : 'bg-neutral-200 dark:bg-neutral-700'}`}
                                />
                                {/* bubble */}
                                <div
                                    className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                                        done
                                            ? `${colors.bg} border-transparent text-white`
                                            : active
                                              ? `bg-white dark:bg-neutral-900 ${colors.ring} border-transparent ring-2 ring-offset-1 ${colors.text}`
                                              : failed
                                                ? 'border-transparent bg-red-500 text-white'
                                                : isFailed
                                                  ? 'border-neutral-300 bg-neutral-100 text-neutral-400 dark:border-neutral-600 dark:bg-neutral-800'
                                                  : 'border-neutral-300 bg-neutral-100 text-neutral-400 dark:border-neutral-600 dark:bg-neutral-800'
                                    }`}
                                >
                                    {done && <Check className="h-4 w-4" />}
                                    {active && (
                                        <span className="h-2.5 w-2.5 rounded-full bg-current" />
                                    )}
                                    {failed && <XCircle className="h-4 w-4" />}
                                    {!done && !active && !failed && (
                                        <span className="text-xs font-semibold">
                                            {idx + 1}
                                        </span>
                                    )}
                                </div>
                                {/* right line */}
                                <div
                                    className={`h-0.5 flex-1 ${idx === STEPS.length - 1 ? 'invisible' : done ? colors.bg : 'bg-neutral-200 dark:bg-neutral-700'}`}
                                />
                            </div>
                            {/* label */}
                            <div className="mt-1.5 px-1 text-center">
                                <p
                                    className={`text-xs leading-tight font-semibold ${
                                        active
                                            ? colors.text
                                            : done
                                              ? 'text-neutral-700 dark:text-neutral-300'
                                              : 'text-neutral-400 dark:text-neutral-500'
                                    }`}
                                >
                                    {step.label}
                                </p>
                                <p className="mt-0.5 hidden text-[10px] leading-tight text-neutral-400 sm:block">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
