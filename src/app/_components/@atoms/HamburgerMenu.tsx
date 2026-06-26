"use client";

import { useState } from "react";
import Link from "next/link";

interface NavLink {
  path: string;
  label: string;
}

interface HamburgerMenuProps {
  links: NavLink[];
  currentPath: string;
}

const HamburgerMenu = ({ links, currentPath }: HamburgerMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <label htmlFor="burger-check" className="burger">
        <input
          type="checkbox"
          id="burger-check"
          checked={open}
          onChange={() => setOpen((v) => !v)}
        />
        <span />
        <span />
        <span />
      </label>

      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-primary-dark p-6 transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 text-lg font-semibold">Trackit</div>
        <ul className="space-y-1">
          {links.map(({ path, label }) => (
            <li key={path}>
              <Link
                href={path}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  currentPath.startsWith(path)
                    ? "bg-box-background-hover text-text-base font-medium"
                    : "text-text-secondary hover:bg-box-background-hover hover:text-text-base"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default HamburgerMenu;
