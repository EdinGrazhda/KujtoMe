import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type DataTableCardProps = {
    /** Card title rendered in CardHeader */
    title?: string;
    /** Subtitle / description rendered below the title */
    description?: string;
    /** Slot rendered to the right of the title (e.g. a count badge or action button) */
    headerAction?: ReactNode;
    /** The table (or any content) rendered inside CardContent */
    children: ReactNode;
    /** Extra class names applied to the outer Card */
    className?: string;
};

export function DataTableCard({
    title,
    description,
    headerAction,
    children,
    className,
}: DataTableCardProps) {
    const hasHeader = title || description || headerAction;

    return (
        <Card className={cn('overflow-hidden rounded-2xl', className)}>
            {hasHeader && (
                <CardHeader className="flex flex-row items-center justify-between gap-4 border-b bg-muted/30 px-6 py-4">
                    <div className="space-y-0.5">
                        {title && (
                            <CardTitle className="text-base font-semibold">
                                {title}
                            </CardTitle>
                        )}
                        {description && (
                            <CardDescription className="text-xs">
                                {description}
                            </CardDescription>
                        )}
                    </div>
                    {headerAction && (
                        <div className="shrink-0">{headerAction}</div>
                    )}
                </CardHeader>
            )}

            <CardContent className="p-0">{children}</CardContent>
        </Card>
    );
}
