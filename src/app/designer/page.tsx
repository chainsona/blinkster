"use client";

import { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

import { BlinkGenerationForm } from "@/components/blink-generate-form";
import { ActionVisualizer } from "@/components/action-visualizer";
import { BlinkProvider } from "@/types";
import { NavBar } from "@/components/navbar";

const queryClient = new QueryClient();

function HomeContent() {
  const [currentProviderId, setCurrentProviderId] = useState<string>("jup.ag");
  const [currentProvider, setCurrentProvider] = useState<BlinkProvider | null>(
    null
  );
  const [blinkConfig, setBlinkConfig] = useState<
    | {
        name: string;
        actionUrl: string;
        blinkUrl: string;
      }
    | undefined
  >(undefined);

  const { data: providers = {} } = useQuery({
    queryKey: ["blinksFromRegistry"],
    queryFn: () =>
      fetch("/api/providers")
        .then((res) => res.json())
        .then((data) => data),
  });

  const { data: actions = {} } = useQuery({
    queryKey: ["actions"],
    queryFn: () =>
      fetch("/api/actions")
        .then((res) => res.json())
        .then((data) => data),
  });

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

  useEffect(() => {
    // Get provider from URL query param
    const urlParams = new URLSearchParams(window.location.search);
    const providerId = urlParams.get("provider");
    const provider =
      providerId && (providers as { [key: string]: BlinkProvider })[providerId];
    if (!!provider) {
      setCurrentProviderId(providerId);
    }
  }, [providers]);

  // useEffect(() => {
  //   console.debug("currentProvider", currentProviderId);
  //   const p: BlinkProvider = providers[currentProviderId];
  //   setCurrentProvider(p);
  //   if (!!p && !!p.rules) {
  //     setBlinkConfig({
  //       actionUrl: p.rules[0]?.actionUrl,
  //       blinkUrl: `${p.url}/${p.rules[0]?.apiPath}`,
  //     });
  //   }
  //   setBlinkConfig;
  // }, [currentProviderId, providers]);

  useEffect(() => {
    console.debug("blinkConfig", blinkConfig);
  }, [blinkConfig]);

  return (
    <>
      <div className="grow flex flex-col lg:flex-row items-start justify-center py-2">
        <NavBar
          providers={providers}
          actions={actions}
          currentProvider={currentProviderId}
          setCurrentProvider={setCurrentProviderId}
          blinkConfig={blinkConfig}
          setBlinkConfig={setBlinkConfig}
        />

        {blinkConfig && (
          <div className="w-full lg:flex-1 mb-4 lg:mb-0">
            <div className="max-w-full lg:max-w-3xl mx-auto">
              <ActionVisualizer {...{ config: blinkConfig }} />
            </div>
          </div>
        )}

        {providers[currentProviderId] && (
          <aside className="w-full lg:w-96">
            <BlinkGenerationForm
              provider={currentProvider}
              blinkConfig={blinkConfig}
              setBlinkConfig={setBlinkConfig}
              userParams={userParams}
              setUserParams={setUserParams}
            />
          </aside>
        )}
      </div>
    </>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeContent />
    </QueryClientProvider>
  );
}