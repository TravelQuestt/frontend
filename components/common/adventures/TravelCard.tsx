import { Star } from "lucide-react";

export default function TravelCard() {
  const image =
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470";

  return (
    <div className="relative w-[320px] rounded-[28px] overflow-hidden shadow-2xl text-white">
      {/* BLURRED BACKGROUND IMAGE (FULL CARD) */}
      <div
        className="absolute inset-0 scale-110 blur-3xl"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* GRADIENT OVER FULL CARD */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/60 to-black/30" />

      {/* CONTENT LAYER */}
      <div className="relative z-10">
        {/* SHARP IMAGE */}
        <div className="relative h-[220px]">
          <img
            src={image}
            alt="Santorini Villa"
            className="h-full w-full object-cover"
          />

          {/* IMAGE FADE */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-t to-t backdrop-blur-md" />
        </div>

        {/* TEXT CONTENT */}
        <div className="relative -mt-20 p-5">
          <h3 className="text-xl font-semibold">Santorini Villa</h3>

          <p className="mt-2 text-sm text-white/80 leading-relaxed font-light">
            Luxury villa overlooking the Aegean Sea, offering breathtaking sunset
            views and a private infinity pool for ultimate relaxation.
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-md font-light">
              <span>4.5</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-white text-white"
                  />
                ))}
              </div>
            </div>

            <div className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-md font-light">
              3 Night Stay
            </div>
          </div>

          {/* CTA */}
          <button className="mt-5 w-full rounded-full bg-white py-3 text-sm font-semibold text-black transition hover:bg-white/90">
            Reserve now
          </button>
        </div>
      </div>
    </div>
  );
}
