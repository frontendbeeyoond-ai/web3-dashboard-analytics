"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { NewsletterAnalyticsData, NewsletterBreakdownRow } from "@/types/analytics";

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

// ─── Breakdown Table ───────────────────────────────────────────────────────────

interface BreakdownTableProps {
  title: string;
  rows: NewsletterBreakdownRow[];
  dimensionLabel: string;
  totalEvents: number;
}

function BreakdownTable({ title, rows, dimensionLabel, totalEvents }: BreakdownTableProps) {
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
                Number of Events
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Users
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
                totalEvents > 0
                  ? ((row.eventCount / totalEvents) * 100).toFixed(1)
                  : "0.0";
              return (
                <tr
                  key={row.dimension}
                  onClick={() => setSelected(isSelected ? null : row.dimension)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-50 ring-1 ring-inset ring-blue-200"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-5 py-3 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                      <span>{row.dimension}</span>
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
                          className="h-full rounded-full bg-blue-500"
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

// ─── Events Over Time Chart ────────────────────────────────────────────────────

function EventsOverTimeChart({ data }: { data: { date: string; value: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
          Newsletter Signups Over Time
        </h3>
        <p className="mt-6 text-center text-sm text-slate-400">No data available</p>
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    label: d.date.slice(5), // show MM-DD
  }));

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
        Newsletter Signups Over Time
      </h3>
      <p className="mt-1 text-xs text-slate-400">Daily event count</p>
      <div className="mt-4 h-56">
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
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
              labelFormatter={(l) => `Date: ${l}`}
              formatter={(v: number) => [v.toLocaleString(), "Events"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
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

export default function NewsletterAnalyticsPage() {
  const [data, setData] = useState<NewsletterAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/analytics/newsletter");
        if (!res.ok) throw new Error("Failed to fetch newsletter analytics");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
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
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">newsletter_signup</h1>
                <p className="text-xs text-slate-500">Event detail — last 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && !data && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-slate-500">Loading newsletter analytics…</p>
          </div>
        )}

        {data && (
          <>
            {/* KPI Cards */}
            <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KPICard label="Number of Events" value={data.totalEvents.toLocaleString()} />
              <KPICard label="Total Users" value={data.totalUsers.toLocaleString()} />
              <KPICard label="Active Users" value={data.activeUsers.toLocaleString()} />
              <KPICard label="Events per Active User" value={data.eventsPerActiveUser} />
            </section>

            <section className="mb-8 grid gap-4 sm:grid-cols-2">
              <KPICard label="Events per Session" value={data.eventsPerSession} />
              <KPICard label="Total Sessions" value={data.sessions.toLocaleString()} />
            </section>

            {/* Events over time chart */}
            <section className="mb-8">
              <EventsOverTimeChart data={data.eventsOverTime} />
            </section>

            {/* Breakdown tables — 2-column grid */}
            <section className="mb-8 grid gap-6 lg:grid-cols-2">
              <BreakdownTable
                title="Signup Status"
                rows={data.signupStatus}
                dimensionLabel="Status"
                totalEvents={data.totalEvents}
              />
              <BreakdownTable
                title="Signup Location"
                rows={data.signupLocation}
                dimensionLabel="Location"
                totalEvents={data.totalEvents}
              />
            </section>

            <section className="mb-8 grid gap-6 lg:grid-cols-2">
              <BreakdownTable
                title="Country"
                rows={data.countryBreakdown}
                dimensionLabel="Country"
                totalEvents={data.totalEvents}
              />
              <BreakdownTable
                title="E-mail"
                rows={data.emailBreakdown}
                dimensionLabel="E-mail"
                totalEvents={data.totalEvents}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
