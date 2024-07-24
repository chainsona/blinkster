"use client";

import { Action, Blink } from "@dialectlabs/blinks";
import { useAction } from "@dialectlabs/blinks/react";
import { useEffect, useState } from "react";
import { Connection, clusterApiUrl } from "@solana/web3.js";

import "@dialectlabs/blinks/index.css";

type ActionVisualizerProps = {
  url: string;
};

export function ActionVisualizer({ url }: ActionVisualizerProps) {
  const [actionState, setactionState] = useState<Action | null>(null);

  const { action } = useAction(url, {
    rpcUrlOrConnection: new Connection(
      process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl("mainnet-beta")
    ),
  });

  useEffect(() => {
    setactionState(action);
  }, [action]);

  return actionState ? (
    <Blink
      action={actionState as Action}
      websiteText={new URL(url).hostname}
      stylePreset="x-dark"
    />
  ) : null;
}
