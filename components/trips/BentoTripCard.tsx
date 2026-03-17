"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowUpRight,
  Globe,
  MapPin,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateRange } from "@/lib/dateUtils";
import { TripDTO } from "@/types/TripDTO";
import fallbackImage from "@/public/trip_placeholder_dark.jpg";
import { StaticImageData } from "next/image";
import Link from "next/link";

function resolveImageSrc(src: string | StaticImageData): string {
  return typeof src === "string" ? src : src.src;
}

const wordVariants: Variants = {
  rest: { y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  hover: {
    y: -4,
    transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
  },
};

const infoVariants: Variants = {
  rest: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  hover: {
    opacity: 1,
    y: -2,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const revealVariants: Variants = {
  rest: { height: 0, opacity: 0, marginTop: 0 },
  hover: { height: "auto", opacity: 1, marginTop: 12 },
};

export default function BentoTripCard({ trip }: { trip: TripDTO }) {
  const coverImageUrl =
    trip.coverImageUrl?.length > 0
      ? trip.coverImageUrl
      : resolveImageSrc(fallbackImage);

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1 },
      }}
      className="group relative h-[380px] w-full cursor-pointer"
    >
      <div className="relative h-full w-full rounded-4xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-xl transition-all duration-700">
        <motion.img
          src={coverImageUrl}
          alt={trip.title}
          className="absolute inset-0 h-full w-full object-cover"
          variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/90" />

        <div className="absolute inset-0 p-7 flex flex-col justify-between text-white z-10">
          {/* top row */}
          <div className="flex justify-between items-start">
            <motion.div variants={infoVariants}>
              <Badge className="bg-white/10 backdrop-blur-xl border-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {trip.status}
              </Badge>
            </motion.div>
            <motion.div
              variants={infoVariants}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60"
            >
              <Globe size={12} />
              {trip.adventureCount} stops
            </motion.div>
          </div>

          {/* bottom */}
          <div className="space-y-3">
            <h3 className="text-3xl xl:text-4xl font-black leading-[0.95] tracking-tighter">
              {trip.title.split(" ").map((word, i) => (
                <span
                  key={i}
                  className="block overflow-hidden -mb-1 pb-1.5"
                >
                  <motion.span
                    variants={wordVariants}
                    className="block origin-top-left group-hover:text-sky-400"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h3>

            <motion.p
              variants={infoVariants}
              className="text-white/70 text-sm flex items-center gap-2"
            >
              <MapPin size={14} className="text-sky-500" />
              {trip.locationSummary}
            </motion.p>

            <motion.div variants={revealVariants} className="overflow-hidden">
              <div className="pt-3 flex items-center justify-between border-t border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                    Dates
                  </span>
                  <span className="text-sm font-black">
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </span>
                </div>
                <Link href={`/trips/${trip.id}`}>
                  <Button className="rounded-full h-10 w-10 bg-white text-black hover:bg-sky-500 hover:text-white p-0">
                    <ArrowUpRight size={18} />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}