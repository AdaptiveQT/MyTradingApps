'use client';

import dynamic from 'next/dynamic';
import { GlowButton } from '@/components/Marketing';

// Dynamically import Mascot3D to avoid SSR issues
const Mascot3D = dynamic(() => import('@/components/Mascot3D'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-beast-green border-t-transparent rounded-full animate-spin" />
        </div>
    ),
});

export default function AboutPage() {
    return (
        <div className="relative">
            {/* Hero */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute inset-0 bg-radial-glow" />

                <div className="container-wide mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="heading-cyber text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                <span className="text-white">The Mechanical</span>
                                <br />
                                <span className="gradient-text">Trading Ecosystem</span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-6">
                                Structure detection. Volume confirmation. Edge tracking. All in one.
                            </p>

                            <p className="text-gray-400 mb-8">
                                RetailBeastFX isn&apos;t just another indicator – it&apos;s the full package.
                                We combined institutional-grade signal detection with a comprehensive trading journal
                                and an active community of serious traders. Built from real trading experience,
                                battle-tested in live markets, and continuously improved based on what actually works.
                            </p>

                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-beast-green">v8.4</p>
                                    <p className="text-sm text-gray-500">Premium Release</p>
                                </div>
                                <div className="w-px h-12 bg-cyber-border" />
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-beast-green">3,000+</p>
                                    <p className="text-sm text-gray-500">Backtested Trades</p>
                                </div>
                                <div className="w-px h-12 bg-cyber-border" />
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-beast-green">Trinity</p>
                                    <p className="text-sm text-gray-500">Strategy Core</p>
                                </div>
                            </div>
                        </div>

                        {/* 3D Mascot - Brand Symbol */}
                        <div className="relative">
                            <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-beast-green/10 via-transparent to-beast-green/5" />

                                {/* 3D Mascot */}
                                <div className="relative z-10 h-[400px]">
                                    <Mascot3D scale={2.5} />
                                </div>

                                {/* Brand Label */}
                                <div className="text-center mt-4 relative z-10">
                                    <p className="text-beast-green font-semibold heading-cyber">The Beast</p>
                                    <p className="text-gray-400 text-sm">Discipline. Execution. Profits.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Origin Story */}
            <section className="section-padding bg-cyber-dark">
                <div className="container-narrow mx-auto">
                    <h2 className="heading-cyber text-3xl md:text-4xl text-white text-center mb-8">
                        From <span className="text-beast-green">Quantum Theory</span> to Retail Reality
                    </h2>

                    <div className="glass-card rounded-2xl p-8 md:p-12 space-y-6">
                        <p className="text-gray-300 leading-relaxed">
                            RetailBeastFX started as a thought experiment: <span className="text-beast-green font-semibold">What if we built the most aggressive trading system imaginable?</span>
                        </p>

                        <p className="text-gray-400 leading-relaxed">
                            The result was &ldquo;Quantum Oracle Arb&rdquo; — a theoretical monster stacking cross-venue atomic arbitrage,
                            predictive mempool access, and quantum-aided price prediction. Back-of-envelope math: 180,000% to 1.2 million% CAGR.
                            One problem: it would self-destruct after extracting $15-30B as markets and regulators adapted.
                        </p>

                        <p className="text-gray-400 leading-relaxed">
                            That &ldquo;suicide mission&rdquo; sparked the real question: <span className="text-white font-semibold">What actually works for retail traders without colocation, without quantum computers, without $100M?</span>
                        </p>

                        <p className="text-gray-300 leading-relaxed">
                            We stripped the theoretical beast down to its core: a mechanical three-condition confluence system
                            that runs on TradingView. No narratives, no guru energy — just <span className="text-beast-green font-semibold">Fresh Order Blocks + BB 2.0 Exhaustion + Killzone Volume Confirmation</span>.
                        </p>

                        <div className="border-l-4 border-beast-green pl-6 mt-8">
                            <p className="text-xl text-white italic">
                                &ldquo;We built a god-tier algo that would break the market. Then we stripped it down so you wouldn&apos;t blow your account.&rdquo;
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy */}
            <section className="section-padding">
                <div className="container-narrow mx-auto text-center">
                    <h2 className="heading-cyber text-3xl md:text-4xl text-white mb-8">
                        <span className="text-beast-green">Measure</span> or Die
                    </h2>

                    <div className="glass-card rounded-2xl p-8 md:p-12">
                        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                            &ldquo;We don&apos;t care about narratives. We don&apos;t care &apos;where the banks are.&apos;
                            We care about <span className="text-beast-green font-semibold">Fresh OBs, Killzone surges, and positive delta flips</span>.
                            If the matrix isn&apos;t green, hands stay flat. Every trade logged, every edge quantified.
                            Green cells or graveyard.&rdquo;
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section-padding">
                <div className="container-wide mx-auto">
                    <h2 className="heading-cyber text-3xl md:text-4xl text-white text-center mb-12">
                        What We <span className="text-beast-green">Believe</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '📊',
                                title: 'Data Over Emotion',
                                description: 'Feelings lie. Numbers don\'t. Every decision should be backed by your trading data.',
                            },
                            {
                                icon: '🎯',
                                title: 'Mechanical Execution',
                                description: 'The best traders are robots with rules. Build your system, trust your process.',
                            },
                            {
                                icon: '📈',
                                title: 'Continuous Improvement',
                                description: 'Trading is a craft. Review, refine, repeat. Your journal is your coach.',
                            },
                            {
                                icon: '🤝',
                                title: 'Community Accountability',
                                description: 'We rise together. Share your wins, own your losses, learn from each other.',
                            },
                            {
                                icon: '🔒',
                                title: 'Your Data, Your Control',
                                description: 'Privacy first. Your trading data is encrypted and never shared. Period.',
                            },
                            {
                                icon: '⚡',
                                title: '2025-Proof Innovation',
                                description: 'Markets evolve, so do we. Continuous updates based on what actually works.',
                            },
                        ].map((value, i) => (
                            <div key={i} className="glass-card rounded-xl p-6 text-center">
                                <div className="text-4xl mb-4">{value.icon}</div>
                                <h3 className="heading-cyber text-lg text-white mb-2">{value.title}</h3>
                                <p className="text-gray-400 text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="section-padding bg-cyber-dark">
                <div className="container-narrow mx-auto">
                    <h2 className="heading-cyber text-3xl md:text-4xl text-white text-center mb-12">
                        What You <span className="text-beast-green">Get</span>
                    </h2>

                    <div className="space-y-12">
                        <div className="flex gap-6">
                            <div className="w-1 bg-beast-green/30 rounded-full relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-beast-green rounded-full" />
                            </div>
                            <div>
                                <p className="text-beast-green font-semibold mb-2">🎯 Premium Indicator</p>
                                <h3 className="text-xl text-white mb-2">Institutional-Grade Signals</h3>
                                <p className="text-gray-400">
                                    Auto-detected Order Blocks, SMC/ICT confluences, Killzone overlays, and our proprietary
                                    Quantum Lock™ system. Real-time alerts for entries, take-profits, and stop-losses.
                                    Works on Forex, Crypto, Indices – any market, any timeframe.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-1 bg-beast-green/30 rounded-full relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-beast-green rounded-full" />
                            </div>
                            <div>
                                <p className="text-beast-green font-semibold mb-2">📊 Advanced Journal</p>
                                <h3 className="text-xl text-white mb-2">Your Personal Trading Coach</h3>
                                <p className="text-gray-400">
                                    Full trade logging with MT5 import, detailed analytics, streak tracking, and
                                    risk-reward calculations. See exactly where you&apos;re leaving money on the table
                                    and fix it. Data doesn&apos;t lie.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-1 bg-beast-green/30 rounded-full relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-beast-green rounded-full" />
                            </div>
                            <div>
                                <p className="text-beast-green font-semibold mb-2">👥 Active Community</p>
                                <h3 className="text-xl text-white mb-2">Trade With Serious Traders</h3>
                                <p className="text-gray-400">
                                    Join thousands of traders in our Discord. Live market analysis, trade ideas,
                                    killzone alerts from our Alpha Edge bot, and a community that keeps you accountable.
                                    No pump-and-dump nonsense – just real traders helping each other win.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-1 bg-beast-green/30 rounded-full relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-beast-green rounded-full" />
                            </div>
                            <div>
                                <p className="text-beast-green font-semibold mb-2">⚡ Multi-Platform</p>
                                <h3 className="text-xl text-white mb-2">Trade Anywhere</h3>
                                <p className="text-gray-400">
                                    TradingView indicator, MT5 version, web-based journal accessible from any device.
                                    Your whole trading system, unified and accessible wherever you are.
                                    No more switching between 10 different tools.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-1 bg-beast-green/30 rounded-full relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-beast-green rounded-full" />
                            </div>
                            <div>
                                <p className="text-beast-green font-semibold mb-2">🚀 Constantly Evolving</p>
                                <h3 className="text-xl text-white mb-2">We Never Stop Improving</h3>
                                <p className="text-gray-400">
                                    Regular updates based on community feedback and market changes. New features,
                                    new strategies, new tools. When you join RetailBeastFX, you&apos;re getting
                                    a product that gets better every single week.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding">
                <div className="container-narrow mx-auto text-center">
                    <h2 className="heading-cyber text-3xl md:text-4xl text-white mb-4">
                        Ready to Join the <span className="text-beast-green">Beast Pack?</span>
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Start your journey to consistent profitability today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <GlowButton href="/pricing" size="lg">
                            Get Started
                        </GlowButton>
                        <GlowButton href="/community" variant="outline" size="lg">
                            Join Community
                        </GlowButton>
                    </div>
                </div>
            </section>
        </div>
    );
}
