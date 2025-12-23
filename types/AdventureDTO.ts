export interface AdventureDTO {
  id: number;
  name: string;
  rating: number;
  description: string;
  latitude: number;
  longitude: number;
  publicVisibility: boolean;
  location: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}