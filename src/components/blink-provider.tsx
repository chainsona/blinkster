import Image from "next/image";
import * as React from "react";

import { providers } from "@/lib/blink";

interface BlinkProvidersProps {
  currentProvider: string;
  setCurrentProvider: (domain: string) => void;
}

export function BlinkProviders({
  currentProvider,
  setCurrentProvider,
}: BlinkProvidersProps) {
  return (
    <div className="overflow-hidden rounded-2xl w-full sm:h-full sm:w-32 bg-neutral-700">
      <div
        className={`overflow-x-auto md:overflow-y-auto w-full h-full flex-grow p-4 flex flex-row sm:flex-col items-start sm:items-start justify-start sm:justify-start space-x-4 sm:space-x-0 space-y-0 sm:space-y-2 scrollbar-thin scrollbar-thumb-[#1A1A1E] scrollbar-track-transparent`}
      >
        {/* <div
          className={`w-full p-4 flex flex-row sm:flex-col items-start sm:items-center justify-start sm:justify-center space-x-4 sm:space-x-0 space-y-0 sm:space-y-2`}
        > */}
        {Object.keys(providers).map((domain: string) => (
          <figure key={providers[domain].name} className="shrink-0">
            <button
              className={`relative overflow-hidden rounded-xl border-4 ${
                currentProvider === domain
                  ? "border-yellow-500 shadow-[0_0px_14px_0_rgb(234,179,8,39%)]"
                  : "border-neutral-700"
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
        {/* </div> */}
        {/* <ScrollBar orientation="vertical" /> */}
      </div>
    </div>
  );
}
