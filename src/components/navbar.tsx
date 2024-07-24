import Link from "next/link";
import { usePathname } from "next/navigation";
import { Madimi_One } from "next/font/google";
import { Badge } from "./ui/badge";
import {
  FluentPlugDisconnected16Regular,
  LineMdGithubLoop,
  LineMdTwitterX,
} from "./ui/icons";

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
    href: "https://x.com/iBlinkTo",
    target: "_blank",
    icon: <LineMdTwitterX />,
  },
];

export function NavBar() {
  const path = usePathname();

  return (
    <div className="flex items-center justify-between pl-2">
      {/* Navbar Title */}
      <Link
        className="text-lg font-semibold text-black dark:text-white"
        href="/"
      >
        <div className="flex space-x-1 justify-center items-center">
          <h1 className={`text-2xl font-semibold ${madimi.className}`}>
            iBlink
          </h1>

          <Badge variant={"outline"} className="text-red-500">
            Alpha
          </Badge>
        </div>
      </Link>

      <nav className="rounded-lg bg-neutral-950 w-64 px-3 py-2 dark:text-neutral-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="">Editor</div>

          {/* TODO: Session management */}
          {/* <div className="hover:text-neutral-50 hover:cursor-pointer">
            <FluentPlugDisconnected16Regular />
          </div> */}
        </div>
        <div className="flex items-center gap-3">
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
