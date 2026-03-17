export interface TripPayload {
    title: string;
    description: string;
    status: "PLANNED" | "ONGOING" | "COMPLETED";
    startDate: Date;
    endDate: Date;
}