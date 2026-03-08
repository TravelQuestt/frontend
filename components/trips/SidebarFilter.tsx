"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ArrowUp,
  ArrowDown,
  SearchIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SidebarFilters = {
  searchTerm: string;
  orderDirection: "asc" | "desc";
  orderBy: string;
  status: "ALL" | "PLANNED" | "ONGOING" | "COMPLETED";
  pageNumber: number;
  pageSize: number;
};

interface SidebarFilterProps {
  filters: SidebarFilters;
  onChange: (filters: SidebarFilters) => void;
  onApply: () => void;
}

function FilterOption({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon?: any;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full h-11 px-4 rounded-md text-left transition-colors",
        "hover:bg-accent",
        active && "bg-accent font-medium"
      )}
    >
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      <span className="flex-1">{children}</span>
    </button>
  );
}

export default function SidebarFilter({
  filters,
  onChange,
  onApply,
}: SidebarFilterProps) {
  const [searchInput, setSearchInput] = useState(filters.searchTerm);

  const applySearch = () => {
    onChange({
      ...filters,
      searchTerm: searchInput,
      pageNumber: 0,
    });
  };

  return (
    <aside className="bg-background text-foreground p-6 w-full shrink-0 space-y-8 text-sm">
      {/* ── Search ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Search
        </h2>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-9 h-11"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applySearch()}
            />
          </div>

          <Button
            type="button"
            variant="secondary"
            className="h-11 px-5 shrink-0"
            onClick={applySearch}
          >
            <SearchIcon />
          </Button>
        </div>
      </section>

      {/* ── Sort Direction ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Sort Direction
        </h2>

        <div className="space-y-1">
          <FilterOption
            active={filters.orderDirection === "asc"}
            onClick={() => onChange({ ...filters, orderDirection: "asc" })}
            icon={ArrowUp}
          >
            Ascending
          </FilterOption>

          <FilterOption
            active={filters.orderDirection === "desc"}
            onClick={() => onChange({ ...filters, orderDirection: "desc" })}
            icon={ArrowDown}
          >
            Descending
          </FilterOption>
        </div>
      </section>

      {/* ── Order By ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Order By
        </h2>

        <div className="space-y-1">
          {[
            { key: "name", label: "Name" },
            { key: "updatedAt", label: "Updated" },
            { key: "createdAt", label: "Date" },
            { key: "rating", label: "Rating" },
          ].map(({ key, label }) => (
            <FilterOption
              key={key}
              active={filters.orderBy === key}
              onClick={() => onChange({ ...filters, orderBy: key })}
            >
              {label}
            </FilterOption>
          ))}
        </div>
      </section>
    </aside>
  );
}