"use client";

import { Action, Blink } from "@dialectlabs/blinks";
import { useAction } from "@dialectlabs/blinks/react";
import { useEffect, useState } from "react";
import { Connection, clusterApiUrl } from "@solana/web3.js";

import "@dialectlabs/blinks/index.css";

type ActionVisualizerProps = {
  config: {
    actionUrl: string;
    blinkUrl: string;
  };
};

export function ActionVisualizer({ config }: ActionVisualizerProps) {
  const [actionState, setactionState] = useState<Action | null>(null);

  const { action } = useAction(config?.actionUrl, {
    rpcUrlOrConnection: new Connection(
      process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl("mainnet-beta")
    ),
  });

  useEffect(() => {
    setactionState(action);
    console.debug("action", action);
  }, [action]);

  return actionState ? (
    <div className="py-4 w-full max-w-[480px] h-[60vh] mx-auto scale-75 sm:scale-90 md:scale-95 lg:scale-100">
      <Blink
        action={actionState as Action}
        websiteText={new URL(config?.blinkUrl).hostname}
        stylePreset="default"
      />
    </div>
  ) : null;
}
