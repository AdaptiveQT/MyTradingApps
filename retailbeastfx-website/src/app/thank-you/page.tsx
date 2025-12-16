'use client';

import Image from 'next/image';
import { GlowButton } from '@/components/Marketing';

export default function ThankYouPage() {
    return (
        <div className="relative min-h-screen">
            {/* Background effects */}
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute inset-0 bg-radial-glow" />

            <section className="section-padding relative z-10">
                <div className="container-narrow mx-auto text-center">
                    {/* Success Icon */}
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-beast-green/20 flex items-center justify-center animate-pulse-slow">
                        <svg className="w-12 h-12 text-beast-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Heading */}
                    <h1 className="heading-cyber text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="text-white">Welcome to the</span>
                        <br />
                        <span className="gradient-text">Beast Pack! 🔥</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                        Thank you for your purchase! Your RetailBeastFX Premium indicator is ready to download.
                    </p>

                    {/* Download Card */}
                    <div className="glass-card rounded-2xl p-8 md:p-12 max-w-xl mx-auto mb-12 border-beast-green/30">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-xl bg-beast-green/20 flex items-center justify-center">
                                <svg className="w-8 h-8 text-beast-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-white">RetailBeastFX Premium</h3>
                                <p className="text-gray-400 text-sm">MT5 Indicator v8.0</p>
                            </div>
                        </div>

                        <a
                            href="/downloads/RetailBeastFX_Premium.ex5"
                            download
                            className="glow-button w-full justify-center flex items-center gap-3 text-lg py-4"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Indicator
                        </a>
                    </div>

                    {/* Installation Steps */}
                    <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto mb-12">
                        <h3 className="heading-cyber text-2xl text-white mb-6">
                            Quick Installation
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6 text-left">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-10 h-10 rounded-full bg-beast-green/20 text-beast-green font-bold flex items-center justify-center mb-3">1</div>
                                <p className="text-gray-300 text-sm">Open <span className="text-white font-medium">MT5</span> and go to <span className="text-beast-green">File → Open Data Folder</span></p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-10 h-10 rounded-full bg-beast-green/20 text-beast-green font-bold flex items-center justify-center mb-3">2</div>
                                <p className="text-gray-300 text-sm">Navigate to <span className="text-white font-medium">MQL5 → Indicators</span> and paste the <span className="text-beast-green">.ex5 file</span></p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-10 h-10 rounded-full bg-beast-green/20 text-beast-green font-bold flex items-center justify-center mb-3">3</div>
                                <p className="text-gray-300 text-sm"><span className="text-white font-medium">Restart MT5</span>, then drag the indicator onto any chart!</p>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <GlowButton href="https://discord.gg/retailbeastfx" variant="outline" external>
                            Join Discord Community
                        </GlowButton>
                        <GlowButton href="/journal" variant="outline">
                            Open Trading Journal
                        </GlowButton>
                    </div>

                    <p className="text-gray-500 text-sm">
                        Need help? Reach out in Discord or email support@retailbeastfx.com
                    </p>
                </div>
            </section>

            {/* Background mascot */}
            <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none hidden lg:block">
                <Image
                    src="/mascot/beast-pose-4-hero.png"
                    alt=""
                    width={350}
                    height={350}
                    className="drop-shadow-[0_0_60px_rgba(0,230,118,0.3)]"
                />
            </div>
        </div>
    );
}
