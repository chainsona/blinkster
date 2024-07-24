"use client";

import { useCallback, useEffect, useState } from "react";

import { BlinkGenerationForm } from "@/components/blink-generate-form";
import { BlinkProviders } from "@/components/blink-provider";
import { NavBar } from "@/components/navbar";

import { providers } from "@/lib/blink";
import { ActionVisualizer } from "@/components/action-visualizer";

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
  });
  const [blinkUrl, setBlinkUrl] = useState<string | undefined>();

  const getApiResponse = useCallback(async () => {
    if (!!!currentProvider) return;

    // Fetch provider actions.json
    let providerRes: any | null = null;
    try {
      const res = await fetch(`${providers[currentProvider].url}/actions.json`);
      providerRes = await res.json();
    } catch (error) {
      console.error(error);
    }
    console.debug("GET DOMAIN/actions.json", providerRes);

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
      setBlinkUrl(providers[currentProvider].url + actions[0].pattern);
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
    <main className="overflow-hidden min-h-screen sm:max-h-screen w-full flex flex-col">
      <NavBar />
      <div className="overflow-hidden grow flex flex-col sm:flex-row">
        <div className="overflow-hidden flex flex-col sm:flex-row">
          <aside className="overflow-x-auto sm:overflow-x-hidden overflow-y-hidden sm:overflow-y-auto w-full sm:w-64 border-r border-neutral-700 items-center justify-center">
            <BlinkProviders
              currentProvider={currentProvider}
              setCurrentProvider={setCurrentProvider}
            />
          </aside>

          {providers[currentProvider] && (
            <aside className="sm:w-96 border-r border-neutral-700 p-4 items-center justify-center">
              <BlinkGenerationForm
                provider={providers[currentProvider]}
                providerActions={providerActions}
                blinkUrl={blinkUrl}
                setBlinkUrl={setBlinkUrl}
                userParams={userParams}
                setUserParams={setUserParams}
              />
            </aside>
          )}
        </div>

        <div className="w-full flex items-center justify-center px-8 mb-8 md:mb-0 p-8">
          {blinkUrl && (
            <div className="w-full h-full overflow-y-auto max-h-fit max-w-xl">
              <ActionVisualizer {...{ url: blinkUrl }} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
