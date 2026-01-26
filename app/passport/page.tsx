"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getStats } from "@/hooks/dashboard/getStats";
import { getUser } from "@/hooks/user/getUser";
import { DashboardStatsDTO } from "@/types/DashboardStatsDTO";
import { motion } from "framer-motion";
import {
    Globe,
    Map as MapIcon,
    Medal,
    PlaneTakeoff,
    Trophy,
    Navigation,
    Lock,
    Sparkles,
    Star
} from "lucide-react";

const DEFAULT_STATS: DashboardStatsDTO = {
    totalAdventures: 88,
    totalCountries: 20,
    totalRegions: 0,
    totalCities: 9,
    averageRating: 0,
};

export default function ExplorerPassportPage() {
    const { data: stats = DEFAULT_STATS } = getStats();
    // const stats = DEFAULT_STATS;
    const { data: user } = getUser();

    const worldCompletion = (stats.totalCountries / 195) * 100;
    const explorerLevel = Math.floor(stats.totalAdventures / 5) + 1;

    const milestones = [
        {
            title: "Global Citizen",
            requirement: "Visit 5 Countries",
            achieved: stats.totalCountries >= 5,
            progress: Math.min((stats.totalCountries / 5) * 100, 100),
            icon: Globe,
            color: "text-blue-400"
        },
        {
            title: "Urban Legend",
            requirement: "Visit 10 Cities",
            achieved: stats.totalCities >= 10,
            progress: Math.min((stats.totalCities / 10) * 100, 100),
            icon: Navigation,
            color: "text-purple-400"
        },
        {
            title: "Elite Voyager",
            requirement: "4.5+ Avg Rating",
            achieved: stats.averageRating >= 4.5,
            progress: Math.min((stats.averageRating / 4.5) * 100, 100),
            icon: Star,
            color: "text-yellow-400"
        },
        {
            title: "Centurion",
            requirement: "100 Adventures",
            achieved: stats.totalAdventures >= 100,
            progress: Math.min((stats.totalAdventures / 100) * 100, 100),
            icon: Trophy,
            color: "text-orange-400"
        },
    ];

    const nextAchievement = milestones.find(m => !m.achieved) || milestones[milestones.length - 1];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="px-4 sm:px-6 py-8 max-w-7xl mx-auto space-y-10">

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-3xl p-8 bg-gradient-to-br 
                             from-white/10 to-white/5 dark:from-white/5 dark:to-white/0
                             backdrop-blur-xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <PlaneTakeoff className="w-8 h-8 text-blue-500" />
                            <span className="text-sm font-bold uppercase tracking-widest text-blue-500/80">Digital Passport</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                            {user?.name?.split(' ')[0]}'s Journey
                        </h1>
                        <p className="text-muted-foreground mt-2 max-w-xl">
                            Tracking your footprints across {stats.totalCountries} countries and {stats.totalCities} cities.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-3 bg-foreground/5 p-3 rounded-2xl border border-white/5">
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Current Rank</p>
                                <p className="text-lg font-bold">Level {explorerLevel} Explorer</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                                {explorerLevel}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        label="Countries Visited"
                        value={stats.totalCountries}
                        total={195}
                        icon={MapIcon}
                        color="text-emerald-400"
                        progress={worldCompletion}
                        description="Global footprint"
                    />

                    <Card className="md:col-span-2 relative overflow-hidden border-white/10 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-2xl">
                        <div className="absolute top-[-20px] right-[-20px] opacity-10 rotate-12">
                            <Sparkles size={180} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white/90 flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                                <Lock className="w-3 h-3" /> Upcoming Achievement
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <nextAchievement.icon className="w-10 h-10 text-white" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black p-1 rounded-full">
                                    <Trophy className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-3 text-center sm:text-left">
                                <div>
                                    <h3 className="text-2xl font-bold">{nextAchievement.title}</h3>
                                    <p className="text-white/70 text-sm">{nextAchievement.requirement}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                        <span>Progress</span>
                                        <span>{Math.round(nextAchievement.progress)}%</span>
                                    </div>
                                    <Progress value={nextAchievement.progress} className="h-2 bg-black/20" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl rounded-3xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] -z-10" />

                    <CardHeader className="border-b border-white/10 bg-background-muted py-6 px-8">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 shadow-xl">
                                    <Medal className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                                        Milestone Collection
                                    </CardTitle>
                                    <CardDescription className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                                        Badges earned through your travels
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Completion</span>
                                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest">
                                    {milestones.filter(m => m.achieved).length} / {milestones.length} Earned
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
                        {milestones.map((m) => (
                            <motion.div
                                key={m.title}
                                whileHover={{ y: -8 }}
                                className={`relative flex flex-col p-6 rounded-[2.5rem] border transition-all duration-500 ${m.achieved
                                    ? "bg-white/[0.05] border-white/10 shadow-2xl"
                                    : "bg-black/20 border-white/5 opacity-60"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`p-4 rounded-2xl border transition-all duration-500 ${m.achieved
                                        ? `bg-white/5 border-white/5 ${m.color} shadow-lg`
                                        : "bg-white/5 border-transparent text-white/20"
                                        }`}>
                                        <m.icon className="w-6 h-6" />
                                    </div>

                                    <div className="text-right uppercase tracking-tighter">
                                        <span className="text-[10px] font-bold text-muted-foreground">Progress</span>
                                        <p className={`text-lg font-black leading-none ${m.achieved ? "text-emerald-400" : "text-white/40"}`}>
                                            {Math.round(m.progress)}%
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1 mt-auto">
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                                        Requirement: {m.requirement}
                                    </p>
                                    <h3 className={`text-xl font-bold tracking-tighter ${m.achieved ? "text-white" : "text-white/40"}`}>
                                        {m.title}
                                    </h3>
                                </div>

                                <div className="mt-6">
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${m.progress}%` }}
                                            className={`h-full rounded-full transition-all duration-1000 ${m.achieved
                                                ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                                                : "bg-white/20"
                                                }`}
                                        />
                                    </div>
                                    {m.achieved && (
                                        <p className="text-[10px] text-emerald-400 mt-2 font-bold italic opacity-80 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Achievement Unlocked
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

function StatCard({ label, value, total, icon: Icon, color, progress, description }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl space-y-5"
        >
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl bg-white/5 ${color} border border-white/5`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="text-right uppercase tracking-tighter">
                    <span className="text-[10px] font-bold text-muted-foreground">World Progress</span>
                    <p className="text-xl font-black leading-none">{Math.round(progress)}%</p>
                </div>
            </div>

            <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{label}</p>
                <div className="flex items-baseline gap-1 mt-1">
                    <h3 className="text-5xl font-semibold tracking-tighter">{value}</h3>
                    {total && <span className="text-muted-foreground text-2xl font-medium">/ {total}</span>}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 italic opacity-80">{description}</p>
            </div>

            <Progress value={progress} className="h-2 bg-white/5" />
        </motion.div>
    );
}