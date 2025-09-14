"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function Navigation() {
    const { isSignedIn } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Image
                            src="/white-logo.svg"
                            alt="RateSheet"
                            width={120}
                            height={32}
                            className="h-8 w-auto dark:hidden"
                        />
                        <Image
                            src="/dark-logo.svg"
                            alt="RateSheet"
                            width={120}
                            height={32}
                            className="h-8 w-auto hidden dark:block"
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </a>
                        <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                            How it Works
                        </a>
                        <a href="https://github.com/nomandhoni-cs/RateSheet" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            GitHub
                        </a>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {isSignedIn ? (
                            <UserButton afterSignOutUrl="/" />
                        ) : (
                            <>
                                <SignInButton mode="modal">
                                    <Button variant="ghost">Sign In</Button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <Button>Get Started</Button>
                                </SignUpButton>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-border/40 py-4">
                        <div className="flex flex-col gap-4">
                            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                                Features
                            </a>
                            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                                How it Works
                            </a>
                            <a href="https://github.com/nomandhoni-cs/RateSheet" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                GitHub
                            </a>

                            <div className="flex flex-col gap-2 pt-4 border-t border-border/40">
                                {isSignedIn ? (
                                    <UserButton afterSignOutUrl="/" />
                                ) : (
                                    <>
                                        <SignInButton mode="modal">
                                            <Button variant="ghost" className="justify-start">Sign In</Button>
                                        </SignInButton>
                                        <SignUpButton mode="modal">
                                            <Button className="justify-start">Get Started</Button>
                                        </SignUpButton>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}