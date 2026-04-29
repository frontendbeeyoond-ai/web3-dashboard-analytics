"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ScrollDepthBucket, TrafficSourceData } from "@/types/analytics";

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#EC4899", "#14B8A6", "#F97316", "#84CC16"];

// ─── Funnel Chart ─────────────────────────────────────────────────────────────

interface FunnelStep { step: string; count: number; percentage: number; }

export function FunnelChart({ data }: { data: FunnelStep[] }) {
  const maxCount = data[0]?.count || 1;
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-semibold text-slate-900">Conversion Funnel</h3>
      <p className="mt-1 text-sm text-slate-500">User journey through conversion steps</p>
      <div className="mt-6 space-y-4">
        {data.map((step, index) => {
          const widthPercent = (step.count / maxCount) * 100;
          const isLast = index === data.length - 1;
          return (
            <div key={step.step} className="relative">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{step.step}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">{step.count.toLocaleString()}</span>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">{step.percentage}%</span>
                </div>
              </div>
              <div className="mt-2 h-8 w-full overflow-hidden rounded-lg bg-slate-100">
                <div
                  className={`h-full rounded-lg transition-all duration-500 ${isLast ? "bg-gradient-to-r from-green-500 to-green-400" : "bg-gradient-to-r from-blue-500 to-blue-400"}`}
                  style={{ width: `${Math.max(widthPercent, 5)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Scroll Depth Chart ───────────────────────────────────────────────────────

export function ScrollDepthChart({ data }: { data: ScrollDepthBucket[] }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-semibold text-slate-900">Scroll Depth</h3>
      <p className="mt-1 text-sm text-slate-500">Distribution of user scroll behaviour</p>
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
            <XAxis type="number" tick={{ fontSize: 12, fill: "#64748B" }} tickFormatter={(v) => `${v}%`} axisLine={{ stroke: "#E2E8F0" }} />
            <YAxis dataKey="range" type="category" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={{ stroke: "#E2E8F0" }} width={70} />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Percentage"]}
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Bar dataKey="percentage" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Users Over Time Chart ────────────────────────────────────────────────────

export function UsersOverTimeChart({ data }: { data: { date: string; value: number }[] }) {
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-semibold text-slate-900">Users Over Time</h3>
      <p className="mt-1 text-sm text-slate-500">Daily active users for the selected period</p>
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748B" }} tickFormatter={formatDate} axisLine={{ stroke: "#E2E8F0" }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={{ stroke: "#E2E8F0" }} />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), "Users"]}
              labelFormatter={formatDate}
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }} activeDot={{ r: 5, fill: "#3B82F6" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Traffic Pie Chart ────────────────────────────────────────────────────────

export function TrafficPieChart({ data }: { data: TrafficSourceData[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-semibold text-slate-900">Traffic Sources</h3>
      <p className="mt-1 text-sm text-slate-500">Distribution by acquisition channel</p>
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="count" nameKey="source">
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${((value / total) * 100).toFixed(1)}%  (${value.toLocaleString()} sessions)`,
                name ? name.charAt(0).toUpperCase() + name.slice(1) : name,
              ]}
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-xs text-slate-600">{value ? value.charAt(0).toUpperCase() + value.slice(1) : ""}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Country Table ────────────────────────────────────────────────────────────

export function CountryTable({ data }: { data: { country: string; sessions: number }[] }) {
  const maxSessions = data[0]?.sessions || 1;
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-semibold text-slate-900">Top Countries</h3>
      <p className="mt-1 text-sm text-slate-500">Sessions by country</p>
      <div className="mt-4 space-y-3">
        {data.slice(0, 8).map((row, i) => (
          <div key={row.country} className="flex items-center gap-3">
            <span className="w-5 text-right text-xs font-medium text-slate-400">{i + 1}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{row.country}</span>
                <span className="font-semibold text-slate-900">{row.sessions.toLocaleString()}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${(row.sessions / maxSessions) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Signup Breakdown ─────────────────────────────────────────────────────────

interface SignupBreakdownProps {
  status: { status: string; count: number }[];
  location: { location: string; count: number }[];
}

export function SignupBreakdown({ status, location }: SignupBreakdownProps) {
  const statusColors: Record<string, string> = {
    success: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    failed: "bg-red-100 text-red-700",
  };

  const locationLabel = (loc: string) =>
    loc.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const hasStatus = status.length > 0;
  const hasLocation = location.length > 0;
  if (!hasStatus && !hasLocation) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {hasStatus && (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Newsletter Signup Status</h3>
          <p className="mt-1 text-sm text-slate-500">Outcome of newsletter signup events</p>
          <div className="mt-5 flex flex-wrap gap-4">
            {status.map((s) => (
              <div key={s.status} className="flex flex-1 flex-col items-center justify-center rounded-xl bg-slate-50 p-4">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[s.status] ?? "bg-slate-100 text-slate-700"}`}>
                  {s.status}
                </span>
                <span className="mt-2 text-2xl font-bold text-slate-900">{s.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasLocation && (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Signup Location</h3>
          <p className="mt-1 text-sm text-slate-500">Where on the page users signed up</p>
          <div className="mt-4 space-y-3">
            {location.map((loc) => {
              const maxCount = Math.max(...location.map((l) => l.count));
              return (
                <div key={loc.location} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{locationLabel(loc.location)}</span>
                      <span className="font-semibold text-slate-900">{loc.count.toLocaleString()}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-purple-500" style={{ width: `${(loc.count / maxCount) * 100}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BehaviorCharts (kept for backward compat, now shows scroll depth only) ──

export function BehaviorCharts({ scrollData }: { scrollData: ScrollDepthBucket[] }) {
  if (!scrollData || scrollData.length === 0) return null;
  return <ScrollDepthChart data={scrollData} />;
}
