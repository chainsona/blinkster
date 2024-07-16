import Link from "next/link";
import { PhEyesFill } from "@/components/logo";
import { usePathname } from "next/navigation";

const items = [
  {
    id: "designer",
    label: "Designer",
    href: "/designer",
  },
  {
    id: "catalog",
    label: "Catalog",
    href: "/catalog",
  },
  {
    id: "about",
    label: "About",
    href: "/about",
  },
];

export function NavBar() {
  const path = usePathname();

  return (
    <div className="border-b border-neutral-700 min-h-16 flex h-16 items-center px-4">
      {/* Navbar Title */}
      <Link
        className="text-lg font-semibold text-black dark:text-white"
        href="/"
      >
        <div className="flex space-x-1 justify-center items-center">
          <div className="text-2xl">
            <PhEyesFill />
          </div>
          <h1 className="text-lg font-semibold">Blinkster</h1>
        </div>
      </Link>

      <nav className="dark:text-neutral-200 flex items-center space-x-4 lg:space-x-6 mx-6">
        {items.map((item, index) => (
          <Link
            key={`${item.id}-${index}`}
            className={`text-sm font-medium ${
              path.endsWith(item.id) ? "text-primary" : "text-muted-foreground"
            }
            )} transition-colors hover:text-primary`}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
