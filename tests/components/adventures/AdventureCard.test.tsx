import { render, screen } from "@testing-library/react";
import { AdventureDTO } from "@/types/AdventureDTO";
import AdventureCard from "@/components/common/adventures/AdventureCard";

const makeAdventure = (overrides: Partial<AdventureDTO> = {}): AdventureDTO => ({
    id: 1,
    name: "Machu Picchu",
    location: "Peru",
    description: "",
    latitude: 0,
    longitude: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    rating: 4.8,
    tags: ["mountain", "historic"],
    publicVisibility: true,
    coverImageUrl: "/test.jpg",
    ...overrides,
});

it("uses fallback image when coverImageUrl is missing", () => {
    render(
        <AdventureCard
            adventure={makeAdventure({ coverImageUrl: undefined })}
        />
    );

    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
});
