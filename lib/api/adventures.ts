import axios from "@/lib/axios";
import { AdventureDTO } from "@/types/AdventureDTO";

export type FetchMyAdventuresParams = {
    page: number;
    size?: number;
    searchTerm?: string;
    sortBy: string;
    order: string;
};

export async function fetchMyAdventures(
    params: FetchMyAdventuresParams
): Promise<AdventureDTO[]> {
    const res = await axios.get<AdventureDTO[]>("/adventures", {
        params: {
            page: params.page,
            size: params.size ?? 6,
            searchTerm: params.searchTerm || undefined,
            sortBy: params.sortBy,
            order: params.order,
        },
    });

    return res.data;
}
