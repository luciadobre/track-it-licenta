"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import HamburgerMenu from "../@atoms/HamburgerMenu";
import Button from "../@atoms/Button";

const publicLinks = [
  { path: "/about", label: "Despre Noi" },
  { path: "/dashboard/inventory", label: "Dashboard" },
  { path: "/contact", label: "Contact" },
];

import { dashboardNavItems } from "./navItems";

const Header = () => {
  const path = usePathname();
  const { data: session } = useSession();
  const mobileLinks = path.startsWith("/dashboard")
    ? dashboardNavItems
    : publicLinks;

  return (
    <header className="border-border bg-primary-dark/95 sticky top-0 z-50 border-b">
      <div className="mx-auto flex items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center text-2xl font-bold">
          <Image src="/logo-light.png" alt="Logo" width={120} height={60} />
        </Link>
        <div className="md:hidden">
          <HamburgerMenu links={mobileLinks} currentPath={path} />
        </div>
        <nav className="text-text-base hidden space-x-4 md:flex">
          {publicLinks.map(({ path, label }) => (
            <Button
              key={path}
              intent="textOnly"
              size="md"
              text={label}
              redirectPath={path}
            />
          ))}
          <Button
            intent="gradient"
            size="md"
            text={session ? "Deconectare" : "Conectare"}
            redirectPath={session ? "/api/auth/signout" : "/api/auth/signin"}
          />
        </nav>
      </div>
    </header>
  );
};

export default Header;
