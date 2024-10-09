"use client";

import { useCallback, useEffect, useState } from "react";

// import { providers } from "@/lib/blink";
import Image from "next/image";

export default function Home() {
  const [currentProvider, setCurrentProvider] = useState<string>("jup.ag");

    async function handleClaim() {

    }

  return (
    <main className="overflow-hidden min-h-screen h-screen sm:max-h-screen w-full flex flex-col p-4 bg-neutral-900 text-neutral-200">
      <div className="grow w-full h-full px-4 flex flex-col items-center justify-center gap-10">
        <div className="w-full flex flex-col items-center justify-center gap-6">
          <h1 className="font-semibold text-3xl">ORE Rush Happy Hours!</h1>
          <Image
            className="rounded-xl"
            src="/orerush-mines.png"
            alt="ORE Rush Happy Hours"
            width={340}
            height={340}
          />

          <button
            className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            onClick={() => handleClaim()}
          >
            Claim
          </button>
        </div>
        <div className="text-sm">
          <p className="max-w-sm text-center">
            Enable Blinks in their wallet extension for a better experience.
          </p>
          <p className="">
            <span className="text-xl pr-3 text-sky-400">Phantom</span> Settings
            → Experimental Features{" "}
          </p>
          <p className="">
            <span className="text-xl pr-3 text-red-400">Backpack</span> Solana →
            Allow Actions on X
          </p>
          <p className="">
            <span className="text-xl pr-3 text-amber-400">Solflare</span>{" "}
            Settings → Security & Privacy → Solana Actions
          </p>
          <br />
          <p className="">
            {"Or install the "}
            <a
              className="underline underline-offset-4"
              href="https://chromewebstore.google.com/detail/dialect-blinks/mhklkgpihchphohoiopkidjnbhdoilof"
              target="_blank"
            >
              Dialect Blinks extension
            </a>
          </p>
        </div>{" "}
      </div>
    </main>
  );
}
