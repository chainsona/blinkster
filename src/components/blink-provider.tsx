import Image from "next/image";
import * as React from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { providers } from "@/lib/blink";

interface BlinkProvidersProps {
  currentProvider: string;
  setCurrentProvider: (provider: string) => void;
  setBlinkPreview: (data: any) => void;
}

export function BlinkProviders({
  currentProvider,
  setCurrentProvider,
  setBlinkPreview,
}: BlinkProvidersProps) {
  return (
    <ScrollArea className="w-full flex items-center justify-center whitespace-nowrap">
      <div
        className={`w-full p-4 flex flex-row sm:flex-col items-start sm:items-center justify-start sm:justify-center space-x-4 sm:space-x-0 space-y-0 sm:space-y-2`}
      >
        {Object.values(providers).map((provider) => (
          <figure key={provider.name} className="shrink-0">
            <button
              className={`relative overflow-hidden rounded-md border-2 ${
                currentProvider === provider.id
                  ? "border-[#0070f3] shadow-[0_4px_14px_0_rgb(0,118,255,39%)]"
                  : ""
              } p-0 mb-2`}
              onClick={() => {
                setBlinkPreview(null);
                setCurrentProvider(
                  provider.id
                  // currentProvider === provider.id ? "" : provider.id
                );
              }}
            >
              <Image
                src={provider.icon}
                alt={`Photo by ${provider.name}`}
                className="aspect-square h-fit w-fit object-contain"
                width={100}
                height={100}
              />
            </button>
            <figcaption className="text-xs text-center text-muted-foreground">
              {/* Action with {" "} */}
              <span className="font-semibold text-foreground">
                {provider.name}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}

// <button className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear">
//   Next.js Blue
// </button>

// <button className="p-[3px] relative">
//   <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
//   <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
//     Lit up borders
//   </div>
// </button>
