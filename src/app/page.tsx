"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UserSync } from "@/components/UserSync";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    <div className="container mx-auto px-4 py-8">
      <UserSync />

      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-sans md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to RateSheet
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-mono">
              A comprehensive production tracking and payroll management system
              for garment manufacturing facilities.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12 text-left">
              <div className="p-6 bg-white rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-2">Track Production</h3>
                <p className="text-gray-600">
                  Monitor daily worker output with real-time logging and
                  comprehensive reporting.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-2">Dynamic Pricing</h3>
                <p className="text-gray-600">
                  Set time-sensitive rates for each product style with automatic
                  payroll calculations.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-2">Team Management</h3>
                <p className="text-gray-600">
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
      </SignedOut>

      <SignedIn>
        {/* This will be handled by UserSync and redirect */}
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
