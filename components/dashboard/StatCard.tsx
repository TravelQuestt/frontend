"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
    label: string;
    value?: number;
    icon: LucideIcon;
    color: string;
};

export default function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white/60 p-6 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-white/5"
        >
            <div
                className={`pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${color}`}
                style={{
                    background: `radial-gradient(400px circle at center, currentColor, transparent 70%)`,
                    filter: 'blur(40px)',
                    opacity: 0.25
                }}
            />

            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-current/10 p-2">
                        <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className={`text-3xl font-bold ${color}`}>
                        {value?.toLocaleString() ?? "0"}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        {label}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}