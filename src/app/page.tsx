"use client";

import { useCallback, useEffect, useState } from "react";

import { BlinkGenerateForm } from "@/components/blink-generate-form";
import { BlinkPreview } from "@/components/blink-preview";
import { BlinkProviders } from "@/components/blink-provider";
import { NavBar } from "@/components/navbar";

import { providers } from "@/lib/blink";

export default function Home() {
  const [currentProvider, setCurrentProvider] = useState<string>("jupiter");
  const [providerActions, setProviderActions] = useState<any[]>([]);

  const [userParams, setUserParams] = useState<any>({});
  const [blinkUrl, setBlinkUrl] = useState<string>("");
  const [blinkPreview, setBlinkPreview] = useState<any>({});

  const getApiResponse = useCallback(async () => {
    if (!!!currentProvider) return;

    let providerRes: any | null = null;
    try {
      const res = await fetch(`${providers[currentProvider].url}/actions.json`);
      providerRes = await res.json();
    } catch (error) {
      console.error(error);
    }

    console.log(providerRes);
    if (!providerRes) return;

    const actions: any[] = [];

    providerRes.rules.forEach((rule: any) => {
      const action: { [key: string]: any } = {};
      console.log(rule);

      action.id = rule.pathPattern.includes("/**")
        ? rule.apiPath.replace("/**", "").split("/").at(-1)
        : rule.apiPath.split("/").at(-1);
      action.name =
        action.id[0].toUpperCase() + action.id?.replaceAll("-", " ").slice(1);
      action.pattern = String(rule.pathPattern);
      action.url = String(rule.apiPath);

      console.log(action);
      actions.push(action);
    });
    setProviderActions(actions);

    if (actions.length === 1 && !actions[0].url.includes("/**")) {
      console.log("Single Static Action:", actions[0]);
      const res = await fetch(actions[0].url);
      const data = await res.json();
      console.log("Single Static Blink:", data);
      setBlinkUrl(providers[currentProvider].url + actions[0].pattern);
      setBlinkPreview(data);
    }
  }, [currentProvider]);

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
              setBlinkPreview={setBlinkPreview}
            />
          </aside>

          {providers[currentProvider] && (
            <aside className="sm:w-96 border-r border-neutral-700 p-4 items-center justify-center">
              <BlinkGenerateForm
                provider={providers[currentProvider]}
                providerActions={providerActions}
                blinkPreview={blinkPreview}
                setBlinkPreview={setBlinkPreview}
                blinkUrl={blinkUrl}
                setBlinkUrl={setBlinkUrl}
                userParams={userParams}
                setUserParams={setUserParams}
              />
            </aside>
          )}
        </div>

        <div className="w-full flex items-center justify-center">
          <BlinkPreview
            provider={providers[currentProvider]}
            data={blinkPreview}
          />
        </div>
      </div>
    </main>
  );
}
