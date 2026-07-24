import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronRight } from "lucide-react";

const youtubeIds = [
  "29PJnLn8xxU",
  "9f8V18vKlbY",
  "NY0STA5U1RQ",
  "jgO2-SUE6Fw",
  "rXBB5g1aixo",
  "FoSUPzcJyB4",
];

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const soloImages = [
  "WhatsApp Image 2026-01-22 at 22.43.59.jpeg",
  "WhatsApp Image 2026-01-22 at 22.44.21.jpeg",
];

const groupImages = [
  "WhatsApp Image 2026-01-22 at 22.46.02.jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.02 (1).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.02 (2).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.02 (3).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.02 (4).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.02 (5).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.02 (6).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.02 (7).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03.jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (1).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (2).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (3).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (4).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (5).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (6).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (7).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (8).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (9).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (10).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (11).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (12).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (13).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (14).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (15).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (16).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (17).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (18).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (19).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (20).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (21).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (22).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (23).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (24).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (25).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (26).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (27).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (28).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (29).jpeg",
];

const imageFiles = [...soloImages, ...groupImages];

export const GallerySection = () => {
  const [apiReady, setApiReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [initialPhotoCount, setInitialPhotoCount] = useState(8);
  const [activeTab, setActiveTab] = useState<"all" | "solo" | "group">("all");
  const playersRef = useRef<any[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const filteredImages =
    activeTab === "solo" ? soloImages
    : activeTab === "group" ? groupImages
    : imageFiles;

  useEffect(() => {
    const updateInitialCount = () => {
      setInitialPhotoCount(window.innerWidth < 768 ? 4 : 8);
    };

    updateInitialCount();
    window.addEventListener("resize", updateInitialCount);
    return () => window.removeEventListener("resize", updateInitialCount);
  }, []);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
    setShowAllPhotos(true);
  };

  const closeModal = () => setModalOpen(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + filteredImages.length) % filteredImages.length,
    );
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!modalOpen) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    },
    [modalOpen],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (window.YT) {
      setApiReady(true);
    } else {
      window.onYouTubeIframeAPIReady = () => setApiReady(true);
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (apiReady) {
      youtubeIds.forEach((id, index) => {
        const player = new window.YT.Player(`player-${index}`, {
          videoId: id,
          playerVars: {
            autoplay: 0,
            mute: 1,
            loop: 1,
            playlist: id,
            controls: 0,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: () => {
              player.mute();
            },
          },
        });
        playersRef.current[index] = player;
      });
    }
  }, [apiReady]);

  useEffect(() => {
    if (apiReady && playersRef.current.length === youtubeIds.length) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = parseInt(
              (entry.target as HTMLElement).id.split("-")[1],
            );
            const player = playersRef.current[index];
            if (entry.isIntersecting) {
              // Pause all other videos before playing this one
              playersRef.current.forEach((otherPlayer, otherIndex) => {
                if (
                  otherIndex !== index &&
                  otherPlayer &&
                  otherPlayer.pauseVideo
                ) {
                  otherPlayer.pauseVideo();
                }
              });
              player.playVideo();
            } else {
              player.pauseVideo();
            }
          });
        },
        { threshold: 0.5 },
      );

      playersRef.current.forEach((_, index) => {
        const element = document.getElementById(`player-${index}`);
        if (element) observerRef.current!.observe(element);
      });

      return () => observerRef.current?.disconnect();
    }
  }, [apiReady]);

  return (
    <section id="gallery" className="py-20 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-8">
          Photo Gallery
        </h2>

        {/* Tab filter */}
        <div style={{ display:"flex", justifyContent:"center", gap:10, marginBottom:36, flexWrap:"wrap" }}>
          {(["all","solo","group"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setShowAllPhotos(false); setCurrentImageIndex(0); }}
              style={{
                padding: "8px 22px",
                borderRadius: 999,
                border: activeTab === tab ? "2px solid hsl(145,42%,42%)" : "1.5px solid hsl(145,22%,80%)",
                background: activeTab === tab ? "hsl(145,42%,42%)" : "white",
                color: activeTab === tab ? "white" : "hsl(145,38%,30%)",
                fontFamily: "'Inter',sans-serif",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
            >
              {tab === "all" ? `All Photos (${imageFiles.length})` : tab === "solo" ? `🧘 Individual (${soloImages.length})` : `👥 Group & Classes (${groupImages.length})`}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {(showAllPhotos
            ? filteredImages
            : filteredImages.slice(0, initialPhotoCount)
          ).map((image, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => openModal(index)}
            >
              <img
                src={`/assets/images/${image}`}
                alt={`Yoga class at Feel & Heal Yoga, Kharghar — Photo ${index + 1}`}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {!showAllPhotos && (
          <div className="text-center mb-20">
            <button
              onClick={() => openModal(0)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
            >
              Show More Photos
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-16">
          Yoga Videos
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {youtubeIds.map((id, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-sm shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div
                id={`player-${index}`}
                className="w-full h-full aspect-[9/16]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Button */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Image */}
            <div className="max-w-4xl max-h-full">
              <img
                src={`/assets/images/${filteredImages[currentImageIndex]}`}
                alt={`Feel & Heal Yoga class in Kharghar — Photo ${currentImageIndex + 1}`}
                className="max-w-[95dvw] max-h-[95dvh] object-contain cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  if (e.clientX - rect.left < rect.width / 2) prevImage();
                  else nextImage();
                }}
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {filteredImages.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
