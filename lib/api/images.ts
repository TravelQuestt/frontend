import axios from "@/lib/axios";
import { ImageDTO } from "@/types/ImageDTO";

export async function fetchAllImages(id: number): Promise<ImageDTO[]> {
    const res = await axios.get<ImageDTO[]>(`/images/${id}`);
    return res.data;
}