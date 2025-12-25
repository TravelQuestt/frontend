import axios from "@/lib/axios";
import { ImageDTO } from "@/types/ImageDTO";

export async function fetchAllImages(id: number): Promise<ImageDTO[]> {
    const res = await axios.get<ImageDTO[]>(`/images/${id}`);
    return res.data;
}

export async function uploadImages(id: number, images: File[]) {
    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));
    const res = await axios.post(`/images/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}