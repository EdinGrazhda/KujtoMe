import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Trend = {
    value: number; // e.g. 12 (percent or absolute)
    direction: 'up' | 'down';
    label?: string; // e.g. "vs last month"
};

type StatCardProps = {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: Trend;
    className?: string;
};

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className,
}: StatCardProps) {
    const trendUp = trend?.direction === 'up';

    return (
        <Card className={cn('rounded-2xl', className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <p className="text-3xl font-bold tracking-tight">{value}</p>

                <div className="flex flex-wrap items-center gap-2">
                    {trend && (
                        <span
                            className={cn(
                                'inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-xs font-medium',
                                trendUp
                                    ? 'border-transparent bg-primary/10 text-primary'
                                    : 'border-transparent bg-destructive/10 text-destructive',
                            )}
                        >
                            {trendUp ? (
                                <TrendingUp className="h-3 w-3" />
                            ) : (
                                <TrendingDown className="h-3 w-3" />
                            )}
                            {trend.value}%
                        </span>
                    )}
                    {description && (
                        <p className="text-xs text-muted-foreground">
                            {trend?.label ?? description}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
