import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EmptyStateProps = {
    /** Large icon rendered above the title */
    icon: LucideIcon;
    title: string;
    description?: string;
    /** Label for the CTA button — omit to hide the button */
    actionLabel?: string;
    /** Navigate href (renders as <a>); takes priority over onAction */
    actionHref?: string;
    /** Callback fired when the CTA button is clicked */
    onAction?: () => void;
};

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionHref,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-card py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Icon className="h-8 w-8 text-muted-foreground/50" />
            </div>

            <div className="max-w-xs space-y-1">
                <p className="font-semibold text-foreground">{title}</p>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            {actionLabel &&
                (actionHref || onAction) &&
                (actionHref ? (
                    <a href={actionHref}>
                        <Button size="sm" className="gap-2">
                            {actionLabel}
                        </Button>
                    </a>
                ) : (
                    <Button size="sm" onClick={onAction} className="gap-2">
                        {actionLabel}
                    </Button>
                ))}
        </div>
    );
}
