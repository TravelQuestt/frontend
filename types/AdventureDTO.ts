export interface AdventureDTO {
  id: number;
  name: string;
  rating: number;
  description: string;
  latitude: number;
  longitude: number;
  publicVisibility: boolean;
  coverImageUrl: string;
  location: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}