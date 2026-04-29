"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { OnlineShopAnalyticsData } from "@/types/analytics";
import RealtimeSection from "@/components/RealtimeSection";

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-6 shadow-sm ring-1 ${
        highlight ? "bg-orange-600 ring-orange-500" : "bg-white ring-slate-200"
      }`}
    >
      <p className={`text-xs font-medium uppercase tracking-wider ${highlight ? "text-orange-100" : "text-slate-500"}`}>
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold ${highlight ? "text-white" : "text-slate-900"}`}>{value}</p>
    </div>
  );
}

// ─── Events Over Time Chart ────────────────────────────────────────────────────

function EventsOverTimeChart({ data }: { data: { date: string; value: number }[] }) {
  if (!data || data.length === 0) return null;
  const formatted = data.map((d) => ({ ...d, label: d.date.slice(5) }));

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
        Online Shop Clicks Over Time
      </h3>
      <p className="mt-1 text-xs text-slate-400">Daily event count</p>
      <div className="mt-4 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatted} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              labelFormatter={(l) => `Date: ${l}`}
              formatter={(v: number) => [v.toLocaleString(), "Shop Clicks"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#F97316"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Breakdown Table ───────────────────────────────────────────────────────────

interface BreakdownRow {
  dimension: string;
  eventCount: number;
  totalUsers: number;
}

function BreakdownTable({
  title,
  dimensionLabel,
  rows,
  totalEvents,
  truncate,
}: {
  title: string;
  dimensionLabel: string;
  rows: BreakdownRow[];
  totalEvents: number;
  truncate?: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">{title}</h3>
        <p className="mt-6 text-center text-sm text-slate-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                {dimensionLabel}
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                Events
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                Users
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                % Share
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              const isSelected = selected === row.dimension;
              const share =
                totalEvents > 0 ? ((row.eventCount / totalEvents) * 100).toFixed(1) : "0.0";
              const displayLabel =
                truncate && row.dimension.length > 48
                  ? row.dimension.slice(0, 46) + "…"
                  : row.dimension;

              return (
                <tr
                  key={row.dimension}
                  onClick={() => setSelected(isSelected ? null : row.dimension)}
                  title={truncate ? row.dimension : undefined}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-orange-50 ring-1 ring-inset ring-orange-200"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-5 py-3 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-orange-500" />
                      )}
                      <span className="break-all">{displayLabel}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-900">
                    {row.eventCount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right text-slate-600">
                    {row.totalUsers.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-orange-500"
                          style={{ width: `${Math.min(parseFloat(share), 100)}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-slate-500">{share}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

function OnlineShopAnalyticsPage() {
  const [data, setData] = useState<OnlineShopAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const qs = searchParams.toString();
        const res = await fetch(`/api/analytics/onlineshop${qs ? `?${qs}` : ""}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.details || body.error || "Failed to fetch online shop analytics");
        }
        const json = await res.json();
        setData(json);
        setLastFetched(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [refreshKey, searchParams]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
              <div className="h-5 w-px bg-slate-200" />
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">online_shop_click</h1>
                  <p className="text-xs text-slate-500">
                    Live from Google Analytics 4
                    {lastFetched && ` · updated ${lastFetched.toLocaleTimeString()}`}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              <svg
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isLoading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading && !data && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
            <p className="mt-4 text-sm text-slate-500">Loading online shop analytics…</p>
          </div>
        )}

        {data && (
          <>
            {/* KPI Row 1 */}
            <section className="mb-8 grid gap-4 sm:grid-cols-3">
              <KPICard label="Number of Events" value={data.totalEvents.toLocaleString()} />
              <KPICard label="Total Users" value={data.totalUsers.toLocaleString()} />
              <KPICard label="Events per Active User" value={data.eventsPerActiveUser} />
            </section>

            {/* KPI Row 2 */}
            <section className="mb-8 grid gap-4 sm:grid-cols-3">
              <KPICard
                label="Events of the Last 30 Minutes"
                value={data.eventsLast30Min.toLocaleString()}
                highlight
              />
              <KPICard label="Events per Session" value={data.eventsPerSession} />
              <KPICard label="Total Sessions" value={data.sessions.toLocaleString()} />
            </section>

            {/* Events over time */}
            <section className="mb-8">
              <EventsOverTimeChart data={data.eventsOverTime} />
            </section>

            {/* Realtime report */}
            <section className="mb-8">
              <RealtimeSection eventName="online_shop_click" accentColor="orange" />
            </section>

            {/* Country + Destination URL */}
            <section className="mb-8 grid gap-6 lg:grid-cols-2">
              <BreakdownTable
                title="Number of Events after Country"
                dimensionLabel="Country"
                rows={data.countryBreakdown}
                totalEvents={data.totalEvents}
              />
              <BreakdownTable
                title="Destination URL"
                dimensionLabel="URL"
                rows={data.destinationUrlBreakdown}
                totalEvents={data.totalEvents}
                truncate
              />
            </section>

            {/* Button Text — full width */}
            <section className="mb-8">
              <BreakdownTable
                title="Button Text"
                dimensionLabel="Button Text"
                rows={data.buttonTextBreakdown}
                totalEvents={data.totalEvents}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
