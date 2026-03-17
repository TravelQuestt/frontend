"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileText,
  Globe,
  Loader2,
  MapPin,
  Plane,
  Plus,
  Sparkles,
  Type,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { format } from "date-fns";

import SidebarFilter, {
  SidebarFilters,
} from "@/components/trips/SidebarFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import useCreateTrip, {
  CreateTripRequest,
} from "@/hooks/trips/useCreateTrip";
import useTrips from "@/hooks/trips/useTrips";
import {
  formatDateRange,
  formatRelativeTime,
  parseDate,
} from "@/lib/dateUtils";
import { cn } from "@/lib/utils";
import fallbackImage from "@/public/trip_placeholder_dark.jpg";
import { TripDTO, TripStatus } from "@/types/TripDTO";
import { StaticImageData } from "next/image";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types & constants                                                  */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Form types                                                         */
/* ------------------------------------------------------------------ */

interface TripFormData {
  title: string;
  description: string;
  status: TripStatus | "";
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface TripFormErrors {
  title?: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

const EMPTY_FORM: TripFormData = {
  title: "",
  description: "",
  status: "",
  startDate: undefined,
  endDate: undefined,
};

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

function validateTripForm(data: TripFormData): TripFormErrors {
  const errors: TripFormErrors = {};

  if (!data.title.trim()) {
    errors.title = "Trip title is required";
  } else if (data.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  } else if (data.title.trim().length > 100) {
    errors.title = "Title cannot exceed 100 characters";
  }

  if (data.description.length > 1000) {
    errors.description = "Description cannot exceed 1000 characters";
  }

  if (!data.status) {
    errors.status = "Trip status is required";
  }

  if (!data.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!data.endDate) {
    errors.endDate = "End date is required";
  }

  if (data.startDate && data.endDate && data.endDate < data.startDate) {
    errors.endDate = "End date must be after the start date";
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TripsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TripTab>("ALL");
  const [filters, setFilters] = useState<SidebarFilters>(DEFAULT_FILTERS);
  const [createOpen, setCreateOpen] = useState(false);

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

  const completedCount = trips.filter(
    (t) => t.status === "COMPLETED"
  ).length;
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
          {/* header */}
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
                    <StatItem label="Active" value={ongoingCount} highlight />
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

          {/* toolbar */}
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
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
                  onClick={() => setCreateOpen(true)}
                  className="h-12 w-12 rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20 transition-all hover:rotate-90"
                >
                  <Plus size={24} />
                </Button>
              </div>
            </nav>
          </motion.div>

          {/* grid */}
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
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <BentoTripCard trip={trip} />
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

          {/* pagination */}
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

      {/* Create Trip Dialog */}
      <CreateTripDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

/* ================================================================== */
/*  CreateTripDialog                                                   */
/* ================================================================== */

function CreateTripDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState<TripFormData>({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<TripFormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const createTrip = useCreateTrip();

  const reset = useCallback(() => {
    setForm({ ...EMPTY_FORM });
    setErrors({});
    setTouched(new Set());
    createTrip.reset();
  }, [createTrip]);

  const handleClose = useCallback(
    (value: boolean) => {
      if (!value) reset();
      onOpenChange(value);
    },
    [onOpenChange, reset]
  );

  const updateField = <K extends keyof TripFormData>(
    field: K,
    value: TripFormData[K]
  ) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (touched.has(field)) {
        setErrors(validateTripForm(next));
      }
      return next;
    });
  };

  const markTouched = (field: string) => {
    setTouched((prev) => {
      const next = new Set(prev);
      next.add(field);
      return next;
    });
    setErrors(validateTripForm(form));
  };

  const handleSubmit = async () => {
    setTouched(
      new Set(["title", "description", "status", "startDate", "endDate"])
    );

    const validationErrors = validateTripForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const payload: CreateTripRequest = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status as TripStatus,
      startDate: format(form.startDate!, "yyyy-MM-dd") + "T00:00:00",
      endDate: format(form.endDate!, "yyyy-MM-dd") + "T23:59:59",
    };

    createTrip.mutate(payload, {
      onSuccess: () => {
        handleClose(false);
      },
    });
  };

  const fieldVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.35, ease: "easeOut" },
    }),
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/*
        [&>button] targets the single built-in shadcn close button
        and styles it white so it's visible on the gradient header.
      */}
      <DialogContent
        className="max-w-lg p-0 gap-0 overflow-hidden rounded-3xl border-black/5
                   dark:border-white/10 shadow-2xl
                   [&>button]:text-white [&>button]:hover:text-white/80
                   [&>button]:hover:bg-white/10 [&>button]:transition-colors
                   [&>button]:top-5 [&>button]:right-5 [&>button]:rounded-full"
      >
        {/* ── gradient header ── */}
        <div className="relative bg-gradient-to-br from-sky-500 via-sky-600 to-purple-600 px-8 pt-8 pb-12 text-white overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-purple-400/20 blur-xl" />

          <DialogHeader className="relative z-10 space-y-2">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sky-200 text-xs font-black uppercase tracking-widest"
            >
              <Sparkles size={14} />
              New Adventure
            </motion.div>
            <DialogTitle className="text-2xl font-black tracking-tight">
              Create a Trip
            </DialogTitle>
            <DialogDescription className="text-white/60 text-sm">
              Fill in the details below and start planning your next journey.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* ── form body ── */}
        <motion.div
          initial="hidden"
          animate="show"
          className="px-8 py-8 space-y-6 bg-white dark:bg-zinc-950"
        >
          {/* title */}
          <motion.div variants={fieldVariants} custom={0} className="space-y-2">
            <Label
              htmlFor="trip-title"
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground"
            >
              <Type size={12} />
              Title
            </Label>
            <Input
              id="trip-title"
              placeholder="e.g. Summer in Italy"
              maxLength={100}
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              onBlur={() => markTouched("title")}
              className={cn(
                "h-12 rounded-xl border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 focus-visible:ring-sky-500",
                errors.title &&
                  touched.has("title") &&
                  "border-red-500 focus-visible:ring-red-500"
              )}
            />
            <AnimatePresence>
              {errors.title && touched.has("title") && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-500 font-semibold"
                >
                  {errors.title}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="text-[10px] text-muted-foreground/50 text-right tabular-nums">
              {form.title.length}/100
            </p>
          </motion.div>

          {/* description */}
          <motion.div variants={fieldVariants} custom={1} className="space-y-2">
            <Label
              htmlFor="trip-desc"
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground"
            >
              <FileText size={12} />
              Description
              <span className="text-muted-foreground/40 normal-case tracking-normal font-medium">
                (optional)
              </span>
            </Label>
            <Textarea
              id="trip-desc"
              placeholder="What's this trip about?"
              maxLength={1000}
              rows={3}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              onBlur={() => markTouched("description")}
              className={cn(
                "rounded-xl border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 resize-none focus-visible:ring-sky-500",
                errors.description &&
                  touched.has("description") &&
                  "border-red-500 focus-visible:ring-red-500"
              )}
            />
            <AnimatePresence>
              {errors.description && touched.has("description") && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-500 font-semibold"
                >
                  {errors.description}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="text-[10px] text-muted-foreground/50 text-right tabular-nums">
              {form.description.length}/1000
            </p>
          </motion.div>

          {/* status */}
          <motion.div variants={fieldVariants} custom={2} className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
              <Plane size={12} />
              Status
            </Label>
            <Select
              value={form.status}
              onValueChange={(val) =>
                updateField("status", val as TripStatus)
              }
            >
              <SelectTrigger
                onBlur={() => markTouched("status")}
                className={cn(
                  "h-12 rounded-xl border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 focus:ring-sky-500",
                  errors.status &&
                    touched.has("status") &&
                    "border-red-500 focus:ring-red-500"
                )}
              >
                <SelectValue placeholder="Choose a status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="PLANNED">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                    Planned
                  </span>
                </SelectItem>
                <SelectItem value="ONGOING">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Ongoing
                  </span>
                </SelectItem>
                <SelectItem value="COMPLETED">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-zinc-400" />
                    Completed
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <AnimatePresence>
              {errors.status && touched.has("status") && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-500 font-semibold"
                >
                  {errors.status}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── dates: shadcn Calendar + Popover ── */}
          <motion.div
            variants={fieldVariants}
            custom={3}
            className="grid grid-cols-2 gap-4"
          >
            {/* start date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                <CalendarDays size={12} />
                Start
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    onBlur={() => markTouched("startDate")}
                    className={cn(
                      "w-full h-12 rounded-xl justify-start text-left font-normal border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                      !form.startDate && "text-muted-foreground",
                      errors.startDate &&
                        touched.has("startDate") &&
                        "border-red-500"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    {form.startDate
                      ? format(form.startDate, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={form.startDate}
                    onSelect={(date) => {
                      updateField("startDate", date);
                      markTouched("startDate");
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <AnimatePresence>
                {errors.startDate && touched.has("startDate") && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-500 font-semibold"
                  >
                    {errors.startDate}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* end date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                <CalendarDays size={12} />
                End
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    onBlur={() => markTouched("endDate")}
                    className={cn(
                      "w-full h-12 rounded-xl justify-start text-left font-normal border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                      !form.endDate && "text-muted-foreground",
                      errors.endDate &&
                        touched.has("endDate") &&
                        "border-red-500"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    {form.endDate
                      ? format(form.endDate, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={form.endDate}
                    onSelect={(date) => {
                      updateField("endDate", date);
                      markTouched("endDate");
                    }}
                    disabled={(date) =>
                      form.startDate ? date < form.startDate : false
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <AnimatePresence>
                {errors.endDate && touched.has("endDate") && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-500 font-semibold"
                  >
                    {errors.endDate}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* server error */}
          <AnimatePresence>
            {createTrip.isError && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400 font-semibold"
              >
                {(createTrip.error as Error)?.message ??
                  "Something went wrong. Please try again."}
              </motion.div>
            )}
          </AnimatePresence>

          {/* actions */}
          <motion.div
            variants={fieldVariants}
            custom={4}
            className="flex justify-end gap-3 pt-2"
          >
            <Button
              variant="ghost"
              onClick={() => handleClose(false)}
              disabled={createTrip.isPending}
              className="rounded-full h-12 px-6 text-sm font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createTrip.isPending}
              className="rounded-full h-12 px-8 bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white font-black text-sm shadow-lg shadow-sky-500/20 transition-all gap-2"
            >
              {createTrip.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Trip
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

/* ================================================================== */
/*  Shared tiny components                                             */
/* ================================================================== */

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
        className={`text-2xl font-black ${
          colorClass ?? (highlight ? "text-sky-500" : "")
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ================================================================== */
/*  Grid / Card                                                        */
/* ================================================================== */

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