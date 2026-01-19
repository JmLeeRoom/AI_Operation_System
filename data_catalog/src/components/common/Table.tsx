import { ReactNode } from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id?: string | number }>({ 
  columns, 
  data, 
  onRowClick 
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/50">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
            {onRowClick && <th style={{ width: '50px' }}></th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIdx) => (
            <tr 
              key={item.id ?? rowIdx}
              className={onRowClick ? 'cursor-pointer' : ''}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx}>
                  {col.render 
                    ? col.render(item) 
                    : String((item as Record<string, unknown>)[col.key as string] ?? '-')
                  }
                </td>
              ))}
              {onRowClick && (
                <td>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface SimpleTableRowProps {
  label: string;
  value: ReactNode;
  link?: string;
}

export const SimpleTableRow = ({ label, value, link }: SimpleTableRowProps) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-200">{value}</span>
      {link && (
        <ExternalLink className="w-3.5 h-3.5 text-slate-500 hover:text-brand-400 cursor-pointer" />
      )}
    </div>
  </div>
);
