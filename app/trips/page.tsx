"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Globe,
  MapPin,
  Plus
} from "lucide-react";
import { useMemo, useState } from "react";

import SidebarFilter, {
  SidebarFilters,
} from "@/components/trips/SidebarFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTrips from "@/hooks/trips/useTrips";
import {
  formatDateRange,
  formatRelativeTime,
  parseDate
} from "@/lib/dateUtils";
import { TripDTO, TripStatus } from "@/types/TripDTO";
import fallbackImage from "@/public/trip_placeholder_dark.jpg";
import { StaticImageData } from "next/image";
import Link from "next/link";

type TripTab = "ALL" | TripStatus;

const DEFAULT_FILTERS: SidebarFilters = {
  searchTerm: "",
  orderBy: "name",
  orderDirection: "asc",
  status: "ALL",
  pageNumber: 0,
  pageSize: 6,
};

const TABS: TripTab[] = ["ALL", "PLANNED", "ONGOING", "COMPLETED"];

const STATUS_LABEL: Record<TripStatus, string> = {
  COMPLETED: "Past",
  ONGOING: "Active",
  PLANNED: "Planned",
};

const STATUS_COLOR: Record<TripStatus, string> = {
  COMPLETED: "",
  ONGOING: "text-sky-500",
  PLANNED: "text-purple-500",
};

