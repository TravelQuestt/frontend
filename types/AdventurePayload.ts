export interface AdventurePayload {
  name: string;
  rating: number;
  description: string;
  latitude: number;
  longitude: number;
  publicVisibility: boolean;
  tags: string[];
}