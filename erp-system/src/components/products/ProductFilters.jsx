"use client";

import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

export default function ProductFilters({
  search,
  setSearch,
  onSearch,
  status,
  setStatus,
  category,
  setCategory,
  onReset,
}) {
  const hasFilters =
    search || status || category;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row">
        <form
          onSubmit={handleSubmit}
          className="relative flex-1"
        >
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search products..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-24 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100"
          />

          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
          >
            Search
          </button>
        </form>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-slate-300"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <input
          type="text"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
          placeholder="Category"
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none placeholder:text-slate-400 focus:border-slate-300"
        />

        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <X size={15} />
            Reset
          </button>
        )}

        <div className="hidden items-center justify-center rounded-xl border border-slate-200 px-3 text-slate-400 lg:flex">
          <SlidersHorizontal size={17} />
        </div>
      </div>
    </div>
  );
}