import {
    Baby,
    CheckCircle2,
    Clock,
    FileText,
    Stethoscope,
    Syringe,
    XCircle,
    AlertTriangle,
} from 'lucide-react';
import type { ConfirmationStatus } from '@/components/ConfirmationStepper';

export type TimelineItem = {
    id: number;
    type:
        | 'birth'
        | 'vaccine'
        | 'checkup'
        | 'milestone'
        | 'note'
        | 'confirmation';
    date: string;
    title: string;
    description?: string;
    status?: ConfirmationStatus;
    doctor?: string;
};

const TYPE_META: Record<
    TimelineItem['type'],
    { icon: React.ElementType; bg: string; text: string }
> = {
    birth: { icon: Baby, bg: 'bg-pink-500', text: 'text-pink-600' },
    vaccine: { icon: Syringe, bg: 'bg-violet-500', text: 'text-violet-600' },
    checkup: { icon: Stethoscope, bg: 'bg-sky-500', text: 'text-sky-600' },
    milestone: {
        icon: CheckCircle2,
        bg: 'bg-emerald-500',
        text: 'text-emerald-600',
    },
    note: { icon: FileText, bg: 'bg-neutral-400', text: 'text-neutral-600' },
    confirmation: { icon: Clock, bg: 'bg-amber-500', text: 'text-amber-600' },
};

const STATUS_DOT: Record<ConfirmationStatus, string> = {
    taken: 'bg-emerald-500',
    upcoming: 'bg-amber-400',
    pending: 'bg-blue-400',
    delayed: 'bg-orange-500',
    missed: 'bg-red-500',
};

const STATUS_LABEL: Record<ConfirmationStatus, string> = {
    taken: 'Taken',
    upcoming: 'Upcoming',
    pending: 'Pending',
    delayed: 'Delayed',
    missed: 'Missed',
};

interface Props {
    items: TimelineItem[];
    title?: string;
}

export function HealthTimeline({ items, title = 'Health Timeline' }: Props) {
    const sorted = [...items].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return (
        <div>
            <h3 className="mb-4 flex items-center gap-2 font-bold text-neutral-900 dark:text-neutral-100">
                <Stethoscope className="h-4 w-4 text-emerald-500" />
                {title}
            </h3>

            {sorted.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-neutral-200 py-12 text-center dark:border-neutral-800">
                    <Clock className="h-8 w-8 text-neutral-300" />
                    <p className="text-sm text-neutral-400">
                        No timeline events yet
                    </p>
                </div>
            ) : (
                <div className="relative">
                    {/* vertical line */}
                    <div className="absolute top-0 left-4 h-full w-0.5 bg-neutral-100 dark:bg-neutral-800" />

                    <div className="space-y-1">
                        {sorted.map((item, idx) => {
                            const meta = TYPE_META[item.type];
                            const Icon = meta.icon;
                            const isLast = idx === sorted.length - 1;

                            return (
                                <div
                                    key={item.id}
                                    className={`relative flex gap-5 pb-6 ${isLast ? '' : ''}`}
                                >
                                    {/* Icon bubble */}
                                    <div
                                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow-sm ${meta.bg}`}
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                    </div>

                                    {/* Content card */}
                                    <div className="flex-1 rounded-xl border border-neutral-100 bg-white p-3.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                                    {item.title}
                                                </p>
                                                {item.description && (
                                                    <p className="mt-0.5 text-xs text-neutral-500">
                                                        {item.description}
                                                    </p>
                                                )}
                                                {item.doctor && (
                                                    <p className="mt-0.5 text-xs text-neutral-400">
                                                        Dr. {item.doctor}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex shrink-0 flex-col items-end gap-1">
                                                <span className="text-xs text-neutral-400">
                                                    {item.date}
                                                </span>
                                                {item.status && (
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                            item.status ===
                                                            'taken'
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : item.status ===
                                                                    'missed'
                                                                  ? 'bg-red-50 text-red-700'
                                                                  : item.status ===
                                                                      'delayed'
                                                                    ? 'bg-orange-50 text-orange-700'
                                                                    : item.status ===
                                                                        'upcoming'
                                                                      ? 'bg-amber-50 text-amber-700'
                                                                      : 'bg-blue-50 text-blue-700'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[item.status]}`}
                                                        />
                                                        {
                                                            STATUS_LABEL[
                                                                item.status
                                                            ]
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
