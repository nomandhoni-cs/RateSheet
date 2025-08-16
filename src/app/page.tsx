"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UserSync } from "@/components/UserSync";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Background } from "@/components/Background";
import { Footer } from "@/components/Footer";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : "skip"
  );

  // Redirect to dashboard if user is signed in and has completed onboarding
  useEffect(() => {
    if (isLoaded && user && userData && userData.hasCompletedOnboarding) {
      router.push("/dashboard");
    }
  }, [isLoaded, user, userData, router]);

  return (
    <div className="flex flex-col min-h-screen">
      <UserSync />

      <SignedOut>
        <Background />
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-sans md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Welcome to RateSheet
                </h1>
                <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
                  A comprehensive production tracking and payroll management system
                  for garment manufacturing facilities.
                </p>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12 text-left">
                  <div className="p-6 bg-card rounded-lg shadow-sm border border-border">
                    <h3 className="text-lg font-sans font-semibold mb-2">Track Production</h3>
                    <p className="text-muted-foreground">
                      Monitor daily worker output with real-time logging and
                      comprehensive reporting.
                    </p>
                  </div>
                  <div className="p-6 bg-card rounded-lg shadow-sm border border-border">
                    <h3 className="text-lg font-sans font-semibold mb-2">Dynamic Pricing</h3>
                    <p className="text-muted-foreground">
                      Set time-sensitive rates for each product style with automatic
                      payroll calculations.
                    </p>
                  </div>
                  <div className="p-6 bg-card rounded-lg shadow-sm border border-border">
                    <h3 className="text-lg font-sans font-semibold mb-2">Team Management</h3>
                    <p className="text-muted-foreground">
                      Organize workers into sections with role-based access control
                      for managers and admins.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Get Started Free
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </SignedOut>

      <SignedIn>
        {/* This will be handled by UserSync and redirect */}
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </main>
      </SignedIn>
    </div>
  );
}
