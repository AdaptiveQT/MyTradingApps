import { GlowButton } from '@/components/Marketing';
import Image from 'next/image';

// Tool icons
const StructureIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

const VolumeIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

const MatrixIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
);

export default function FeaturesPage() {
    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute inset-0 bg-radial-glow" />

                <div className="container-wide mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-beast-green/10 border border-beast-green/30 mb-6">
                        <span className="text-sm text-beast-green font-medium">🔧 The Armory</span>
                    </div>

                    <h1 className="heading-cyber text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="text-white">Three Mechanical</span>
                        <br />
                        <span className="gradient-text">Weapons of War</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                        We stripped the theoretical beast into three mechanical tools.
                        No noise. Just signal.
                    </p>
                </div>
            </section>

            {/* Tool 1: Premium v8.4 */}
            <section className="section-padding bg-cyber-dark">
                <div className="container-wide mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-beast-green/20 border border-beast-green/40 flex items-center justify-center text-beast-green">
                                    <StructureIcon />
                                </div>
                                <div>
                                    <p className="text-beast-green font-medium text-sm">Tool #1</p>
                                    <h2 className="heading-cyber text-2xl md:text-3xl text-white">
                                        RetailBeast Premium v8.4
                                    </h2>
                                </div>
                            </div>

                            <p className="text-xl text-gray-300 italic mb-6">
                                The Structure Engine.
                            </p>

                            <p className="text-gray-400 mb-8">
                                Most indicators repaint the past to look like heroes. Ours predicts the future to make you a killer.
                                We stripped the code from our original &ldquo;Quantum Oracle&rdquo; tests to focus on one thing:
                                <span className="text-white font-semibold"> High-Probability Reaction Points.</span>
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex gap-3">
                                    <span className="text-beast-green mt-1">✓</span>
                                    <div>
                                        <span className="text-white font-semibold">Fresh OB Detection:</span>
                                        <span className="text-gray-400"> We don&apos;t care about &ldquo;mitigated&rdquo; blocks. If price touched it, it&apos;s dead. Only <span className="text-beast-green">PRIME/FRESH Order Blocks</span>—unmitigated zones with no prior sweeps in 4+ hours.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-beast-green mt-1">✓</span>
                                    <div>
                                        <span className="text-white font-semibold">BB 2.0 Exhaustion Logic:</span>
                                        <span className="text-gray-400"> A statistical overstretch detector. It calculates standard deviation elasticity against Order Block density. When price hits the 2SD band inside a Fresh OB, the trap is set.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-beast-green mt-1">✓</span>
                                    <div>
                                        <span className="text-white font-semibold">Quantum Lock™ Signals:</span>
                                        <span className="text-gray-400"> Proprietary confluence alerts. The signal only fires when HTF Bias (1H/4H), Structure, and Exhaustion align. No guessing.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-beast-green mt-1">✓</span>
                                    <div>
                                        <span className="text-white font-semibold">Anti-Repaint Guarantee:</span>
                                        <span className="text-gray-400"> What you see on the live candle is what stays on the chart. We build trust, not fake backtests.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="relative">
                            <div className="glass-card rounded-2xl p-4 relative overflow-hidden">
                                <Image
                                    src="/indicator-screenshots/eurusd-ob-demo.png"
                                    alt="Premium v8.4 Order Block Detection"
                                    width={600}
                                    height={400}
                                    className="rounded-xl w-full"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 to-transparent" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tool 2: Volume Beast Mode */}
            <section className="section-padding">
                <div className="container-wide mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="glass-card rounded-2xl p-4 relative overflow-hidden">
                                <Image
                                    src="/indicator-screenshots/xauusd-signals.png"
                                    alt="Volume Beast Mode Detection"
                                    width={600}
                                    height={400}
                                    className="rounded-xl w-full"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 to-transparent" />
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-beast-green/20 border border-beast-green/40 flex items-center justify-center text-beast-green">
                                    <VolumeIcon />
                                </div>
                                <div>
                                    <p className="text-beast-green font-medium text-sm">Tool #2</p>
                                    <h2 className="heading-cyber text-2xl md:text-3xl text-white">
                                        Volume Beast Mode v1.1
                                    </h2>
                                </div>
                            </div>

                            <p className="text-xl text-gray-300 italic mb-6">
                                The Truth Serum.
                            </p>

                            <p className="text-gray-400 mb-8">
                                Price can lie. Volume cannot. This tool acts as your auction proxy,
                                reading the tape so you don&apos;t have to.
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex gap-3">
                                    <span className="text-beast-green mt-1">✓</span>
                                    <div>
                                        <span className="text-white font-semibold">Ghost Tape Spikes:</span>
                                        <span className="text-gray-400"> Identifies institutional injection. We look for <span className="text-beast-green">150%+ volume anomalies</span> relative to the previous 10-candle average.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-beast-green mt-1">✓</span>
                                    <div>
                                        <span className="text-white font-semibold">Delta Flip Visualizer:</span>
                                        <span className="text-gray-400"> See the exact moment buyers turn into sellers (or vice versa). Green/Red background fills confirm the aggression shift.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-beast-green mt-1">✓</span>
                                    <div>
                                        <span className="text-white font-semibold">Killzone Weights:</span>
                                        <span className="text-gray-400"> The algorithm adjusts sensitivity based on time. <span className="text-beast-green">London Open (2.0x)</span> and <span className="text-beast-green">Silver Bullet (2.5x)</span> signals scream louder than dead Asian session noise.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-beast-green mt-1">✓</span>
                                    <div>
                                        <span className="text-white font-semibold">Session POI:</span>
                                        <span className="text-gray-400"> Auto-plots Point of Control (POC), Value Area High (VAH), and Value Area Low (VAL). If price accepts back into value, the trade is off.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tool 3: Pro Journal Matrix */}
            <section className="section-padding bg-cyber-dark">
                <div className="container-wide mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-beast-green/20 border border-beast-green/40 flex items-center justify-center text-beast-green">
                                    <MatrixIcon />
                                </div>
                                <div>
                                    <p className="text-beast-green font-medium text-sm">Tool #3</p>
                                    <h2 className="heading-cyber text-2xl md:text-3xl text-white">
                                        Pro Journal Matrix
                                    </h2>
                                </div>
                            </div>

                            <p className="text-xl text-gray-300 italic mb-6">
                                The Mirror.
                            </p>

                            <p className="text-gray-400 mb-8">
                                You think you&apos;re trading well? The Matrix will tell you the truth.
                                This isn&apos;t just a diary; it&apos;s a performance heatmap.
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex gap-3">
                                    <span className="text-beast-green mt-1">✓</span>
                                    <div>
                                        <span className="text-white font-semibold">Confluence Scorer:</span>
                                        <span className="text-gray-400"> Every trade requires a score (0-3). If you took a &ldquo;0&rdquo; score trade, the journal flags it as <span className="text-red-400">&ldquo;Impulse/Gambling&rdquo;</span>.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-beast-green mt-1">✓</span>
                                    <div>
                                        <span className="text-white font-semibold">Session Heatmaps:</span>
                                        <span className="text-gray-400"> Discover your biological edge. Maybe you&apos;re a god in London but a victim in New York. The Matrix highlights your profitable hours in <span className="text-beast-green">green</span> and bleeding hours in <span className="text-red-400">red</span>.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-beast-green mt-1">✓</span>
                                    <div>
                                        <span className="text-white font-semibold">Risk-First Compounding:</span>
                                        <span className="text-gray-400"> Built-in Quarter-Kelly calculator. Tells you exactly what lot size to use to stay within the &ldquo;Retail Safe&rdquo; growth curve (180-450% CAGR).</span>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-beast-green mt-1">✓</span>
                                    <div>
                                        <span className="text-white font-semibold">Automated Import:</span>
                                        <span className="text-gray-400"> Drag and drop your MT4/MT5 history. The Beast categorizes it instantly.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="relative">
                            <div className="glass-card rounded-2xl p-4 relative overflow-hidden">
                                <Image
                                    src="/journal-preview.png"
                                    alt="Pro Journal Matrix Heatmap"
                                    width={600}
                                    height={400}
                                    className="rounded-xl w-full"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 to-transparent" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Loop */}
            <section className="section-padding">
                <div className="container-narrow mx-auto text-center">
                    <h2 className="heading-cyber text-3xl md:text-4xl text-white mb-8">
                        The <span className="text-beast-green">Closed Loop</span>
                    </h2>

                    <div className="glass-card rounded-2xl p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-lg">
                            <span className="text-white font-semibold">Premium v8.4</span>
                            <span className="text-beast-green">→</span>
                            <span className="text-white font-semibold">Volume v1.1</span>
                            <span className="text-beast-green">→</span>
                            <span className="text-white font-semibold">Journal Matrix</span>
                            <span className="text-beast-green">→</span>
                            <span className="text-gray-400 italic">Refine</span>
                            <span className="text-beast-green">→</span>
                            <span className="text-gray-400 italic">Repeat</span>
                        </div>

                        <p className="text-gray-400 mt-6">
                            Structure → Confirmation → Execution → Data → Evolution
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding bg-cyber-dark relative overflow-hidden">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 opacity-15 pointer-events-none hidden lg:block">
                    <Image
                        src="/mascot/beast-pose-2-hero.png"
                        alt=""
                        width={500}
                        height={500}
                        className="drop-shadow-[0_0_80px_rgba(0,230,118,0.4)]"
                    />
                </div>

                <div className="container-narrow mx-auto text-center relative z-10">
                    <h2 className="heading-cyber text-3xl md:text-4xl text-white mb-4">
                        Arm Yourself
                    </h2>
                    <p className="text-gray-400 mb-8">
                        The hunt begins with the right weapons. Choose your loadout.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <GlowButton href="/pricing" size="lg">
                            View Pricing
                        </GlowButton>
                        <GlowButton href="/docs" variant="outline" size="lg">
                            Read the Manual
                        </GlowButton>
                    </div>
                </div>
            </section>
        </div>
    );
}
