import { RotateCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export type FilterOption = {
    label: string;
    value: string;
};

type CrudFiltersProps = {
    /** Controlled search string */
    search: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;

    /** Status filter — shown only when true */
    showStatusFilter?: boolean;
    statusValue?: string;
    onStatusChange?: (value: string) => void;
    /** Options rendered inside the status <Select> */
    statusOptions?: FilterOption[];
    statusPlaceholder?: string;

    /** Sort filter — shown only when true */
    showSortFilter?: boolean;
    sortValue?: string;
    onSortChange?: (value: string) => void;
    /** Options rendered inside the sort <Select> */
    sortOptions?: FilterOption[];
    sortPlaceholder?: string;

    /** Shown as "X of Y" counter on the right */
    total?: number;
    filtered?: number;

    /** Slot for any extra controls (e.g. a date range picker) */
    children?: React.ReactNode;
};

export function CrudFilters({
    search,
    onSearchChange,
    searchPlaceholder = 'Search…',

    showStatusFilter = false,
    statusValue,
    onStatusChange,
    statusOptions = [],
    statusPlaceholder = 'All statuses',

    showSortFilter = false,
    sortValue,
    onSortChange,
    sortOptions = [],
    sortPlaceholder = 'Sort by…',

    total,
    filtered,

    children,
}: CrudFiltersProps) {
    const hasActiveFilter =
        search !== '' ||
        (statusValue !== undefined && statusValue !== '') ||
        (sortValue !== undefined && sortValue !== '');

    const handleReset = () => {
        onSearchChange('');
        onStatusChange?.('');
        onSortChange?.('');
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative min-w-48 flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Status filter */}
            {showStatusFilter && (
                <Select
                    value={statusValue ?? ''}
                    onValueChange={onStatusChange}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder={statusPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.length === 0 ? (
                            <div className="px-2 py-3 text-center text-sm text-muted-foreground">
                                No options
                            </div>
                        ) : (
                            statusOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
            )}

            {/* Sort filter */}
            {showSortFilter && (
                <Select value={sortValue ?? ''} onValueChange={onSortChange}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder={sortPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOptions.length === 0 ? (
                            <div className="px-2 py-3 text-center text-sm text-muted-foreground">
                                No options
                            </div>
                        ) : (
                            sortOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
            )}

            {/* Extra slot */}
            {children}

            {/* Reset */}
            {hasActiveFilter && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="gap-1.5"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                </Button>
            )}

            {/* Count indicator */}
            {total !== undefined && (
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {filtered !== undefined && filtered !== total ? (
                        <>
                            {filtered} of {total}
                        </>
                    ) : (
                        <>{total} total</>
                    )}
                </span>
            )}
        </div>
    );
}
