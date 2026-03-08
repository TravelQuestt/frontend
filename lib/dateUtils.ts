type DateInput = string | Date | undefined | null;

export function parseDate(raw: DateInput): Date | null {
    if (!raw) return null;
    if (raw instanceof Date) return Number.isNaN(raw.getTime()) ? null : raw;
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * "Jan 15, 2025"
 */
export function formatDate(raw: DateInput): string {
    const d = parseDate(raw);
    if (!d) return "—";
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

/**
 * "Jan 15"
 */
export function formatShortDate(raw: DateInput): string {
    const d = parseDate(raw);
    if (!d) return "—";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * "Jan 15 – Feb 3, 2025"
 */
export function formatDateRange(
    startRaw: DateInput,
    endRaw: DateInput
): string {
    const s = parseDate(startRaw);
    const e = parseDate(endRaw);
    if (!s) return "—";
    const startStr = s.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
    if (!e) return startStr;
    const sameYear = s.getFullYear() === e.getFullYear();
    const endStr = e.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        ...(sameYear ? {} : { year: "numeric" }),
    });
    const year = e.getFullYear();
    return `${startStr} – ${endStr}, ${year}`;
}

/**
 *   "today" · "yesterday" · "3 days ago" · "2 months ago"
 *   "tomorrow" · "in 5 days" · "in 2 months"
 */
export function formatRelativeTime(raw: DateInput): string {
    const d = parseDate(raw);
    if (!d) return "";

    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const to = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.round(
        (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "today";
    if (diffDays === 1) return "tomorrow";
    if (diffDays === -1) return "yesterday";

    const abs = Math.abs(diffDays);
    const suffix = diffDays > 0 ? "in " : "";
    const postfix = diffDays < 0 ? " ago" : "";

    if (abs >= 365) {
        const y = Math.round(abs / 365);
        return `${suffix}${y} ${y === 1 ? "year" : "years"}${postfix}`;
    }
    if (abs >= 30) {
        const m = Math.round(abs / 30);
        return `${suffix}${m} ${m === 1 ? "month" : "months"}${postfix}`;
    }
    if (abs >= 7) {
        const w = Math.round(abs / 7);
        return `${suffix}${w} ${w === 1 ? "week" : "weeks"}${postfix}`;
    }
    return `${suffix}${abs} days${postfix}`;
}