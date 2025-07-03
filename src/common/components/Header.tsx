"use client";

import { UserButton } from "@clerk/nextjs";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "~/common/components/ui/switch";
import { SEO } from "~/constants";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="container mx-auto py-5">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="text-2xl font-bold">{SEO.appTitle}</div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              {mounted ? (
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={() =>
                    setTheme(theme === "dark" ? "light" : "dark")
                  }
                />
              ) : (
                <div className="h-[1.15rem] w-8" />
              )}
              <Moon className="h-4 w-4" />
            </div>

            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
