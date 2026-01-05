"use client";

import {
    AreaChart,
    Area,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";

type DataPoint = {
    month: string;
    count: number;
};

export default function AdventureTimeline({
    data,
}: {
    data: DataPoint[];
}) {
    const total = data.reduce((sum, d) => sum + d.count, 0);
    const avg = Math.round((total / data.length) * 10) / 10;
    const peak = data.reduce((a, b) => (b.count > a.count ? b : a));

    return (
        <div className="relative rounded-3xl border border-white/10 bg-white/10 dark:bg-black/30 backdrop-blur-xl p-6 shadow-2xl mb-3">

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                        Adventure Activity
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Monthly exploration rhythm
                    </p>
                </div>

                <div className="text-xs text-muted-foreground">
                    Avg <span className="text-foreground font-medium">{avg}</span>
                </div>
            </div>

            <div className="h-[260px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>

                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <Tooltip
                            cursor={{ stroke: "rgba(255,255,255,0.05)" }}
                            contentStyle={{
                                background: "rgba(0,0,0,0.6)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "14px",
                                backdropFilter: "blur(12px)",
                                fontSize: "12px",
                            }}
                            labelStyle={{ color: "#aaa" }}
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
                            tooltipType="none"
                        />

                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="url(#lineGradient)"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, fill: "#a78bfa", strokeWidth: 0 }}
                        />

                        <ReferenceLine
                            y={avg}
                            stroke="rgba(255,255,255,0.15)"
                            strokeDasharray="4 6"
                        />
                    </AreaChart>
                </ResponsiveContainer>

                <div className="absolute top-4 right-6 text-xs text-muted-foreground">
                    Peak{" "}
                    <span className="text-foreground font-medium">
                        {peak.month} ({peak.count})
                    </span>
                </div>
            </div>
        </div>
    );
}
