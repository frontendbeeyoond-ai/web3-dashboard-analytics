"use client";

import React from "react";
import { CampaignData } from "@/types/analytics";

interface CampaignTableProps {
  data: CampaignData[];
}

export default function CampaignTable({ data }: CampaignTableProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Campaign Performance</h3>
        <p className="mt-1 text-sm text-slate-500">Analytics by marketing campaign</p>
        <div className="mt-8 flex flex-col items-center justify-center py-12">
          <svg className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          <p className="mt-4 text-sm text-slate-500">No campaign data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="border-b border-slate-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">Campaign Performance</h3>
        <p className="mt-1 text-sm text-slate-500">Analytics by marketing campaign</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Campaign
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                Impressions
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                Clicks
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                CTR
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                Conversions
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                Conv. Rate
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((campaign, index) => (
              <tr key={campaign.name} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                      index === 0 ? "bg-purple-100 text-purple-700" :
                      index === 1 ? "bg-blue-100 text-blue-700" :
                      index === 2 ? "bg-green-100 text-green-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {campaign.name}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-600">
                  {campaign.impressions.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-600">
                  {campaign.clicks.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${
                    campaign.ctr > 5 ? "bg-green-100 text-green-700" :
                    campaign.ctr > 2 ? "bg-amber-100 text-amber-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {campaign.ctr}%
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-600">
                  {campaign.conversions.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <span className={`text-sm font-medium ${
                    campaign.conversionRate > 10 ? "text-green-600" :
                    campaign.conversionRate > 5 ? "text-amber-600" :
                    "text-slate-600"
                  }`}>
                    {campaign.conversionRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
