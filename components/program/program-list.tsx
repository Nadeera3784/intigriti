"use client"

import { format } from "date-fns"
import { memo } from "react"
import { Button } from "@/components/ui/button"
import { EditIcon, EllipsisVertical, TrashIcon, ChevronUp, ChevronDown } from "lucide-react"
import { cn, truncate } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Program, ProgramListProps } from "@/interfaces"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ProgramRow = memo(({ program, onEdit, onDelete }: { 
  program: Program, 
  onEdit?: (program: Program) => void, 
  onDelete?: (programId: string) => void 
}) => (
  <tr key={program.id} className="border-t border-gray-200 hover:bg-muted/25">
    <td className="p-2 font-medium text-primary">{truncate(program.name, 15)}</td>
    <td className="p-2">{format(program.startDate, "MMM dd, yyyy")}</td>
    <td className="p-2 font-mono text-sm">{truncate(program.identifier, 15)}</td>
    <td className="p-2">
     <Tooltip>
        <TooltipTrigger>{truncate(program.description || "", 10)}</TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{ program.description || "" }</p>
        </TooltipContent>
     </Tooltip>
    </td>
    <td className="p-2">
      <span className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        program.eligibility === "eligible" 
          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
      )}>
        {program.eligibility === "eligible" ? "Eligible" : "Ineligible"}
      </span>
    </td>
    <td className="p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8 curser-pointer"
            size="icon"
          >
            <EllipsisVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(program)}>
              <EditIcon className="h-4 w-4" />Edit
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(program.id)}>
              <TrashIcon className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </td>
  </tr>
))

ProgramRow.displayName = 'ProgramRow'

const TableHeader = memo(({ onSort, currentSort, getSortIcon, handleSort }: { //eslint-disable-line
  onSort?: (sortBy: string, sortOrder: 'asc' | 'desc') => void,
  currentSort?: { field: string, order: 'asc' | 'desc' },
  getSortIcon: (field: string) => React.ReactNode,
  handleSort: (field: string) => void
}) => (
  <thead className="bg-muted/50">
    <tr>
      <th className="text-left p-2 font-medium">
        <button 
          onClick={() => handleSort('name')}
          className={cn(
            "flex items-center hover:text-primary transition-colors",
            onSort ? "cursor-pointer" : "cursor-default"
          )}
          disabled={!onSort}
        >
          Program
          {getSortIcon('name')}
        </button>
      </th>
      <th className="text-left p-2 font-medium">
        <button 
          onClick={() => handleSort('startDate')}
          className={cn(
            "flex items-center hover:text-primary transition-colors",
            onSort ? "cursor-pointer" : "cursor-default"
          )}
          disabled={!onSort}
        >
          Start Date
          {getSortIcon('startDate')}
        </button>
      </th>
      <th className="text-left p-2 font-medium">Asset Identifier</th>
      <th className="text-left p-2 font-medium">Description</th>
      <th className="text-left p-2 font-medium">
        <button 
          onClick={() => handleSort('eligibility')}
          className={cn(
            "flex items-center hover:text-primary transition-colors",
            onSort ? "cursor-pointer" : "cursor-default"
          )}
          disabled={!onSort}
        >
          Bounty Eligibility
          {getSortIcon('eligibility')}
        </button>
      </th>
      <th className="text-left p-2 font-medium"></th>
    </tr>
  </thead>
))

TableHeader.displayName = 'TableHeader'

function ProgramListComponent({ programs, onEdit, onDelete, onSort, currentSort, pagination }: ProgramListProps) {
  const handleSort = (field: string) => {
    if (!onSort) return
    
    const newOrder = currentSort?.field === field && currentSort?.order === 'asc' ? 'desc' : 'asc'
    onSort(field, newOrder)
  }

  const getSortIcon = (field: string) => {
    if (!currentSort || currentSort.field !== field) {
      return null
    }
    return currentSort.order === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1 inline" /> : 
      <ChevronDown className="h-4 w-4 ml-1 inline" />
  }
  if (programs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No programs created yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
         <h3 className="text-xl font-bold">All programs</h3>
         {pagination && (
           <p className="text-sm text-muted-foreground">
             Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of {pagination.totalCount} programs
           </p>
         )}
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <TableHeader 
            onSort={onSort}
            currentSort={currentSort}
            getSortIcon={getSortIcon}
            handleSort={handleSort}
          />
          <tbody>
            {programs.map((program) => (
              <ProgramRow 
                key={program.id}
                program={program}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const ProgramList = memo(ProgramListComponent)
