// components/trips/CreateTripDialog.tsx
"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  CalendarDays,
  FileText,
  Loader2,
  Plane,
  Plus,
  Sparkles,
  Type,
} from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import useCreateTrip, {
  CreateTripRequest,
} from "@/hooks/trips/useCreateTrip";
import {
  createTripSchema,
  CreateTripFormValues,
} from "@/lib/schemas/tripSchema";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: "easeOut" },
  }),
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface CreateTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTripDialog({
  open,
  onOpenChange,
}: CreateTripDialogProps) {
  const createTrip = useCreateTrip();

  const form = useForm<CreateTripFormValues>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      title: "",
      description: "",
      status: undefined,
      startDate: undefined,
      endDate: undefined,
    },
    mode: "onSubmit",
  });

  const handleClose = useCallback(
    (value: boolean) => {
      if (!value) {
        form.reset();
        createTrip.reset();
      }
      onOpenChange(value);
    },
    [onOpenChange, form, createTrip]
  );

  const onSubmit = (values: CreateTripFormValues) => {
    const payload: CreateTripRequest = {
      title: values.title.trim(),
      description: (values.description ?? "").trim(),
      status: values.status,
      startDate: format(values.startDate, "yyyy-MM-dd") + "T00:00:00",
      endDate: format(values.endDate, "yyyy-MM-dd") + "T23:59:59",
    };

    createTrip.mutate(payload, {
      onSuccess: () => handleClose(false),
    });
  };

  const watchTitle = form.watch("title");
  const watchDescription = form.watch("description");
  const watchStartDate = form.watch("startDate");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-8 py-8 space-y-6 bg-white dark:bg-zinc-950"
          >
            <motion.div initial="hidden" animate="show" className="space-y-6">
              {/* ── title ── */}
              <motion.div variants={fieldVariants} custom={0}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                        <Type size={12} />
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Summer in Italy"
                          maxLength={100}
                          className={cn(
                            "h-12 rounded-xl border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 focus-visible:ring-sky-500",
                            form.formState.errors.title &&
                              "border-red-500 focus-visible:ring-red-500"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between items-start">
                        <FormMessage className="text-xs font-semibold" />
                        <p className="text-[10px] text-muted-foreground/50 tabular-nums ml-auto">
                          {watchTitle?.length ?? 0}/100
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* ── description ── */}
              <motion.div variants={fieldVariants} custom={1}>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                        <FileText size={12} />
                        Description
                        <span className="text-muted-foreground/40 normal-case tracking-normal font-medium">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What's this trip about?"
                          maxLength={1000}
                          rows={3}
                          className={cn(
                            "rounded-xl border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 resize-none focus-visible:ring-sky-500",
                            form.formState.errors.description &&
                              "border-red-500 focus-visible:ring-red-500"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between items-start">
                        <FormMessage className="text-xs font-semibold" />
                        <p className="text-[10px] text-muted-foreground/50 tabular-nums ml-auto">
                          {watchDescription?.length ?? 0}/1000
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* ── status ── */}
              <motion.div variants={fieldVariants} custom={2}>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                        <Plane size={12} />
                        Status
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={cn(
                              "h-12 rounded-xl border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 focus:ring-sky-500",
                              form.formState.errors.status &&
                                "border-red-500 focus:ring-red-500"
                            )}
                          >
                            <SelectValue placeholder="Choose a status" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage className="text-xs font-semibold" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* ── dates ── */}
              <motion.div
                variants={fieldVariants}
                custom={3}
                className="grid grid-cols-2 gap-4"
              >
                {/* start date */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                        <CalendarDays size={12} />
                        Start
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-12 rounded-xl justify-start text-left font-normal border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                                !field.value && "text-muted-foreground",
                                form.formState.errors.startDate &&
                                  "border-red-500"
                              )}
                            >
                              <CalendarDays className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 rounded-xl"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs font-semibold" />
                    </FormItem>
                  )}
                />

                {/* end date */}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                        <CalendarDays size={12} />
                        End
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-12 rounded-xl justify-start text-left font-normal border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                                !field.value && "text-muted-foreground",
                                form.formState.errors.endDate &&
                                  "border-red-500"
                              )}
                            >
                              <CalendarDays className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 rounded-xl"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              watchStartDate
                                ? date < watchStartDate
                                : false
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs font-semibold" />
                    </FormItem>
                  )}
                />
              </motion.div>
            </motion.div>

            {/* ── server error ── */}
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

            {/* ── actions ── */}
            <motion.div
              variants={fieldVariants}
              custom={4}
              initial="hidden"
              animate="show"
              className="flex justify-end gap-3 pt-2"
            >
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleClose(false)}
                disabled={createTrip.isPending}
                className="rounded-full h-12 px-6 text-sm font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}