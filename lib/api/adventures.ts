import axios from "@/lib/axios";
import { AdventureDTO } from "@/types/AdventureDTO";
import { AdventurePayload } from "@/types/AdventurePayload";

export type FetchMyAdventuresParams = {
    page: number;
    size?: number;
    searchTerm?: string;
    sortBy: string;
    order: string;
    privacy: string;
};

export async function fetchAllAdventures(
    params: FetchMyAdventuresParams
): Promise<AdventureDTO[]> {
    const res = await axios.get<AdventureDTO[]>("/adventures", {
        params: {
            page: params.page,
            size: params.size ?? 6,
            searchTerm: params.searchTerm || undefined,
            sortBy: params.sortBy,
            order: params.order,
            privacy: params.privacy
        },
    });

    return res.data;
}

export async function fetchAdventure(id: number): Promise<AdventureDTO> {
    const res = await axios.get<AdventureDTO>(`/adventures/${id}`);
    return res.data;
}

export async function deleteAdventure(id: number): Promise<void> {
    await axios.delete(`/adventures/${id}`);
}

export async function updateAdventure(id: number, adventure: AdventurePayload) {
    await axios.put(`/adventures/${id}`, adventure);
}

export async function createAdventure(adventure: AdventurePayload) {
    await axios.post("/adventures", adventure)
}