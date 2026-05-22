import { type VariantProps } from 'class-variance-authority';
import { Badge } from '@/components/ui/badge';

/**
 * Supported status keys. Each maps to a shadcn Badge variant
 * and a human-readable label — no hardcoded colours.
 */
export type StatusKey =
    | 'active'
    | 'inactive'
    | 'pending'
    | 'upcoming'
    | 'delayed'
    | 'missed'
    | 'taken'
    | 'low'
    | 'medium'
    | 'high';

type BadgeVariant = NonNullable<
    VariantProps<
        typeof import('@/components/ui/badge').badgeVariants
    >['variant']
>;

type StatusConfig = {
    variant: BadgeVariant;
    label: string;
};

const STATUS_MAP: Record<StatusKey, StatusConfig> = {
    // Lifecycle statuses
    active: { variant: 'default', label: 'Active' },
    inactive: { variant: 'secondary', label: 'Inactive' },
    pending: { variant: 'outline', label: 'Pending' },
    upcoming: { variant: 'secondary', label: 'Upcoming' },
    delayed: { variant: 'outline', label: 'Delayed' },
    missed: { variant: 'destructive', label: 'Missed' },
    taken: { variant: 'default', label: 'Taken' },
    // Risk / severity levels
    low: { variant: 'secondary', label: 'Low' },
    medium: { variant: 'outline', label: 'Medium' },
    high: { variant: 'destructive', label: 'High' },
};

type StatusBadgeProps = {
    status: StatusKey | string;
    /** Override the auto-generated label */
    label?: string;
    className?: string;
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
    const config = STATUS_MAP[status as StatusKey] ?? {
        variant: 'outline' as BadgeVariant,
        label: status,
    };

    return (
        <Badge variant={config.variant} className={className}>
            {label ?? config.label}
        </Badge>
    );
}
