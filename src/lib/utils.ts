import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDomain(url: string) {
  if (!url) {
    console.error("URL is required");
    return;
  }

  console.log("URL:", url);

  let url_ = url.replace(/(https?:\/\/)?(www.|app.)?/i, "");

  console.log("URL_:", url_);

  if (url_.indexOf("/") !== -1) {
    return url_.split("/")[0];
  }

  return url_;
}
