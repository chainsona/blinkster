"use client";
import React, { useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { Combobox } from "./combobox";
import { OcticonCopy16 } from "./ui/icons";
import { BlinkProvider } from "@/types";

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

      <button className="p-[3px] relative w-full h-10 px-6 py-2 bg-transparent bg-[#FFE35E] text-neutral-700 text-sm rounded-xl font-bold transform hover:-translate-y-1 transition duration-400">
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
        <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-400 rounded-lg" />
        <div className=" rounded-[6px] px-8 py-2 bg-[#FFE35E] text-neutral-800 font-medium relative group transition duration-200 hover:bg-transparent">
          Generate
        </div>
      </button>
    </form>
  );
}

interface BlinkGenerationFormProps {
  provider: BlinkProvider | null;
  blinkConfig?: {
    name: string;
    actionUrl: string;
    blinkUrl: string;
  };
  setBlinkConfig: (config: {
    name: string;
    actionUrl: string;
    blinkUrl: string;
  }) => void;
  userParams: any;
  setUserParams: (userParams: any) => void;
}

export function BlinkGenerationForm({
  provider,
  blinkConfig,
  setBlinkConfig,
  userParams,
  setUserParams,
}: BlinkGenerationFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  function generateForm(action: string) {
    if (!provider?.rules) return;

    console.log("Provider Action rules", provider?.rules);
    console.log("Action", action);

    switch (action) {
      case "buy-floor":
        return FormMarketplace(userParams, setUserParams, handleSubmit);

      case "swap":
      case "trade":
        return FormSwap(userParams, setUserParams, async (e) => {
          e.preventDefault();
          console.debug("Swap submitted");

          const actionData = provider.rules?.find(
            (action: any) => action.id === "swap" || action.id === "trade"
          );

          if (!actionData) return;

          // Fetch Action metadata
          const res = await fetch(
            actionData.actionUrl.replace(
              "/**",
              `/${userParams[action].from}-${userParams[action].to}`
            )
          );
          const data = await res.json();
          console.debug("BlinkGenerationForm data", JSON.stringify(data));

          const actionUrl = actionData.pathPattern.replace(
            "/**",
            `/${userParams[action].from}-${userParams[action].to}`
          );
          const blinkUrl = actionData.apiPath.replace(
            "/**",
            `/${userParams[action].from}-${userParams[action].to}`
          );
          console.log("Blink URL", blinkUrl);
          setBlinkConfig({ name: "Swap", actionUrl, blinkUrl });
        });

      // default:
      //   console.error("Invalid action");
    }
  }

  return (
    <div className="h-full flex flex-col items-center justify-center scrollbar-thin scrollbar-thumb-[#1A1A1E] scrollbar-track-transparent">
      <div className="min-w-60 w-full">
        {/* <Combobox
          items={(provider?.rules || []).map((action: any) => ({
            label: action.name,
            value: action.id,
          }))}
          selected={
            userParams?.[provider?.id || ""]?.lastAction
              ? userParams[provider?.id || ""]?.lastAction
              : `${provider?.rules?.[0]?.id}`
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
        /> */}

        {/* {generateForm(
          userParams?.[provider?.id || ""]?.lastAction ||
            provider?.rules?.[0]?.id
        )} */}
      </div>

      <div className="hidden sm:flex sm:grow"></div>
      {blinkConfig?.blinkUrl && (
        <div className="w-full max-w-screen-sm px-2 my-4 flex items-center justify-center gap-3">
          <button
            className="w-full h-12 px-6 py-2 bg-[#C7973A] text-white text-sm rounded-lg font-bold transform hover:bg-[#E8B54B] transition duration-300 ease-in-out"
            onClick={() => {
              window.open(
                encodeURI(
                  `http://x.com/share?text=test\n\n&url=https://dial.to/?action=solana-action:${blinkConfig?.actionUrl}`
                ),
                "_blank"
              );
            }}
          >
            <span className="font-['Squada_One'] text-lg">Share on 𝕏</span>
          </button>
          <button
            className="h-12 w-12 bg-[#3B3B3B] text-[#C7973A] rounded-lg font-bold transform hover:bg-[#5A5A5A] transition duration-300 ease-in-out flex items-center justify-center"
            onClick={() => {
              navigator.clipboard.writeText(blinkConfig?.blinkUrl || "");
            }}
          >
            <OcticonCopy16 className="w-6 h-6" />
          </button>
        </div>
      )}
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
