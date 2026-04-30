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
import { TrustpilotAnalyticsData } from "@/types/analytics";
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
        highlight ? "bg-amber-500 ring-amber-400" : "bg-white ring-slate-200"
      }`}
    >
      <p className={`text-xs font-medium uppercase tracking-wider ${highlight ? "text-amber-100" : "text-slate-500"}`}>
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
        Trustpilot Clicks Over Time
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
              formatter={(v: number) => [v.toLocaleString(), "Trustpilot Clicks"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#F59E0B"
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

// ─── Page ──────────────────────────────────────────────────────────────────────

function TrustpilotAnalyticsPage() {
  const [data, setData] = useState<TrustpilotAnalyticsData | null>(null);
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
        const res = await fetch(`/api/analytics/trustpilot${qs ? `?${qs}` : ""}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.details || body.error || "Failed to fetch trustpilot analytics");
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
                <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">trustpilot_click</h1>
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
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500" />
            <p className="mt-4 text-sm text-slate-500">Loading trustpilot analytics…</p>
          </div>
        )}

        {data && (
          <>
            {/* KPI Row 1 */}
            <section className="mb-8 grid gap-4 sm:grid-cols-3">
              <KPICard label="Number of Events" value={data.totalEvents.toLocaleString()} />
              <KPICard label="Total Users" value={data.totalUsers.toLocaleString()} />
              <KPICard label="Events per Session" value={data.eventsPerSession} />
            </section>

            {/* KPI Row 2 — highlight */}
            <section className="mb-8 grid gap-4 sm:grid-cols-3">
              <KPICard
                label="Events of the Last 30 Minutes"
                value={data.eventsLast30Min.toLocaleString()}
                highlight
              />
              <KPICard label="Total Sessions" value={data.sessions.toLocaleString()} />
            </section>

            {/* Events over time */}
            <section className="mb-8">
              <EventsOverTimeChart data={data.eventsOverTime} />
            </section>

            {/* Realtime report */}
            <section className="mb-8">
              <RealtimeSection eventName="trustpilot_click" accentColor="amber" />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default function TrustpilotPage() {
  return (
    <Suspense>
      <TrustpilotAnalyticsPage />
    </Suspense>
  );
}
