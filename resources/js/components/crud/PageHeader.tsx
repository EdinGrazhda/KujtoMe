import { Link, type InertiaLinkProps } from '@inertiajs/react';
import { ChevronRight, Plus, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type BreadcrumbItem = {
    title: string;
    href?: NonNullable<InertiaLinkProps['href']>;
};

type PageHeaderProps = {
    title: string;
    description?: string;
    breadcrumb?: BreadcrumbItem[];
    /** Label for the primary CTA button */
    actionLabel?: string;
    /** Navigate to this href when action button is clicked */
    actionHref?: string;
    /** Fire this callback when action button is clicked (ignored when actionHref is set) */
    onAction?: () => void;
    /** Optional icon shown in a rounded pill left of the title */
    icon?: LucideIcon;
};

export function PageHeader({
    title,
    description,
    breadcrumb,
    actionLabel,
    actionHref,
    onAction,
    icon: Icon,
}: PageHeaderProps) {
    const ActionButton = actionLabel ? (
        <Button className="shrink-0 gap-2">
            <Plus className="h-4 w-4" />
            {actionLabel}
        </Button>
    ) : null;

    return (
        <div className="flex flex-col gap-3">
            {/* Breadcrumb trail */}
            {breadcrumb && breadcrumb.length > 0 && (
                <nav
                    aria-label="Breadcrumb"
                    className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
                >
                    {breadcrumb.map((item, i) => (
                        <span key={i} className="flex items-center gap-1">
                            {i > 0 && (
                                <ChevronRight className="h-3 w-3 shrink-0" />
                            )}
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="transition-colors hover:text-foreground"
                                >
                                    {item.title}
                                </Link>
                            ) : (
                                <span className="font-medium text-foreground">
                                    {item.title}
                                </span>
                            )}
                        </span>
                    ))}
                </nav>
            )}

            {/* Title row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-muted">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {ActionButton &&
                    (actionHref ? (
                        <Link href={actionHref}>{ActionButton}</Link>
                    ) : (
                        <button
                            type="button"
                            onClick={onAction}
                            className="contents"
                        >
                            {ActionButton}
                        </button>
                    ))}
            </div>
        </div>
    );
}
