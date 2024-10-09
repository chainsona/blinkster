import { BlinkProvider } from "@/types";
import Image from "next/image";
import * as React from "react";

interface BlinkProvidersProps {
  currentProvider: string;
  setCurrentProvider: (domain: string) => void;
  providers: BlinkProvider[];
}

export function BlinkProviders({
  providers,
  currentProvider,
  setCurrentProvider,
}: BlinkProvidersProps) {
  return (
    <div className="overflow-hidden rounded-2xl w-full bg-neutral-700">
      <div
        className={`overflow-x-auto overflow-y-auto w-full h-full flex-grow p-4 flex flex-row sm:flex-col items-start sm:items-start justify-start sm:justify-start space-x-4 sm:space-x-0 space-y-0 sm:space-y-2 scrollbar-thin scrollbar-thumb-[#1A1A1E] scrollbar-track-transparent`}
      >
        {providers.map((provider: BlinkProvider) => (
          <figure key={provider.name} className="shrink-0">
            <button
              className={`relative overflow-hidden rounded-xl border-4 bg-neutral-500 w-24 h-24 ${
                currentProvider === provider.id
                  ? "border-yellow-500 shadow-[0_0px_14px_0_rgb(234,179,8,39%)]"
                  : "border-neutral-600"
              } p-0 mb-2`}
              onClick={() => {
                setCurrentProvider(provider.id);
                console.debug(provider.id);
              }}
            >
              {/* <Image
                src={""} //provider.icon || "" } //"https://placehold.jp/150x150.png"}
                alt={`Photo by ${provider.name}`}
                className="aspect-square h-fit w-fit object-contain"
                width={100}
                height={100}
              /> */}
            </button>
            <figcaption className="text-xs text-center text-muted-foreground">
              <span className="font-semibold text-foreground">
                {provider.name || provider.domain}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
