"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MinuteData {
  minutesAgo: number;
  count: number;
}

interface RealtimeData {
  total: number;
  minuteData: MinuteData[];
}

const ACCENT = {
  blue: {
    bar: "#3B82F6",
    bg: "bg-blue-50",
    text: "text-blue-600",
    pulse: "bg-blue-500",
    ring: "ring-blue-200",
  },
  green: {
    bar: "#10B981",
    bg: "bg-green-50",
    text: "text-green-600",
    pulse: "bg-green-500",
    ring: "ring-green-200",
  },
  purple: {
    bar: "#8B5CF6",
    bg: "bg-purple-50",
    text: "text-purple-600",
    pulse: "bg-purple-500",
    ring: "ring-purple-200",
  },
  orange: {
    bar: "#F97316",
    bg: "bg-orange-50",
    text: "text-orange-600",
    pulse: "bg-orange-500",
    ring: "ring-orange-200",
  },
  indigo: {
    bar: "#6366F1",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    pulse: "bg-indigo-500",
    ring: "ring-indigo-200",
  },
  amber: {
    bar: "#F59E0B",
    bg: "bg-amber-50",
    text: "text-amber-600",
    pulse: "bg-amber-500",
    ring: "ring-amber-200",
  },
} as const;

export default function RealtimeSection({
  eventName,
  accentColor = "blue",
}: {
  eventName: string;
  accentColor?: keyof typeof ACCENT;
}) {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const accent = ACCENT[accentColor];

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/analytics/realtime?event=${encodeURIComponent(eventName)}`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.details || body.error || "Failed to fetch realtime data");
      }
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [eventName]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const chartData =
    data?.minuteData.map((d) => ({
      label: d.minutesAgo === 0 ? "now" : `${d.minutesAgo}m`,
      count: d.count,
    })) || [];

  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
            Realtime Activity
          </h3>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${accent.pulse} opacity-75`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${accent.pulse}`}
              />
            </span>
            <span className={`text-xs font-semibold uppercase ${accent.text}`}>
              Live
            </span>
          </div>
        </div>
        <span className="text-xs text-slate-400">
          {lastUpdated
            ? `Updated ${lastUpdated.toLocaleTimeString()} · auto-refreshes every 30s`
            : "Loading…"}
        </span>
      </div>

      <div className="p-5">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading && !data && (
          <div className="flex items-center justify-center py-10">
            <div
              className="h-7 w-7 animate-spin rounded-full border-4 border-slate-200"
              style={{ borderTopColor: accent.bar }}
            />
          </div>
        )}

        {data && (
          <>
            {/* Total count badge */}
            <div
              className={`mb-5 inline-flex items-baseline gap-2 rounded-lg ${accent.bg} px-4 py-3 ring-1 ${accent.ring}`}
            >
              <span className={`text-3xl font-bold ${accent.text}`}>
                {data.total.toLocaleString()}
              </span>
              <span className="text-sm text-slate-600">
                events in the last 30 minutes
              </span>
            </div>

            {/* Minute-by-minute bar chart */}
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    interval={4}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
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
                    labelFormatter={(l) =>
                      l === "now" ? "Current minute" : `${l} ago`
                    }
                    formatter={(v: number) => [v.toLocaleString(), "Events"]}
                    cursor={{ fill: "rgba(148,163,184,0.1)" }}
                  />
                  <Bar
                    dataKey="count"
                    fill={accent.bar}
                    radius={[2, 2, 0, 0]}
                    maxBarSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
