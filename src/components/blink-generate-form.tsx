"use client";
import React, { useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { Combobox } from "./combobox";

function FormMarketplace(
  userParams: any,
  setUserParams: (userParams: any) => void,
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
) {
  return (
    <form className="flex flex-col space-y-4 mb-4" onSubmit={handleSubmit}>
      <LabelInputContainer>
        <Label htmlFor="collection-id">Collection ID</Label>
        <Input
          id="collection-id"
          placeholder="madlads"
          type="text"
          value={userParams.collectionId}
          onChange={(e) =>
            setUserParams({
              ...userParams,
              ...{ collectionId: e.target.value },
            })
          }
        />
      </LabelInputContainer>

      <button className="p-[3px] relative w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
        <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
          Generate
        </div>
      </button>
    </form>
  );
}

function FormSwap(
  userParams: any,
  setUserParams: (userParams: any) => void,
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
) {
  const [from, setFrom] = useState(userParams?.swap?.from);
  const [to, setTo] = useState(userParams?.swap?.to);

  return (
    <form className="mb-4 p-2 flex flex-col space-y-4" onSubmit={handleSubmit}>
      <LabelInputContainer>
        <Label htmlFor="swap-from">From</Label>
        <Input
          id="swap-from"
          placeholder="SOL"
          type="text"
          value={from}
          onChange={(e) => {
            const params = userParams;
            params.swap = {
              ...(params.swap || {}),
              ...{ from: e.target.value },
            };
            setUserParams(params);
            setFrom(e.target.value);
          }}
        />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="swap-to">To</Label>
        <Input
          id="swap-to"
          placeholder="BONK"
          type="text"
          value={to}
          onChange={(e) => {
            const params = userParams;
            params.swap = {
              ...(params.swap || {}),
              ...{ to: e.target.value },
            };
            setUserParams(params);
            setTo(e.target.value);
          }}
        />
      </LabelInputContainer>

      <button className="p-[3px] relative w-full" type="submit">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
        <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
          Generate
        </div>
      </button>
    </form>
  );
}

interface BlinkGenerationFormProps {
  provider: any;
  providerActions: any;
  blinkUrl?: string;
  setBlinkUrl: (blinkUrl: string) => void;
  userParams: any;
  setUserParams: (userParams: any) => void;
}

export function BlinkGenerationForm({
  provider,
  providerActions,
  blinkUrl,
  setBlinkUrl,
  userParams,
  setUserParams,
}: BlinkGenerationFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  function generateForm(action: string) {
    if (!providerActions) return;

    console.log("Provider Actions", providerActions);
    console.log("Action", action);
    switch (action) {
      case "buy-floor":
        return FormMarketplace(userParams, setUserParams, handleSubmit);
      case "swap":
      case "trade":
        return FormSwap(userParams, setUserParams, async (e) => {
          e.preventDefault();
          console.log("Swap submitted");

          const actionData = providerActions.find(
            (action: any) => action.id === "swap" || action.id === "trade"
          );

          if (!actionData) return;

          // Fetch Action metadata
          const res = await fetch(
            actionData.url.replace(
              "/**",
              `/${userParams[action].from}-${userParams[action].to}`
            )
          );
          const data = await res.json();
          console.debug("BlinkGenerationForm data", JSON.stringify(data));

          const blinkUrl =
            // provider.url +
            actionData.url.replace(
              "/**",
              `/${userParams[action].from}-${userParams[action].to}`
            );
          console.log("Blink URL", blinkUrl);
          setBlinkUrl(blinkUrl);
        });

      // default:
      //   console.error("Invalid action");
    }
  }

  return (
    <div className="">
      <Combobox
        items={providerActions?.map((action: any) => ({
          label: action.name,
          value: action.id,
        }))}
        selected={
          userParams?.[provider?.id]?.lastAction
            ? userParams[provider?.id]?.lastAction
            : `${providerActions?.[0]?.id}`
        }
        onSelect={(value) => {
          const params: any = userParams;
          if (provider?.id) {
            params[provider?.id] = {
              ...(params[provider?.id] || {}),
              ...{ lastAction: value },
            };
          }
          console.log("Params", params);
          setUserParams(params);
        }}
      />

      {generateForm(
        userParams?.[provider?.id]?.lastAction || providerActions?.[0]?.id
      )}

      <div className="w-full max-w-screen-sm px-2 my-4 flex flex-col items-center justify-center space-y-3">
        <button
          className="w-full h-full shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
          onClick={() => {
            navigator.clipboard.writeText(blinkUrl || "");
          }}
        >
          Copy Blink
        </button>
        <button
          className="w-full h-full shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
          onClick={() => {
            // open a link to share on Solana
            window.open(
              encodeURI(
                `http://x.com/share?text=Look, I Blink Too!\n\n&url=${blinkUrl}&hashtags=Solana,Blinks,Actions`
              ),
              "_blank"
            );
          }}
        >
          Share on <span className="text-lg">𝕏</span>
        </button>
      </div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
