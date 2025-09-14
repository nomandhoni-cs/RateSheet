"use client";

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
  useUser,
} from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Menu, X, BarChart3, Users, Building2, Palette, ClipboardList, DollarSign, FileText } from "lucide-react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { user } = useUser();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userData = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : "skip"
  );

  const isDashboard = pathname?.startsWith('/dashboard');
  const isOnboarded = userData?.hasCompletedOnboarding;

  const baseNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Workers", href: "/dashboard/workers", icon: Users },
    { name: "Sections", href: "/dashboard/sections", icon: Building2 },
    { name: "Styles", href: "/dashboard/styles", icon: Palette },
    { name: "Production", href: "/dashboard/production", icon: ClipboardList },
    { name: "Payroll", href: "/dashboard/payroll", icon: DollarSign },
    { name: "Bonuses", href: "/dashboard/bonuses", icon: FileText },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
  ];
  const navigation = userData?.role === 'admin'
    ? [...baseNavigation, { name: "Settings", href: "/dashboard/admin", icon: Building2 }]
    : baseNavigation;

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left side - Logo and Dashboard Menu */}
          <div className="flex items-center space-x-4">
            {/* Dashboard Menu Button */}
            {isDashboard && isOnboarded && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            {/* Logo */}
            <Link
              href={isDashboard && isOnboarded ? "/dashboard" : "/"}
              className="flex items-center transition-opacity hover:opacity-80"
            >
              {/* Light mode logo */}
              <Image
                src="/white-logo.svg"
                width={180}
                height={45}
                alt="RateSheet Logo"
                className="block dark:hidden"
                priority
              />
              {/* Dark mode logo */}
              <Image
                src="/dark-logo.svg"
                width={180}
                height={45}
                className="hidden dark:block"
                alt="RateSheet Logo"
                priority
              />
            </Link>

            {/* Desktop Dashboard Navigation */}
            {isDashboard && isOnboarded && (
              <nav className="hidden lg:flex items-center space-x-1 ml-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

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
              <div className="flex sm:hidden items-center space-x-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm" className="text-xs">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              {/* Show current user and role */}
              {userData && (
                <div className="hidden md:flex items-center gap-2 pr-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{userData.name}</span>
                  <span>·</span>
                  <span className="capitalize px-2 py-0.5 rounded bg-accent/60 text-foreground">{userData.role}</span>
                </div>
              )}
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
      </header>

      {/* Mobile Dashboard Sidebar */}
      {isDashboard && isOnboarded && (
        <>
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              className="fixed top-16 inset-x-0 bottom-0 z-30 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Mobile Sidebar */}
          <div className={`
            fixed top-16 bottom-0 left-0 z-40 w-64 bg-card border-r border-border shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-sans font-semibold">RateSheet</h2>
              <button
                className="p-1 rounded-md hover:bg-accent"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-6 px-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User info at bottom */}
            {userData && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-muted/50">
                <div className="text-sm">
                  <p className="font-medium font-sans">{userData.name}</p>
                  <p className="text-muted-foreground capitalize">{userData.role}</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}