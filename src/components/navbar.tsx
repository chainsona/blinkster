import Link from "next/link";
import { Madimi_One } from "next/font/google";
import { Badge } from "./ui/badge";
import { LineMdGithubLoop, LineMdTwitterX } from "./ui/icons";
import { ActionExtended, BlinkProvider } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const madimi = Madimi_One({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const items: {
  id: string;
  label: string;
  href: string;
  target?: string;
  icon?: React.ReactNode;
}[] = [
  {
    id: "github",
    label: "Github",
    href: "https://github.com/chainsona/blinkster",
    target: "_blank",
    icon: <LineMdGithubLoop />,
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com/Blinksuite",
    target: "_blank",
    icon: <LineMdTwitterX />,
  },
];

export function NavBar({
  providers,
  actions,
  currentProvider,
  setCurrentProvider,
  blinkConfig,
  setBlinkConfig,
}: {
  providers: {
    [key: string]: BlinkProvider;
  };
  actions: ActionExtended[];

  currentProvider: string;
  setCurrentProvider: (domain: string) => void;

  blinkConfig?: {
    name: string;
    actionUrl: string;
    blinkUrl: string;
  };
  setBlinkConfig: (
    config:
      | {
          name: string;
          actionUrl: string;
          blinkUrl: string;
        }
      | undefined
  ) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between pl-2 w-full">
      {/* Navbar Title */}
      <Link
        className="text-lg font-semibold text-foreground"
        href="/"
      >
        <div className="flex space-x-1 justify-center items-center">
          <h1 className={`text-2xl font-semibold ${madimi.className}`}>
            iBlink
          </h1>

          <Badge variant={"outline"} className="text-primary">
            Beta
          </Badge>
        </div>
      </Link>

      <nav className="rounded-lg bg-card w-full sm:w-auto px-3 py-2 text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* <Select value={currentProvider} onValueChange={setCurrentProvider}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(providers)
                .filter((p) => {
                  if (!p?.rules) {
                    return false;
                  }
                  return (
                    p.rules.length > 0 && !p.rules[0].pathPattern?.includes("*")
                  );
                })
                .map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name || provider.domain}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select> */}

          {/* TODO: Session management */}
          {/* <div className="hover:text-foreground hover:cursor-pointer">
            <FluentPlugDisconnected16Regular />
          </div> */}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select
            value={blinkConfig?.name}
            onValueChange={(actionId) => {
              const action = Object.values(actions).find(
                (a) => a.id === actionId
              );
              if (!action) {
                return;
              }

              setBlinkConfig({
                actionUrl: action.actionUrl,
                blinkUrl: action.pathPattern.startsWith("/")
                  ? `https://${action.providerId}${action.pathPattern}`
                  : `${action.pathPattern}`,
                name: action.name,
              });
            }}
          >
            <SelectTrigger className="w-full sm:w-[290px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(actions || []).map((action) => (
                <SelectItem key={action.id} value={action.id}>
                  {action.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* TODO: Session management */}
          {/* <div className="hover:text-foreground hover:cursor-pointer">
            <FluentPlugDisconnected16Regular />
          </div> */}
        </div>
        <div className="flex items-center gap-3 ml-0 sm:ml-4 w-full sm:w-auto">
          {items.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              className={`text-2xl md:text-xl font-medium transition-colors hover:text-primary`}
              href={item.href}
              target={item.target || "_self"}
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
