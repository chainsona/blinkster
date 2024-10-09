"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FiZap, FiBarChart2, FiMenu, FiX } from "react-icons/fi";
import { useWallet } from "@solana/wallet-adapter-react";

import { BlinkSuiteLogo } from "@/components/icons";
import { WalletButton } from "@/components/solana-provider";

import "../app/globals.css";

const menuItems = [
  { name: "Dashboard", icon: FiBarChart2, href: "/" },
  {
    name: "Campaigns",
    icon: FiZap,
    href: "/campaigns",
    startPath: "/campaign",
  },
  // { name: "Designer", icon: FiPenTool, href: "/designer" },
];

export default function Content({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { publicKey, signMessage, disconnect } = useWallet();
  const pathname = usePathname();

  useEffect(() => {
    const isDarkMode =
      localStorage.getItem("darkMode") === "true" ||
      (!("darkMode" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // useEffect(() => {
  //   const signAndLogin = async () => {
  //     if (publicKey && signMessage) {
  //       try {
  //         const message = `Sign this message to log in: ${Date.now()}`;
  //         const encodedMessage = new TextEncoder().encode(message);
  //         const signedMessage = await signMessage(encodedMessage);
  //         const signature = bs58.encode(signedMessage);

  //         const response = await fetch("/api/auth/login", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             publicKey: publicKey.toBase58(),
  //             signature,
  //             message,
  //           }),
  //         });

  //         if (response.ok) {
  //           const { token } = await response.json();
  //           localStorage.setItem("authToken", token);
  //           router.push("/"); // Redirect to dashboard or desired page
  //         } else {
  //           console.error("Login failed");
  //         }
  //       } catch (error) {
  //         console.error("Error during login:", error);
  //       }
  //     }
  //   };

  //   signAndLogin();
  // }, [publicKey, signMessage, router]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const startWithPath = (
    pathname: string,
    href: string,
    startPath: string | undefined
  ) => {
    return pathname === href || (startPath && pathname.startsWith(startPath));
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {publicKey && (
        <>
          {/* Mobile sidebar toggle button */}
          <button
            className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-[#383838] text-[#FEFEFE]"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          {/* Sidebar */}
          <aside
            className={`bg-[#383838] h-full fixed lg:static transition-all duration-300 ease-in-out z-10 overflow-y-auto lg:overflow-y-visible flex flex-col justify-between
                ${
                  sidebarOpen
                    ? "w-64 left-0"
                    : "-left-64 lg:left-0 lg:w-16 xl:w-64"
                }`}
          >
            {/* Menu (sidebar) */}
            <div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <BlinkSuiteLogo
                    className={`w-10 h-10 ${
                      sidebarOpen || "lg:mx-auto xl:mx-0"
                    }`}
                  />
                  <h1
                    className={`text-2xl font-extrabold text-[#E8B54B] ml-3 tracking-wide text-center sm:text-left ${
                      sidebarOpen || "lg:hidden xl:block"
                    }`}
                  >
                    Blinksuite
                  </h1>
                </div>
              </div>
              <nav>
                <ul>
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center p-4 hover:bg-[#2C2C2C] transition-colors
                            ${
                              sidebarOpen ||
                              "lg:justify-center xl:justify-start"
                            }
                            ${
                              startWithPath(pathname, item.href, item.startPath)
                                ? "bg-[#2C2C2C]"
                                : ""
                            }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon
                          className={`w-5 h-5 ${
                            startWithPath(pathname, item.href, item.startPath)
                              ? "text-[#E8B54B]"
                              : "text-[#FEFEFE]"
                          }`}
                        />
                        <span
                          className={`ml-3 ${
                            sidebarOpen || "lg:hidden xl:inline"
                          } ${
                            startWithPath(pathname, item.href, item.startPath)
                              ? "text-[#E8B54B]"
                              : ""
                          }`}
                        >
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="">
              {/* Social */}
              <div className="mt-auto">
                <div
                  className={`flex ${
                    sidebarOpen || "lg:flex-col xl:flex-row"
                  } justify-center items-center space-x-4 px-4`}
                >
                  <a
                    href="https://twitter.com/blinksuite"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#E8B54B] transition-colors p-2 rounded-full hover:bg-[#2C2C2C]"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a
                    href="https://t.me/+3R2PResNsxNiZDY0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#E8B54B] transition-colors p-2 rounded-full hover:bg-[#2C2C2C]"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* DISCONNECT */}
              <div className="flex justify-center items-center p-4 mb-2">
                <button
                  onClick={() => {
                    disconnect();
                  }}
                  className="bg-[#E8B54B] text-[#111111] px-4 py-2 rounded-lg font-bold transition-all duration-300 ease-in-out shadow-md border-2 border-[#E8B54B] w-full text-center cursor-pointer hover:bg-[#D9A43B] hover:border-[#D9A43B]"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main content */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
          publicKey ? "" : "flex items-center justify-center"
        }`}
      >
        {children}
      </main>
      {/* Overlay for mobile */}
      {publicKey && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-5 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}
