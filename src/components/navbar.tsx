import { AudioLines } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <header className="fixed bg-secondary z-50 top-0 left-0 w-full h-14 flex border-b">
      <nav className="w-full h-full flex">
        <div className="w-full p-2 px-6 flex items-center justify-between">
          {/* Left section - Logo */}
          <div className="flex justify-center items-center gap-1">
            <AudioLines className="size-7" />
          </div>

          {/* Centre - search */}
          <div>{/* TO DO: Add Global Search */}</div>

          {/* Right - user profile, theme toggler, others */}
          <div className="flex">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
