"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  resultCount: number;
  totalCount: number;
  onReset: () => void;
  hideStatusDropdown?: boolean;
}

export function ProjectFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  resultCount,
  totalCount,
  onReset,
  hideStatusDropdown = false,
}: ProjectFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const hasFilters = searchQuery.trim().length > 0 || statusFilter !== "all";

  return (
    <>
      {/* Mobile Layout */}
      <div className="sm:hidden space-y-2">
        <div className="flex gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <label htmlFor="project-search-mobile" className="sr-only">
              Cari proyek
            </label>
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="project-search-mobile"
              placeholder="Cari proyek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-8 h-9 text-[11px] font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5"
                aria-label="Hapus pencarian"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>
          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="icon"
            className={cn("h-9 w-9 shrink-0", hasFilters && "border-primary")}
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            aria-label="Tampilkan filter"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Expandable Filters */}
        {showMobileFilters && (
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1 h-9 text-[11px] font-medium">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="On Progress">Development</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={onReset}
              disabled={!hasFilters}
              aria-label="Reset filter"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Count */}
        <p className="text-[11px] text-muted-foreground">
          {resultCount} dari {totalCount} proyek
        </p>
      </div>

      {/* Desktop Layout - Single Row */}
      <div className="hidden sm:flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <label htmlFor="project-search" className="sr-only">
            Cari proyek
          </label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="project-search"
            placeholder="Cari proyek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-[11px] font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label="Hapus pencarian"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        {!hideStatusDropdown && (
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className={cn(
                "w-[140px] h-9 text-[11px] font-medium",
                statusFilter !== "all" && "border-primary",
              )}
            >
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="On Progress">Development</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Reset */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={onReset}
          disabled={!hasFilters}
          aria-label="Reset filter"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Count - Right */}
        <span className="text-[11px] text-muted-foreground ml-auto tabular-nums">
          {resultCount}/{totalCount}
        </span>
      </div>
    </>
  );
}
