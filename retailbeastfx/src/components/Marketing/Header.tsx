'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
    { href: '/start-here', label: 'START HERE' },
    { href: '/features', label: 'Features' },
    { href: '/journal', label: 'Journal' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/community', label: 'Community' },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-beast-green/10">
            <div className="container-wide mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-full border-2 border-beast-green/50 group-hover:border-beast-green transition-colors">
                            <Image
                                src="/mascot/mascot.jpg"
                                alt="RetailBeastFX Mascot"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="heading-cyber text-lg md:text-xl text-beast-green font-bold">
                                RetailBeastFX
                            </span>
                            <span className="text-[10px] text-gray-400 tracking-wider">v8.1 PREMIUM</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-sm text-gray-300 hover:text-beast-green transition-colors rounded-lg hover:bg-beast-green/5"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Version Badge - Hidden on mobile */}
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-beast-green/10 border border-beast-green/20">
                            <span className="w-2 h-2 rounded-full bg-beast-green animate-pulse" />
                            <span className="text-xs text-beast-green font-semibold">v9.0 FREE</span>
                        </div>

                        {/* Journal Button */}
                        <Link
                            href="/journal"
                            className="hidden sm:flex btn-outline text-sm py-2 px-4"
                        >
                            Launch Journal
                        </Link>

                        {/* Login Button */}
                        <button className="btn-glow text-sm py-2 px-4">
                            Sign Up
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-gray-300 hover:text-beast-green transition-colors"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-beast-green/10 animate-fade-in">
                        <nav className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-4 py-3 text-gray-300 hover:text-beast-green hover:bg-beast-green/5 rounded-lg transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
