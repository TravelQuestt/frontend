"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Plus,
  Search,
  MapPin,
  ArrowUpRight,
  Globe,
  Compass,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import useTrips from "@/hooks/trips/useTrips";
import SidebarFilter, { SidebarFilters } from "@/components/trips/SidebarFilter";
import { TripDTO } from "@/types/TripDTO";

type TripStatus = "UPCOMING" | "ONGOING" | "COMPLETED";
type TripTab = "ALL" | TripStatus;

const DEFAULT_FILTERS: SidebarFilters = {
  searchTerm: "",
  orderBy: "name",
  orderDirection: "asc",
  status: "ALL",
  pageNumber: 0,
  pageSize: 9,
};

const TABS: TripTab[] = ["ALL", "UPCOMING", "ONGOING", "COMPLETED"];

export default function TripsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TripTab>("ALL");

  const [filters, setFilters] =
    useState<SidebarFilters>(DEFAULT_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    data: trips = [],
    isLoading,
    isError,
    error,
  } = useTrips({
    page: filters.pageNumber,
    size: filters.pageSize,
    searchTerm: filters.searchTerm,
    filters: {
      status: filters.status,
      orderBy: filters.orderBy,
      orderDirection: filters.orderDirection,
    },
  });
  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      pageNumber: 0,
    }));
    setDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-background text-foreground transition-colors duration-700">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-sky-100/50 dark:bg-sky-900/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-100/50 dark:bg-purple-900/10 blur-[120px] rounded-full" />
      </div>
      <div className="flex flex-row">
      <aside className="hidden lg:block lg:w-64 border-r">
        <SidebarFilter
          filters={filters}
          onChange={setFilters}
          onApply={applyFilters}
        />
      </aside>
      <main className="relative max-w-7xl mx-auto px-6 py-16 space-y-7">


        <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-black/5 dark:border-white/5 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-sky-500 font-bold tracking-widest uppercase text-xs">
              <Compass className="animate-spin-slow" size={16} />
              Personal Atlas
            </div>

            <h1 className="text-2xl font-black tracking-tighter leading-[0.8] lg:text-6xl">
              Your&nbsp;
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-zinc-400 dark:from-white dark:to-zinc-600">
                Journeys.
              </span>
            </h1>
            <div className="flex gap-6 pt-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500/70">Last activity</span>
                <span className="text-sm font-bold">Himalayan Trek • 2 days ago</span>
              </div>
              <div className="w-px h-8 bg-black/5 dark:bg-white/5" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500/70">Next departure</span>
                <span className="text-sm font-bold">Goa • in 12 days</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-8 bg-white dark:bg-zinc-900 shadow-2xl shadow-black/5 p-6 rounded-[2rem] border border-black/5 dark:border-white/5"
          >
            <StatItem
              label="Past"
              value={trips.filter((t) => t.status === "COMPLETED").length}
            />
            <Divider />
            <StatItem
              label="Active"
              value={trips.filter((t) => t.status === "ONGOING").length}
              highlight
            />
            <Divider />
            <StatItem
              label="Planned"
              value={trips.filter((t) => t.status === "UPCOMING").length}
            />
          </motion.div>
        </header>

        <nav
          className="sticky top-6 z-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-2xl p-3 rounded-[2rem] shadow-2xl border border-black/5 dark:border-white/5"
          style={{ willChange: "transform" }}
        >
          <Tabs
            defaultValue="ALL"
            onValueChange={(v) => setActiveTab(v as TripTab)}
          >
            <TabsList className="bg-transparent h-12 gap-1">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-full px-6 h-10 data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black transition-all duration-500"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-30" />
              <Input
                aria-label="Search trips"
                placeholder="Search trips, places, memories…"
                className="pl-10 h-12 border-none bg-black/5 dark:bg-white/5 rounded-full focus-visible:ring-2 focus-visible:ring-sky-500/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Button
              size="icon"
              aria-label="Create new trip"
              title="Create new trip"
              className="h-12 w-12 rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20 transition-all hover:rotate-90"
            >
              <Plus size={24} />
            </Button>
          </div>
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + search}
            variants={gridVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {trips.map((trip) => (
              <BentoTripCard key={trip.id} trip={trip} />
            ))}

            {trips.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full flex flex-col items-center justify-center py-32 text-center"
              >
                <Compass className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-xl font-black tracking-tight mb-2">
                  No journeys found
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Try adjusting your search or create a new trip to begin your
                  adventure.
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

      </main>
</div>
    </div>
  );
}

function Divider() {
  return (
    <div className="w-px h-10 bg-black/5 dark:bg-white/5 self-center" />
  );
}

function StatItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </p>
      <p className={`text-2xl font-black ${highlight ? "text-sky-500" : ""}`}>
        {value}
      </p>
    </div>
  );
}

const gridVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

function BentoTripCard({ trip }: { trip: TripDTO }) {
  const wordVariants: Variants = {
    rest: { y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    hover: {
      y: -4,
      transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
    },
  };

  const infoVariants = {
    rest: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    hover: {
      opacity: 1,
      y: -2,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };


  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1 },
      }}
      className="group relative h-[440px] w-full perspective-1000 cursor-pointer"
    >


      <div className="relative h-full w-full rounded-[3rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-xl transition-all duration-700">
        <motion.img
          src={trip.coverImage}
          alt={trip.title}
          className="absolute inset-0 h-full w-full object-cover"
          variants={{ rest: { scale: 1 }, hover: { scale: 1.1 } }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90" />

        <div className="absolute inset-0 p-10 flex flex-col justify-between text-white z-10">
          <div className="flex justify-between items-start">
            <motion.div variants={infoVariants}>
              <Badge className="bg-white/10 backdrop-blur-xl border-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
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

          <div className="space-y-4">
            <h3 className="text-5xl font-black leading-[0.95] tracking-tighter">
              {trip.title.split(" ").map((word, i) => (
                <span key={i} className="block overflow-hidden -mb-1 pb-2">
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
              className="text-white/70 text-sm flex items-center gap-2 mt-4"
            >
              <MapPin size={14} className="text-sky-500" />
              {trip.locationSummary}
            </motion.p>

            <motion.div
              variants={{
                rest: { height: 0, opacity: 0, marginTop: 0 },
                hover: { height: "auto", opacity: 1, marginTop: 16 },
              }}
              className="overflow-hidden"
            >
              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <span className="text-sm font-black">{trip.startDate}</span>

                <Button className="rounded-full h-12 w-12 bg-white text-black hover:bg-sky-500 hover:text-white p-0">
                  <ArrowUpRight size={20} />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
