import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type RowActionsProps = {
    /** View / profile action — hidden when undefined */
    onView?: () => void;
    viewLabel?: string;
    /** Edit action — hidden when undefined */
    onEdit?: () => void;
    editLabel?: string;
    /** Delete action — hidden when undefined */
    onDelete?: () => void;
    deleteLabel?: string;
};

export function RowActions({
    onView,
    viewLabel = 'View',
    onEdit,
    editLabel = 'Edit',
    onDelete,
    deleteLabel = 'Delete',
}: RowActionsProps) {
    const hasTopActions = onView !== undefined || onEdit !== undefined;
    const hasDestructive = onDelete !== undefined;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open actions</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
                {onView && (
                    <DropdownMenuItem onClick={onView} className="gap-2">
                        <Eye className="h-3.5 w-3.5" />
                        {viewLabel}
                    </DropdownMenuItem>
                )}
                {onEdit && (
                    <DropdownMenuItem onClick={onEdit} className="gap-2">
                        <Pencil className="h-3.5 w-3.5" />
                        {editLabel}
                    </DropdownMenuItem>
                )}

                {hasTopActions && hasDestructive && <DropdownMenuSeparator />}

                {onDelete && (
                    <DropdownMenuItem
                        onClick={onDelete}
                        className="gap-2 text-destructive focus:text-destructive"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deleteLabel}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
