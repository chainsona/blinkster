"use client";

import * as jwt from "jsonwebtoken";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useWallet } from "@solana/wallet-adapter-react";

import { WalletButton } from "@/components/solana-provider";

type Props = {
  children: React.ReactNode;
};

type AuthentificationStatus = "unauthorized" | "disconnected" | "authenticated";

export default function PageGuard({ children }: Props) {
  const { connected, publicKey, signMessage } = useWallet();
  const [authCookie, _, removeAuthCookie] = useCookies(["access_token"]);
  const [authStatus, setAuthStatus] =
    useState<AuthentificationStatus>("disconnected");
  const pathname = usePathname();

  function content(status: AuthentificationStatus) {
    if (["unauthorized", "disconnected"].includes(status)) {
      return (
        <div
          className="overflow-y-auto min-h-screen w-full
          flex flex-col items-center justify-between
          bg-[#151515] text-neutral-100"
        >
          <div className="w-full flex-grow flex flex-col items-center justify-center">
            <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen w-full bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] text-white">
              <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center items-center lg:items-start">
                <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-center lg:text-left">
                  Blinksuite
                </h1>

                <p className="text-lg lg:text-xl mb-8 text-gray-300 text-center lg:text-left">
                  Boost your growth with Blinks
                </p>
                <div className="flex flex-col items-center lg:items-start">
                  <WalletButton
                    style={{
                      backgroundColor: "#E8B54B",
                      color: "#111111",
                      padding: "16px 32px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      border: "2px solid #E8B54B",
                      width: "100%",
                      maxWidth: "300px",
                      marginBottom: "24px",
                      cursor: "pointer",
                    }}
                    className="hover:bg-[#D9A43B] hover:border-[#D9A43B] hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    onClick={() => {
                      console.log("Wallet button clicked");
                    }}
                  />
                  <p className="text-sm text-gray-400 text-center lg:text-left">
                    Don&apos;t have a wallet?{" "}
                    <a
                      href="https://solflare.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E8B54B] hover:text-[#D9A43B] hover:underline transition-colors duration-300"
                    >
                      Download Solflare
                    </a>
                  </p>
                </div>
              </div>

              <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center">
                <div className="bg-[#2D2D2D] bg-opacity-50 backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-2xl w-full transform hover:scale-105 transition-all duration-300">
                  <img
                    src="https://framerusercontent.com/images/tPN9e9aCkYFccAwrlWDjjd5LUvQ.png?scale-down-to=1024"
                    alt="BlinkSuite Preview"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return publicKey && children;
  }

  const handleSignMessage = useCallback(async () => {
    if (publicKey && connected && !authCookie?.access_token) {
      if (!signMessage) {
        return setAuthStatus("disconnected");
      }

      const message = `Connected Solana account: ${publicKey?.toBase58()}

Please sign a message to verify your wallet. It's free and secure.`;
      const messageBytes = new TextEncoder().encode(message);

      signMessage(messageBytes)
        .then((signature) => {
          if (!signature) {
            return setAuthStatus("unauthorized");
          }

          // Login user
          fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
              publicKey,
              message: messageBytes,
              signature,
            }),
          })
            .then((res) => {
              if (res.status === 200) {
                setAuthStatus("authenticated");
              } else {
                setAuthStatus("unauthorized");
              }
            })
            .catch(() => {
              setAuthStatus("unauthorized");
            });
        })
        .catch(() => {
          setAuthStatus("unauthorized");
        });
    }
  }, [publicKey, connected, signMessage, authCookie.access_token]);

  const checkSession = useCallback(async () => {
    // Handle authentification
    if (!publicKey) {
      return setAuthStatus("disconnected");
    }

    let isExpired = true;
    if (authCookie.access_token) {
      // Check if jwt is expired
      const decoded = jwt.decode(authCookie.access_token) as {
        exp: number;
        sub: string;
      };

      // Check if the public key matches the jwt
      if (decoded.sub !== publicKey.toBase58()) {
        removeAuthCookie("access_token");
        return setAuthStatus("unauthorized");
      }

      // Check if the jwt is expired
      const now = Date.now();
      if (decoded.exp * 1000 > now) {
        console.log({
          now: now,
          exp: decoded.exp * 1000,
        });
        isExpired = false;
      }
    }

    if (isExpired) {
      removeAuthCookie("access_token");
      return setAuthStatus("disconnected");
    }

    if (!isExpired && authCookie?.access_token) {
      setAuthStatus("authenticated");
    }
  }, [authCookie.access_token, publicKey, removeAuthCookie]);

  useEffect(() => {
    checkSession();
  }, [publicKey]);

  useEffect(() => {
    handleSignMessage();
  }, [publicKey]);

  if (pathname === "/hats-on" || authStatus === "authenticated") {
    return <div className="h-full w-full">{children}</div>;
  }

  return content(authStatus);
}
