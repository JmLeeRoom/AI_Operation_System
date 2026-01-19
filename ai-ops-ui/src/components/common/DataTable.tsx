import { cn } from '../../lib/utils';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  sortColumn,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    
    const isActive = sortColumn === column.key;
    
    return (
      <span className="ml-1 inline-flex">
        {isActive ? (
          sortDirection === 'asc' ? (
            <ChevronUp size={14} className="text-primary" />
          ) : (
            <ChevronDown size={14} className="text-primary" />
          )
        ) : (
          <ChevronsUpDown size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </span>
    );
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                onClick={() => column.sortable && onSort?.(String(column.key))}
                className={cn(
                  'px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider',
                  column.sortable && 'cursor-pointer hover:text-foreground group',
                  column.className
                )}
              >
                <span className="inline-flex items-center">
                  {column.header}
                  {renderSortIcon(column)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'bg-card transition-colors',
                onRowClick && 'cursor-pointer hover:bg-secondary/50'
              )}
            >
              {columns.map((column) => (
                <td
                  key={`${row.id}-${String(column.key)}`}
                  className={cn('px-4 py-4 text-sm text-foreground', column.className)}
                >
                  {column.render
                    ? column.render(row)
                    : String(row[column.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  );
}
