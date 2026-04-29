"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FilterParams, DeviceType, TrafficSource, Country } from "@/types/analytics";

interface FiltersProps {
  onFilterChange: (filters: FilterParams) => void;
  isLoading?: boolean;
}

const DEVICE_OPTIONS: { value: DeviceType | "all"; label: string }[] = [
  { value: "all", label: "All Devices" },
  { value: "mobile", label: "Mobile" },
  { value: "desktop", label: "Desktop" },
  { value: "tablet", label: "Tablet" },
];

const SOURCE_OPTIONS: { value: TrafficSource | "all"; label: string }[] = [
  { value: "all", label: "All Sources" },
  { value: "google", label: "Google" },
  { value: "twitter", label: "Twitter" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "direct", label: "Direct" },
  { value: "referral", label: "Referral" },
];

const COUNTRY_OPTIONS: { value: Country | "all"; label: string }[] = [
  { value: "all", label: "All Countries" },
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Spain", label: "Spain" },
  { value: "Italy", label: "Italy" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
  { value: "Japan", label: "Japan" },
  { value: "Brazil", label: "Brazil" },
];

export default function Filters({ onFilterChange, isLoading }: FiltersProps) {
  const [filters, setFilters] = useState<FilterParams>({
    start_date: "",
    end_date: "",
    device_type: "all",
    traffic_source: "all",
    campaign_name: "all",
    country: "all",
  });

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const handleFilterChange = useCallback(
    (key: keyof FilterParams, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));

      // Debounce API calls
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        onFilterChange({ ...filters, [key]: value });
      }, 300);

      setDebounceTimer(timer);
    },
    [filters, onFilterChange, debounceTimer]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleReset = () => {
    const defaultFilters: FilterParams = {
      start_date: "",
      end_date: "",
      device_type: "all",
      traffic_source: "all",
      campaign_name: "all",
      country: "all",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.start_date ||
    filters.end_date ||
    filters.device_type !== "all" ||
    filters.traffic_source !== "all" ||
    filters.campaign_name !== "all" ||
    filters.country !== "all";

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      {/* Mobile-first responsive grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Date Range - Start */}
        <div className="space-y-1">
          <label htmlFor="start_date" className="block text-xs font-medium text-slate-600">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="start_date"
              value={filters.start_date || ""}
              onChange={(e) => handleFilterChange("start_date", e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Date Range - End */}
        <div className="space-y-1">
          <label htmlFor="end_date" className="block text-xs font-medium text-slate-600">
            End Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="end_date"
              value={filters.end_date || ""}
              onChange={(e) => handleFilterChange("end_date", e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Device Type */}
        <div className="space-y-1">
          <label htmlFor="device_type" className="block text-xs font-medium text-slate-600">
            Device Type
          </label>
          <div className="relative">
            <select
              id="device_type"
              value={filters.device_type}
              onChange={(e) => handleFilterChange("device_type", e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {DEVICE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Traffic Source */}
        <div className="space-y-1">
          <label htmlFor="traffic_source" className="block text-xs font-medium text-slate-600">
            Traffic Source
          </label>
          <div className="relative">
            <select
              id="traffic_source"
              value={filters.traffic_source}
              onChange={(e) => handleFilterChange("traffic_source", e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {SOURCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Country */}
        <div className="space-y-1">
          <label htmlFor="country" className="block text-xs font-medium text-slate-600">
            Country
          </label>
          <div className="relative">
            <select
              id="country"
              value={filters.country}
              onChange={(e) => handleFilterChange("country", e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {COUNTRY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={handleReset}
            disabled={!hasActiveFilters || isLoading}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              hasActiveFilters
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-slate-50 text-slate-400 cursor-not-allowed"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      {/* Active Filters Badge */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <span className="text-xs text-slate-500">Active filters:</span>
          {filters.start_date && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
              From: {filters.start_date}
            </span>
          )}
          {filters.end_date && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
              To: {filters.end_date}
            </span>
          )}
          {filters.device_type !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700">
              Device: {filters.device_type}
            </span>
          )}
          {filters.traffic_source !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
              Source: {filters.traffic_source}
            </span>
          )}
          {filters.country !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
              Country: {filters.country}
            </span>
          )}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm text-slate-500">Updating data...</span>
        </div>
      )}
    </div>
  );
}
