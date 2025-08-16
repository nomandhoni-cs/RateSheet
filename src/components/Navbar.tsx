// components/Navbar.tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center transition-opacity hover:opacity-80"
        >
          {/* Light mode logo */}
          <Image
            src="/dark-logo.svg"
            width={180}
            height={45}
            alt="RateSheet Logo"
            className="block dark:hidden"
            priority
          />
          {/* Dark mode logo */}
          <Image
            src="/white-logo.svg"
            width={180}
            height={45}
            alt="RateSheet Logo"
            className="hidden dark:block"
            priority
          />
        </Link>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          <ModeToggle />

          <SignedOut>
            <div className="hidden sm:flex items-center space-x-3">
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="text-sm font-medium">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>

            {/* Mobile auth buttons */}
            <div className="flex sm:hidden">
              <SignUpButton mode="modal">
                <Button size="sm" className="text-xs">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
      <MobileNav />
    </header>
  );
}

function MobileNav() {
  return (
    <nav className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
        <SignedOut>
          <div className="pt-3 border-t border-border/40 space-y-2">
            <SignInButton mode="modal">
              <Button variant="outline" size="sm" className="w-full">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </SignedOut>
    </nav>
  );
}
