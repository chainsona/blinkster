import Image from "next/image";
import * as React from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { providers } from "@/lib/blink";

interface BlinkProvidersProps {
  currentProvider: string;
  setCurrentProvider: (provider: string) => void;
}

export function BlinkProviders({
  currentProvider,
  setCurrentProvider,
}: BlinkProvidersProps) {
  return (
    <ScrollArea className="w-full flex items-center justify-center whitespace-nowrap">
      <div
        className={`w-full p-4 flex flex-row sm:flex-col items-start sm:items-center justify-start sm:justify-center space-x-4 sm:space-x-0 space-y-0 sm:space-y-2`}
      >
        {Object.keys(providers).map((domain: string) => (
          <figure key={providers[domain].name} className="shrink-0">
            <button
              className={`relative overflow-hidden rounded-md border-2 ${
                currentProvider === providers[domain].id
                  ? "border-[#0070f3] shadow-[0_4px_14px_0_rgb(0,118,255,39%)]"
                  : ""
              } p-0 mb-2`}
              onClick={() => {
                setCurrentProvider(domain);
              }}
            >
              <Image
                src={providers[domain].icon}
                alt={`Photo by ${providers[domain].name}`}
                className="aspect-square h-fit w-fit object-contain"
                width={100}
                height={100}
              />
            </button>
            <figcaption className="text-xs text-center text-muted-foreground">
              {/* Action with {" "} */}
              <span className="font-semibold text-foreground">
                {providers[domain].name}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
