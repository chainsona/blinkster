"use client";

import { useCallback, useEffect, useState } from "react";

import { BlinkGenerationForm } from "@/components/blink-generate-form";
import { BlinkProviders } from "@/components/blink-provider";
import { NavBar } from "@/components/navbar";

import { providers } from "@/lib/blink";
import { ActionVisualizer } from "@/components/action-visualizer";
import Image from "next/image";

export default function Home() {
  const [currentProvider, setCurrentProvider] = useState<string>("jup.ag");
  const [providerActions, setProviderActions] = useState<any[]>([]);

  const [userParams, setUserParams] = useState<any>({
    swap: {
      amount: 0,
      from: "SOL",
      to: "SEND",
      slippage: 0,
    },
    trade: {
      amount: 0,
      from: "SOL",
      to: "hSOL",
      slippage: 0,
    },
    "buy-floor": {
      id: "madlads",
    },
  });
  const [blinkUrl, setBlinkUrl] = useState<
    | {
        action: string;
        blink: string;
      }
    | undefined
  >();

  const getApiResponse = useCallback(async () => {
    if (!!!currentProvider) return;

    // Fetch provider actions.json
    let providerRes: any | null = null;
    try {
      const res = await fetch("/api/actions/resolver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: `${providers[currentProvider].url}/actions.json`,
        }),
      });
      providerRes = await res.json();
    } catch (error) {
      console.error(error);
    }
    console.debug("GET {DOMAIN}/actions.json", providerRes);

    // If no actions.json, stop
    if (!providerRes) return;

    // Extract actions from actions.json
    const actions: any[] = [];
    providerRes.rules.forEach((rule: any) => {
      const action: { [key: string]: any } = {};
      console.debug("Provider rule", JSON.stringify(rule));

      action.id = rule.pathPattern.includes("/*")
        ? rule.apiPath.replace("/**", "").replace("/*").split("/").at(-1)
        : rule.apiPath.split("/").at(-1);

      action.name =
        action.id[0].toUpperCase() + action.id?.replaceAll("-", " ").slice(1);

      action.pattern = `${providers[currentProvider].url}${rule.pathPattern}`;
      action.url = String(rule.apiPath);

      console.debug("Provider action", JSON.stringify(action));
      actions.push(action);
    });
    setProviderActions(actions);

    // If only one action, visualize it
    if (actions.length === 1 && !actions[0].url.includes("/*")) {
      console.debug("Single Static Action:", JSON.stringify(actions[0]));
      const res = await fetch(actions[0].url);
      const data = await res.json();
      console.debug("Single Static Action metadata:", JSON.stringify(data));
      console.log(`providers[currentProvider]: ${providers[currentProvider]}`);
      const blinkUrl_ = {
        action: providers[currentProvider].url + actions[0].url,
        blink: providers[currentProvider].url + actions[0].pattern,
      };
      console.debug("blinkUrl_", blinkUrl_);
      setBlinkUrl(blinkUrl_);
    }
  }, [currentProvider]);

  useEffect(() => {
    // Get provider from URL query param
    const urlParams = new URLSearchParams(window.location.search);
    const provider = urlParams.get("provider");
    if (provider && providers[provider]) {
      setCurrentProvider(provider);
    }
  }, []);

  useEffect(() => {
    console.log("currentProvider:", currentProvider);
    getApiResponse();
  }, [currentProvider, getApiResponse]);

  return (
    <main className="overflow-hidden min-h-screen h-screen sm:max-h-screen w-full flex flex-col p-4 bg-neutral-900">
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
          <h2 className="max-w-sm text-center">
            This offer is only accessible to users who enabled Blinks in their
            wallet extension.
          </h2>
        </div>
        <div className="text-sm">
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
