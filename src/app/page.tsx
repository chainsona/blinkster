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
    <main className="sm:overflow-hidden min-h-screen h-screen sm:max-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#E5B34A]">
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-center font-['Comic_Sans_MS']">
          iBlink
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl text-center font-['Papyrus']">
          Custom Blinks for everyone
        </h2>
        <Image
          src="/iblinkto.gif"
          alt="iBlinkTo"
          className="max-w-full max-h-full"
          width={200}
          height={200}
        />

        <a
          href="https://x.com/iBlinkTo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 bg-[#1DA1F2] text-white font-['Chalkduster'] rounded-full hover:bg-[#0c85d0] transition duration-300 transform hover:scale-110"
        >
          Follow us on X
        </a>
      </div>
    </main>
  );
}
