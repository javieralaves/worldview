import { useEffect, useState } from "react";

interface LogoCarouselProps {
  logos: string[];
}

export function LogoCarousel({ logos }: LogoCarouselProps) {
  const [offset, setOffset] = useState(0);
  const itemWidth = 88; // 80 width + 8 gap

  useEffect(() => {
    if (logos.length > 3) {
      const id = setInterval(() => {
        setOffset((o) => (o + 1) % logos.length);
      }, 3000);
      return () => clearInterval(id);
    }
  }, [logos.length]);

  const translateX = -(offset * itemWidth);

  const items = logos.length > 3 ? logos.concat(logos) : logos;

  return (
    <div className="overflow-hidden">
      <div
        className="flex items-center gap-2"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: logos.length > 3 ? "transform 0.5s linear" : undefined,
        }}
      >
        {items.map((logo, i) => (
          <img
            key={i}
            src={logo}
            width={80}
            height={48}
            className="shrink-0"
            alt="partner logo"
          />
        ))}
      </div>
    </div>
  );
}
