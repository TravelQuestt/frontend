"use client";

import { DashboardGraphDTO } from "@/types/DashboardGraphDTO";
import { useState, useMemo } from "react";
import {
    AreaChart,
    Area,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";


export default function AdventureTimeline({ data }: Readonly<{ data: DashboardGraphDTO[] }>) {
    const availableYears = useMemo(() => {
        if (!data || data.length === 0) return [new Date().getFullYear()];
        const years = Array.from(new Set(data.map((d) => d.year)));
        return years.sort((a, b) => b - a);
    }, [data]);

    const [selectedYear, setSelectedYear] = useState<number>(availableYears[0]);

    const chartData = useMemo(() => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const fullYearTemplate = monthNames.map((name, index) => ({
            displayMonth: name,
            month: index + 1,
            year: selectedYear,
            count: 0,
        }));

        data.forEach((item) => {
            if (item.year === selectedYear) {
                fullYearTemplate[item.month - 1].count = item.count;
            }
        });

        return fullYearTemplate;
    }, [data, selectedYear]);

    const totalAdventures = useMemo(() =>
        chartData.reduce((sum, d) => sum + d.count, 0),
        [chartData]);

    const avg = useMemo(() =>
        Math.round((totalAdventures / 12) * 10) / 10,
        [totalAdventures]);

    const peak = useMemo(() => {
        return chartData.reduce((a, b) => (b.count > a.count ? b : a), chartData[0]);
    }, [chartData]);

    if (!data || data.length === 0) {
        return (
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-center text-muted-foreground mb-6">
                No adventures recorded yet. Start your journey!
            </div>
        );
    }

    return (
        <div className="relative rounded-3xl border border-white/10 bg-white/10 dark:bg-black/30 backdrop-blur-xl p-6 shadow-2xl mb-3">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold tracking-tight">Adventure Activity</h3>
                    <p className="text-xs text-muted-foreground">Monthly exploration rhythm</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all cursor-pointer hover:bg-white/10 backdrop-blur-md"
                        >
                            {availableYears.map((y) => (
                                <option key={y} value={y} className="bg-slate-900 text-white">
                                    {y}
                                </option>
                            ))}
                        </select>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-purple-400 transition-colors">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] font-semibold text-purple-300 tracking-wide uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                        Total:{' '}
                        <span className="text-white">{totalAdventures}</span>
                    </div>
                </div>
            </div>

            <div className="h-[260px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <XAxis
                            dataKey="displayMonth"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                            padding={{ left: 10, right: 10 }}
                        />
                        <Tooltip
                            cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 2 }}
                            contentStyle={{
                                background: "rgba(0,0,0,0.8)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "14px",
                                backdropFilter: "blur(12px)",
                                fontSize: "12px",
                            }}
                            itemStyle={{ color: "#a78bfa" }}
                            labelStyle={{ color: "#aaa", marginBottom: "4px" }}
                        />

                        <defs>
                            <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#7dd3fc" />
                                <stop offset="100%" stopColor="#a78bfa" />
                            </linearGradient>
                        </defs>

                        <Area
                            type="monotone"
                            dataKey="count"
                            fill="url(#areaGlow)"
                            stroke="none"
                            animationDuration={1500}
                            tooltipType="none"
                        />

                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="url(#lineGradient)"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, fill: "#a78bfa", strokeWidth: 0 }}
                            animationDuration={1500}
                        />

                        {totalAdventures > 0 && (
                            <ReferenceLine
                                y={avg}
                                stroke="rgba(255,255,255,0.15)"
                                strokeDasharray="4 6"
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>

                <div className="absolute top-0 right-0 text-[10px] uppercase tracking-wider text-muted-foreground/60">
                    {totalAdventures > 0 ? (
                        <>
                            Peak Month: <span className="text-purple-400 font-bold">{peak.displayMonth}</span>
                            <span className="ml-1 opacity-40">({peak.count})</span>
                        </>
                    ) : (
                        "No data for selected year"
                    )}
                </div>
            </div>
        </div>
    );
}