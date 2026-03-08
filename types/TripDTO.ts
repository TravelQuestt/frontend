export type TripStatus = "PLANNED" | "ONGOING" | "COMPLETED";

export interface TripDTO {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: TripStatus;
  coverImageUrl: string;
  adventureCount: number;
  createdAt: Date;
  updatedAt: Date;
}