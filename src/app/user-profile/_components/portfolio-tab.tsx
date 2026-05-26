import React from "react";
import Image from "next/image";

type PortfolioItem = {
  id: number;
  type: "image" | "video";
  title: string;
  src: string;
  gridColumn: number;
  gridRow: string | number;
};

const portfolioItems: PortfolioItem[] = [
  // Left column
  {
    id: 1,
    type: "video",
    title: "Project 1",
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    gridColumn: 1,
    gridRow: "1 / 3",
  },
  {
    id: 2,
    type: "image",
    title: "Project 2",
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    gridColumn: 1,
    gridRow: 3,
  },

  // Center left column
  {
    id: 3,
    type: "image",
    title: "Project 3",
    src: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d",
    gridColumn: 2,
    gridRow: 1,
  },
  {
    id: 4,
    type: "video",
    title: "Project 4",
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    gridColumn: 2,
    gridRow: 2,
  },
  {
    id: 5,
    type: "image",
    title: "Project 5",
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    gridColumn: 2,
    gridRow: 3,
  },

  // Center right column
  {
    id: 6,
    type: "image",
    title: "Project 6",
    src: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931",
    gridColumn: 3,
    gridRow: 1,
  },
  {
    id: 7,
    type: "video",
    title: "Project 7",
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    gridColumn: 3,
    gridRow: 2,
  },
  {
    id: 8,
    type: "image",
    title: "Project 8",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    gridColumn: 3,
    gridRow: 3,
  },

  // Right column
  {
    id: 9,
    type: "image",
    title: "Project 9",
    src: "https://images.unsplash.com/photo-1484417894907-623942c8ee29",
    gridColumn: 4,
    gridRow: 1,
  },
  {
    id: 10,
    type: "video",
    title: "Project 10",
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    gridColumn: 4,
    gridRow: "2 / 4",
  },
];

export const PortfolioTab: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[20px] font-bold leading-[22px] text-black dark:text-white">
        Portfolio
      </h3>

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "2fr 1fr 1fr 2fr",
          gridTemplateRows: "130px 130px 130px",
        }}
      >
        {portfolioItems.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-[14px] bg-[rgba(0,88,100,0.08)]"
            style={{
              gridColumn: item.gridColumn,
              gridRow: item.gridRow,
            }}
          >
            {/* Media */}
            <Image
              src={item.src}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

            {/* Badge */}
            {/* <div className="absolute top-3 right-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#005864] backdrop-blur-sm">
              {item.type}
            </div> */}

            {/* Bottom content */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-4">
              <h4 className="text-sm font-semibold text-white">{item.title}</h4>
            </div>

            {/* Video indicator */}
            {item.type === "video" && (
              <div className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
                <div className="ml-[2px] border-y-[6px] border-l-[10px] border-y-transparent border-l-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
