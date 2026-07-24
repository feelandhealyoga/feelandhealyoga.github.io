import { useEffect, useState } from "react";

/* ---------- Scroll Progress Bar Component ---------- */
export const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const t = Math.min(
        window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight),
        1,
      );
      setProgress(t);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const fraction = (event.clientX - rect.left) / rect.width;
    const targetY = fraction * (document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-200 z-30 cursor-pointer" onClick={handleClick}>
      <div
        className="h-full bg-green-500 transition-all duration-100"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
};
