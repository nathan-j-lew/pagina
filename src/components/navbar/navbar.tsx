import Link from "next/link";
import { useState } from "react";

export const Navbar = ({
  mode,
  modeSwitches,
}: {
  mode: string;
  modeSwitches: (() => void)[];
}) => {
  const [modeSwitcher, setModeSwitcher] = useState(0);

  const updateModeSwitcher = () => {
    setModeSwitcher((modeSwitcher) =>
      modeSwitcher < modeSwitches.length - 1 ? modeSwitcher + 1 : 0
    );
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-10">
      <div className="px-[5%] py-4 flex space-x-4 text-2xl">
        <Link href="/">Series</Link>
        <Link href="/about">About</Link>
        <div
          className="ml-auto flex"
          onClick={() => {
            modeSwitches[modeSwitcher]();
            updateModeSwitcher();
          }}
        >
          <div className="size-10 bg-blue-500" />
          <div className="size-10 bg-red-500" />
          <div className="size-10 bg-green-500">{mode}</div>
        </div>
      </div>
    </nav>
  );
};
