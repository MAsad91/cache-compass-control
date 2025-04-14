
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";
import { CacheEntry } from "@/services/api";
import { ApiService } from "@/services/api";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

const columns: ColumnDef<CacheEntry>[] = [
  {
    accessorKey: "key",
    header: "Cache Key",
    cell: ({ row }) => <div className="truncate max-w-[200px]">{row.getValue("key")}</div>,
  },
  {
    accessorKey: "ttl",
    header: "TTL",
    cell: ({ row }) => {
      const ttl = row.getValue<number>("ttl");
      // Format seconds to readable duration
      const hours = Math.floor(ttl / 3600);
      const minutes = Math.floor((ttl % 3600) / 60);
      const seconds = ttl % 60;
      
      let formatted = "";
      if (hours > 0) formatted += `${hours}h `;
      if (minutes > 0) formatted += `${minutes}m `;
      if (seconds > 0 || (hours === 0 && minutes === 0)) formatted += `${seconds}s`;
      
      return formatted;
    },
  },
  {
    accessorKey: "hits",
    header: "Hits",
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      const size = row.getValue<number>("size");
      return size < 1000 ? `${size} B` : `${(size / 1000).toFixed(1)} KB`;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      try {
        const dateValue = row.getValue<string>("createdAt");
        // Check if the date is valid before formatting
        if (!dateValue) return "Unknown";
        
        const date = new Date(dateValue);
        // Check if date is valid (not Invalid Date)
        if (isNaN(date.getTime())) return "Invalid date";
        
        return formatDistanceToNow(date, { addSuffix: true });
      } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date";
      }
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      try {
        const expiresAt = new Date(row.original.expiresAt);
        const now = new Date();
        // Check if date is valid before comparing
        if (isNaN(expiresAt.getTime())) {
          return <Badge variant="warning">Unknown</Badge>;
        }
        
        const isExpired = expiresAt < now;
        
        return (
          <Badge variant={isExpired ? "destructive" : "success"}>
            {isExpired ? "Expired" : "Active"}
          </Badge>
        );
      } catch (error) {
        console.error("Error checking expiration:", error);
        return <Badge variant="warning">Error</Badge>;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => ApiService.clearCacheEntry(row.original.key)}
          className="rounded-md"
        >
          Clear
        </Button>
      );
    },
  },
];

interface DataTableProps {
  data: CacheEntry[];
  pageCount: number;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination: React.Dispatch<React.SetStateAction<{
    pageIndex: number;
    pageSize: number;
  }>>;
}

export function CacheEntriesTable({ data, pageCount, pagination, setPagination }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  return (
    <div className="rounded-md border bg-card w-full">
      <div className="flex items-center justify-between p-4">
        <Input
          placeholder="Filter cache entries..."
          className="max-w-sm"
          aria-label="Filter cache entries"
        />
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => ApiService.clearAllCache()}
            className="rounded-md"
          >
            Clear All Cache
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No cache entries found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 p-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {pagination.pageIndex * pagination.pageSize + 1}-
          {Math.min((pagination.pageIndex + 1) * pagination.pageSize, data.length)} of{" "}
          {data.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="First page"
            className="rounded-md"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
            className="rounded-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
            className="rounded-md"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Last page"
            className="rounded-md"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
