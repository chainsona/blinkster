"use client";
import React, { useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";
import { ActionGetResponse } from "@/types";
import { Combobox } from "./combobox";
import { BlinkPreview } from "./blink-preview";

function FormMarketplace(
  userParams: any,
  setUserParams: (userParams: any) => void,
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
) {
  const [collectionId, setCollectionId] = useState(userParams.collectionId);

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

interface BlinkGenerateFormProps {
  provider: any;
  providerActions: any;
  blinkPreview: any;
  setBlinkPreview: (blinkPreview: any) => void;
  blinkUrl: string;
  setBlinkUrl: (blinkUrl: string) => void;
  userParams: any;
  setUserParams: (userParams: any) => void;
}

export function BlinkGenerateForm({
  provider,
  providerActions,
  blinkPreview,
  setBlinkPreview,
  blinkUrl,
  setBlinkUrl,
  userParams,
  setUserParams,
}: BlinkGenerateFormProps) {
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
        return FormSwap(userParams, setUserParams, async (e) => {
          e.preventDefault();
          console.log("Swap submitted");

          const actionData = providerActions.find(
            (action: any) => action.id === "swap"
          );

          if (!actionData) return;

          // Fetch actions

          const res = await fetch(
            actionData.url.replace(
              "/**",
              `/${userParams.swap.from}-${userParams.swap.to}`
            )
          );
          const data = await res.json();
          console.log("Blink", data);
          setBlinkPreview(data);
          setBlinkUrl(
            provider.url +
              actionData.pattern.replace(
                "/**",
                `/${userParams.swap.from}-${userParams.swap.to}`
              )
          );
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
            navigator.clipboard.writeText(blinkUrl);
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
                `http://x.com/share?text=${blinkPreview.title}\nMade by @the76devs\n&url=${blinkUrl}&hashtags=Solana,Blink,Actions`
              ),
              "_blank"
            );
          }}
        >
          Share on <span className="text-lg">𝕏</span>
        </button>
      </div>
    </div>
    // <form
    //   className="w-full flex flex-col justify-between p-4 space-y-4"
    //   onSubmit={handleSubmit}
    // >
    //   <div className="overflow-y-auto w-full shadow-input bg-white dark:bg-transparent">
    //     {/* <div className="mb-4">
    //       <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
    //         Blink Designer
    //       </h2>
    //       <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
    //         Create  Solana Blinks & Actions to share with others
    //       </p>
    //     </div> */}

    //     {generateForm(provider?.actions?.[0].name)}

    //     {/* <div className="flex flex-col space-y-4 mb-4">
    //       <LabelInputContainer>
    //         <Label htmlFor="title">Title</Label>
    //         <Input
    //           id="title"
    //           placeholder="Donate to GoodCause Charity"
    //           type="text"
    //           value={userParams.title}
    //         />
    //       </LabelInputContainer>
    //       <LabelInputContainer>
    //         <Label htmlFor="title">Description</Label>
    //         <Input
    //           id="title"
    //           placeholder="Help support this charity by donating SOL."
    //           type="text"
    //           value={userParams.description}
    //         />
    //       </LabelInputContainer>
    //       <LabelInputContainer>
    //         <Label htmlFor="label">Label</Label>
    //         <Input
    //           id="label"
    //           placeholder="Donate SOL"
    //           type="text"
    //           value={userParams.label}
    //         />
    //       </LabelInputContainer>
    //       <div className="flex flex-row space-x-2">
    //         <LabelInputContainer>
    //           <Label htmlFor="icon">Icon</Label>
    //           <Input
    //             id="icon"
    //             placeholder="https://path/to/image.png"
    //             type="text"
    //             value={userParams.icon}
    //           />
    //         </LabelInputContainer>
    //       </div>
    //       <div className="">
    //         <h3 className="dark:text-white scroll-m-20 text-xl font-semibold tracking-tight my-4">
    //           Actions
    //         </h3>
    //         <div className="flex flex-col space-y-2">
    //           {userParams.actions.map((action, index) => (
    //             <div key={index} className="flex flex-col space-y-2">
    //               <LabelInputContainer>
    //                 <Label htmlFor={`action-${index}-url`}>URL</Label>
    //                 <Input
    //                   id={`action-${index}-url`}
    //                   placeholder=""
    //                   type="text"
    //                   value={action.href}
    //                 />
    //               </LabelInputContainer>
    //               <LabelInputContainer>
    //                 <Label htmlFor={`action-${index}-label`}>Label</Label>
    //                 <Input
    //                   id={`action-${index}-label`}
    //                   placeholder=""
    //                   type="text"
    //                   value={action.label}
    //                 />
    //               </LabelInputContainer>

    //               {action.parameters && (
    //                 <div className="flex flex-row space-x-2">
    //                   {action.parameters.map((parameter, index) => (
    //                     <div
    //                       key={index}
    //                       className="w-full flex flex-row space-x-2"
    //                     >
    //                       <LabelInputContainer>
    //                         <Label htmlFor={`action-${index}-param`}>
    //                           Name
    //                         </Label>
    //                         <Input
    //                           id={`action-${index}-param`}
    //                           placeholder=""
    //                           type="text"
    //                           value={parameter.name}
    //                         />
    //                       </LabelInputContainer>
    //                     </div>
    //                   ))}
    //                 </div>
    //               )}
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </div> */}
    //   </div>

    //   {/* <button
    //       className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
    //       type="submit"
    //     >
    //       Generate
    //       <BottomGradient />
    //     </button> */}

    //   {/* <button className="w-full inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
    //       Generate
    //     </button> */}

    //   <button className="p-[3px] relative w-full">
    //     <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
    //     <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
    //       Generate{" "}
    //     </div>
    //   </button>

    //   <div className="w-full max-w-screen-sm mx-auto my-4 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-2">
    //     <button className="w-full h-full shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
    //       Copy Blink
    //     </button>
    //     <button className="w-full h-full shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
    //       Share on <span className="text-lg">𝕏</span>
    //     </button>
    //   </div>
    // </form>

    // <Tabs
    //   defaultValue={
    //     !providerActions.length ? "" : `action-${providerActions[0]?.name}`
    //   }
    //   className="p-2 min-w-fit"
    // >
    //   <TabsList className="w-full justify-start">
    //     {providerActions.map((action: any) => (
    //       <TabsTrigger
    //         key={`action-${action?.name}-tab`}
    //         value={`action-${action?.name}`}
    //       >
    //         <p className="first-letter:capitalize">
    //           {action?.name?.replace("-", " ")}
    //         </p>
    //       </TabsTrigger>
    //     ))}
    //   </TabsList>
    //   {providerActions.map((action: any) => (
    //     <TabsContent
    //       key={`action-${action?.name}`}
    //       value={`action-${action?.name}`}
    //     >
    //       {generateForm(action.name)}
    //     </TabsContent>
    //   ))}
    // </Tabs>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

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
