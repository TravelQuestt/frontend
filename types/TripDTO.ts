type TripStatus = "UPCOMING" | "ONGOING" | "COMPLETED";

export interface TripDTO {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  coverImageUrl: string;
}