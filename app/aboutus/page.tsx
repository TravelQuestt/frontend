"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const team = [
    {
        name: "Mitray Pandit",
        role: "Core Member",
        bio: "Fall seven times, stand up eight.",
        image: "./avatars/mitray.jpeg",
        glowColor: "text-amber-500",
    },
    {
        name: "Sourav Jagtap",
        role: "Lead Architect",
        bio: "I don't know how it works but it just works.",
        image: "./avatars/sourav.jpg",
        glowColor: "text-cyan-500",
    },
    {
        name: "Devika Dixit",
        role: "Core Member",
        bio: "You gotta do what you gotta do 乁(ツ)ㄏ",
        image: "./avatars/devika.jpg",
        glowColor: "text-pink-500",
    },
    {
        name: "Ketaki Pawar",
        role: "Core Member",
        bio: "Be kind.",
        image: "./avatars/ketaki.jpeg",
        glowColor: "text-emerald-500",
    },
    {
        name: "Geeta Pujari",
        role: "Core Member",
        bio: "Once a spark, now a story.",
        image: "./avatars/geeta.webp",
        glowColor: "text-purple-500",
    },
];

export default function AboutPage() {
    return (
        <main className="relative min-h-screen bg-background px-6 py-16">
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mx-auto max-w-4xl text-center"
            >
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Meet the Team 🚀
                </h1>
                <p className="mt-3 text-muted-foreground text-lg">
                    Meet the passionate team behind <span className="font-medium text-foreground">TravelQuest</span> a collaborative journey to build a smarter way to track your adventures.
                </p>
                <Separator className="my-8" />
            </motion.div>

            {/* TEAM GRID */}
            <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {team.map((member, i) => (
                    <motion.div
                        key={member.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        whileHover={{ y: -6 }}
                        className="h-full"
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            e.currentTarget.style.setProperty(
                                "--mouse-x",
                                `${e.clientX - rect.left}px`
                            );
                            e.currentTarget.style.setProperty(
                                "--mouse-y",
                                `${e.clientY - rect.top}px`
                            );
                        }}
                    >

                        <Card className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:border-white/20">

                            {/* AMBIENT + MOUSE-REACTIVE GLOW */}
                            <div
                                className={`pointer-events-none absolute -inset-px ${member.glowColor} transition-opacity duration-300 group-hover:opacity-10 `}
                                style={{
                                    background: `
            radial-gradient(
                700px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                currentColor 0%,
                transparent 45%
            )
        `,
                                    filter: "blur(80px)",
                                    opacity: 0.35,
                                }}
                            />


                            <CardHeader className="relative z-10 flex flex-col items-center text-center gap-4 pt-10 px-8">
                                <Avatar className="h-24 w-24 ring-2 ring-white/20 transition-transform duration-300 group-hover:scale-105 ">
                                    <AvatarImage src={member.image} alt={member.name} />
                                    <AvatarFallback className="text-lg font-semibold">
                                        {member.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <CardTitle className="text-lg font-semibold">
                                        {member.name}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {member.role}
                                    </p>
                                </div>
                            </CardHeader>

                            <CardContent className="relative z-10 pb-10 px-8 text-center">
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    “{member.bio}”
                                </p>
                            </CardContent>
                        </Card>

                    </motion.div>
                ))}
            </div>
        </main>
    );
}
