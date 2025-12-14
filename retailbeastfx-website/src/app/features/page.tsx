import { GlowButton, FeatureCard } from '@/components/Marketing';
import Image from 'next/image';

// Feature icons
const OrderBlockIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

const FVGIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
    </svg>
);

const KillzoneIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const QuantumIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

const GhostTapeIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const BBTouchIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
);

const JournalAnalyticsIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

const ExpectancyIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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
                        <span className="text-sm text-beast-green font-medium">Premium Features</span>
                    </div>

                    <h1 className="heading-cyber text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="text-white">Every Tool You Need to</span>
                        <br />
                        <span className="gradient-text">Dominate the Markets</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                        From Fresh Order Blocks to AI-powered journal insights – RetailBeastFX gives you
                        the complete toolkit for ICT/SMC trading mastery.
                    </p>
                </div>
            </section>

            {/* Indicator Features */}
            <section className="section-padding bg-cyber-dark">
                <div className="container-wide mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="heading-cyber text-3xl md:text-4xl text-white mb-4">
                            The <span className="text-beast-green">Indicator</span> Tools
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            TradingView-native tools built on real ICT/SMC principles. No repainting. No lag.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<OrderBlockIcon />}
                            title="Fresh Order Blocks"
                            description="Automatically identify unmitigated OBs that institutions are targeting. Shows bullish and bearish OBs with mitigation status."
                            highlighted={true}
                        />
                        <FeatureCard
                            icon={<FVGIcon />}
                            title="Fair Value Gaps"
                            description="Spot imbalances before price fills them. Filter by size, age, and timeframe for high-probability entries."
                        />
                        <FeatureCard
                            icon={<KillzoneIcon />}
                            title="Killzone Sessions"
                            description="Asian, London, and New York sessions with custom times. Highlight high-volatility windows for optimal entries."
                        />
                        <FeatureCard
                            icon={<QuantumIcon />}
                            title="Quantum Lock™"
                            description="Proprietary confluence scorer. Combines multiple SMC factors into a single confirmation signal."
                        />
                        <FeatureCard
                            icon={<GhostTapeIcon />}
                            title="Ghost Tape"
                            description="Invisible liquidity tracker. See where smart money is accumulating before the move happens."
                        />
                        <FeatureCard
                            icon={<BBTouchIcon />}
                            title="BB Touch Alerts"
                            description="Bollinger Band extreme touches with RSI divergence detection. Perfect for reversal entries."
                        />
                    </div>
                </div>
            </section>

            {/* Journal Features */}
            <section className="section-padding">
                <div className="container-wide mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="heading-cyber text-3xl md:text-4xl text-white mb-4">
                            <span className="text-beast-green">Journal</span> Analytics
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            More than a trade log – a complete performance analysis system.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<JournalAnalyticsIcon />}
                            title="Performance Dashboard"
                            description="Real-time stats: Win rate, expectancy, Sharpe ratio, max drawdown. All updating as you trade."
                        />
                        <FeatureCard
                            icon={<ExpectancyIcon />}
                            title="Setup Expectancy"
                            description="See which setups actually pay. Filter by pair, session, direction, and confluences."
                        />
                        <FeatureCard
                            icon={<KillzoneIcon />}
                            title="Session Heatmaps"
                            description="Visualize your best trading hours. Stop trading when you're statistically losing."
                        />
                        <FeatureCard
                            icon={<QuantumIcon />}
                            title="AI Insights"
                            description="Get automated suggestions based on your trading data. 'You win 80% more during Power Hour.'"
                            comingSoon={true}
                        />
                        <FeatureCard
                            icon={<GhostTapeIcon />}
                            title="TradingView Webhook"
                            description="Auto-log trades from your indicator alerts. No manual entry required."
                        />
                        <FeatureCard
                            icon={<OrderBlockIcon />}
                            title="Export & Backup"
                            description="Export to CSV/PDF. Sync to Google Sheets. Your data, your control."
                        />
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="section-padding bg-cyber-dark">
                <div className="container-narrow mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="heading-cyber text-3xl md:text-4xl text-white mb-4">
                            Why <span className="text-beast-green">RetailBeastFX</span>?
                        </h2>
                        <p className="text-gray-400">
                            Compare us to standalone tools and see the difference.
                        </p>
                    </div>

                    <div className="glass-card rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-beast-green/20">
                                    <th className="text-left p-4 text-gray-400 font-medium">Feature</th>
                                    <th className="text-center p-4 text-beast-green font-medium">RetailBeastFX</th>
                                    <th className="text-center p-4 text-gray-500 font-medium">Standalone Tools</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { feature: 'ICT/SMC Indicator', rbfx: true, other: true },
                                    { feature: 'Integrated Journal', rbfx: true, other: false },
                                    { feature: 'Auto-Import Signals', rbfx: true, other: false },
                                    { feature: 'Real-Time Analytics', rbfx: true, other: 'Limited' },
                                    { feature: 'Expectancy by Setup', rbfx: true, other: false },
                                    { feature: 'Session Heatmaps', rbfx: true, other: false },
                                    { feature: 'Mobile PWA', rbfx: true, other: 'Some' },
                                    { feature: 'One-Time Cost Option', rbfx: true, other: false },
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-beast-green/10 last:border-0">
                                        <td className="p-4 text-gray-300">{row.feature}</td>
                                        <td className="p-4 text-center">
                                            {row.rbfx === true ? (
                                                <span className="text-beast-green text-xl">✓</span>
                                            ) : row.rbfx}
                                        </td>
                                        <td className="p-4 text-center text-gray-500">
                                            {row.other === true ? '✓' : row.other === false ? '✗' : row.other}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding relative overflow-hidden">
                {/* Background mascot */}
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
                        Ready to Level Up?
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Start with our free tier or go premium for the full experience.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <GlowButton href="/pricing" size="lg">
                            View Pricing
                        </GlowButton>
                        <GlowButton href="/journal" variant="outline" size="lg">
                            Try Journal Free
                        </GlowButton>
                    </div>
                </div>
            </section>
        </div>
    );
}