export default function TripsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TripTab>("ALL");
  const [filters, setFilters] = useState<SidebarFilters>(DEFAULT_FILTERS);

  const handleTabChange = (value: string) => {
    const tab = value as TripTab;
    setActiveTab(tab);
    setFilters((prev) => ({ ...prev, status: tab, pageNumber: 0 }));
  };

  const { data: trips = [], isLoading } = useTrips({
    page: filters.pageNumber,
    size: filters.pageSize,
    searchTerm: filters.searchTerm,
    filters: {
      status: filters.status,
      orderBy: filters.orderBy,
      orderDirection: filters.orderDirection,
    },
  });

  const { data: recentTrips = [] } = useTrips({
    page: 0,
    size: 1,
    searchTerm: "",
    filters: {
      status: "ALL",
      orderBy: "updatedAt",
      orderDirection: "desc",
    },
  });

  const { data: upcomingTrips = [] } = useTrips({
    page: 0,
    size: 1,
    searchTerm: "",
    filters: {
      status: "PLANNED",
      orderBy: "startDate",
      orderDirection: "asc",
    },
  });

  const lastActivity = useMemo(() => {
    const trip = recentTrips[0] ?? null;
    if (!trip) return null;
    return {
      title: trip.title,
      relative: formatRelativeTime(trip.updatedAt ?? trip.createdAt),
    };
  }, [recentTrips]);

  const nextDeparture = useMemo(() => {
    const now = new Date();
    const trip = upcomingTrips.find((t) => {
      const d = parseDate(t.startDate);
      return d && d.getTime() >= now.getTime();
    });
    if (!trip) return null;
    return {
      title: trip.title,
      relative: formatRelativeTime(trip.startDate),
    };
  }, [upcomingTrips]);

  const applyFilters = () =>
    setFilters((prev) => ({ ...prev, pageNumber: 0 }));

  const goPage = (dir: -1 | 1) =>
    setFilters((prev) => ({
      ...prev,
      pageNumber: Math.max(0, prev.pageNumber + dir),
    }));

  const isFirstPage = filters.pageNumber === 0;
  const isLastPage = trips.length < filters.pageSize;

  const completedCount = trips.filter((t) => t.status === "COMPLETED").length;
  const ongoingCount = trips.filter((t) => t.status === "ONGOING").length;
  const plannedCount = trips.filter((t) => t.status === "PLANNED").length;

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-background text-foreground transition-colors duration-700">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-sky-100/50 dark:bg-sky-900/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-100/50 dark:bg-purple-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="flex">
        <aside className="hidden lg:block w-64 shrink-0 border-r sticky top-0 h-screen overflow-y-auto">
          <SidebarFilter
            filters={filters}
            onChange={setFilters}
            onApply={applyFilters}
          />
        </aside>

        <main className="relative flex-1 min-w-0 px-6 xl:px-10 py-16 space-y-7">
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

              <h1 className="text-2xl font-black tracking-tighter leading-[0.8] lg:text-5xl xl:text-6xl">
                Your&nbsp;
                <span className="text-transparent bg-clip-text bg-linear-to-r from-black to-zinc-400 dark:from-white dark:to-zinc-600">
                  Journeys.
                </span>
              </h1>

              <div className="flex gap-6 pt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500/70">
                    Last updated
                  </span>
                  <span className="text-sm font-bold">
                    {lastActivity
                      ? `${lastActivity.title} • ${lastActivity.relative}`
                      : "No activity yet"}
                  </span>
                </div>

                <div className="w-px h-8 bg-black/5 dark:bg-white/5" />

                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500/70">
                    Next departure
                  </span>
                  <span className="text-sm font-bold">
                    {nextDeparture
                      ? `${nextDeparture.title} • ${nextDeparture.relative}`
                      : "Nothing planned"}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-8 bg-white dark:bg-zinc-900 shadow-2xl shadow-black/5 p-6 rounded-4xl border border-black/5 dark:border-white/5 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {activeTab === "ALL" ? (
                  <motion.div
                    key="all"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-8 items-center"
                  >
                    <StatItem label="Past" value={completedCount} />
                    <Divider />
                    <StatItem
                      label="Active"
                      value={ongoingCount}
                      highlight
                    />
                    <Divider />
                    <StatItem label="Planned" value={plannedCount} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-4 px-2"
                  >
                    <StatItem
                      label={STATUS_LABEL[activeTab as TripStatus]}
                      value={trips.length}
                      colorClass={STATUS_COLOR[activeTab as TripStatus]}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 max-w-28 leading-tight">
                      {activeTab === "COMPLETED" && "Trips completed"}
                      {activeTab === "ONGOING" && "In progress now"}
                      {activeTab === "PLANNED" && "Awaiting departure"}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </header>
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.3,
              delay: 0.05,
            }}
            whileHover={{
              scale: 1.03,
              boxShadow:
                "0px 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <nav
              className="sticky top-6 z-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-2xl p-3 rounded-4xl shadow-2xl border border-black/5 dark:border-white/5"
              style={{ willChange: "transform" }}
            >
              <Tabs value={activeTab} onValueChange={handleTabChange}>
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
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + search + filters.pageNumber}
              variants={gridVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {trips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow:
                      "0px 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <BentoTripCard key={trip.id} trip={trip} />
                </motion.div>

              ))}

              {trips.length === 0 && !isLoading && (
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
                    Try adjusting your search or create a new trip to begin
                    your adventure.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {(trips.length > 0 || filters.pageNumber > 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-3 pt-4"
            >
              <Button
                variant="outline"
                size="sm"
                disabled={isFirstPage}
                onClick={() => goPage(-1)}
                className="rounded-full h-10 px-5 gap-2 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>

              <div className="flex items-center justify-center h-10 min-w-24 rounded-full bg-black/5 dark:bg-white/5 px-4">
                <span className="text-sm font-bold tabular-nums">
                  Page {filters.pageNumber + 1}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={isLastPage}
                onClick={() => goPage(1)}
                className="rounded-full h-10 px-5 gap-2 disabled:opacity-30"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </motion.div>
          )}
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
  colorClass,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  colorClass?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </p>
      <p
        className={`text-2xl font-black ${colorClass ?? (highlight ? "text-sky-500" : "")
          }`}
      >
        {value}
      </p>
    </div>
  );
}

const gridVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
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

  const infoVariants: Variants = {
    rest: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: {
      opacity: 1,
      y: -2,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };
  const coverImageUrl =
    trip.coverImageUrl?.length > 0
      ? trip.coverImageUrl
      : resolveImageSrc(fallbackImage);

  function resolveImageSrc(src: string | StaticImageData): string {
    return typeof src === "string" ? src : src.src;
  }
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

            <motion.div
              variants={{
                rest: { height: 0, opacity: 0, marginTop: 0 },
                hover: { height: "auto", opacity: 1, marginTop: 12 },
              }}
              className="overflow-hidden"
            >
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